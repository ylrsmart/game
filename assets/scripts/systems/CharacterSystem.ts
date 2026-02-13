/**
 * 角色系统
 * 负责角色属性、升级、技能管理
 */

import { _decorator, Component } from 'cc';
import { PlayerData } from '../data/PlayerData';
import { GAME_CONSTANTS, CLASS_CONFIG, SKILL_CONFIG } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';

const { ccclass, property } = _decorator;

export interface CharacterStats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    attack: number;
    defense: number;
    speed: number;
    crit: number;
    critDamage: number;
}

@ccclass('CharacterSystem')
export class CharacterSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    /**
     * 获取当前角色完整属性（包含装备加成）
     */
    public getCharacterStats(): CharacterStats {
        if (!this._playerData) return this.getDefaultStats();

        const char = this._playerData.character;
        const equip = this._playerData.inventory.equipment;

        let stats: CharacterStats = {
            hp: char.hp,
            maxHp: char.maxHp,
            mp: char.mp,
            maxMp: char.maxMp,
            attack: char.attack,
            defense: char.defense,
            speed: char.speed,
            crit: char.crit,
            critDamage: 1.5 // 默认暴击伤害 150%
        };

        // 添加装备加成
        if (equip.weapon?.stats.attack) stats.attack += equip.weapon.stats.attack;
        if (equip.armor?.stats.defense) stats.defense += equip.armor.stats.defense;
        if (equip.armor?.stats.hp) stats.maxHp += equip.armor.stats.hp;
        if (equip.helmet?.stats.hp) stats.maxHp += equip.helmet.stats.hp;
        if (equip.accessory?.stats.crit) stats.crit += equip.accessory.stats.crit;

        // 同步当前 HP/MP 到最大值
        stats.hp = Math.min(stats.hp, stats.maxHp);
        stats.mp = Math.min(stats.mp, stats.maxMp);

        return stats;
    }

    /**
     * 初始化角色
     */
    public initCharacter(playerData: PlayerData): void {
        this._playerData = playerData;

        // 根据等级设置属性
        this.updateStatsByLevel();
    }

    /**
     * 根据等级更新属性
     */
    private updateStatsByLevel(): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        const classConfig = CLASS_CONFIG[char.class];
        const growth = classConfig.growthStats;

        // 计算基础属性增长
        const levelBonus = char.level - 1;
        char.hp = classConfig.baseStats.hp + growth.hp * levelBonus;
        char.maxHp = char.hp;
        char.mp = classConfig.baseStats.mp + growth.mp * levelBonus;
        char.maxMp = char.mp;
        char.attack = classConfig.baseStats.attack + growth.attack * levelBonus;
        char.defense = classConfig.baseStats.defense + growth.defense * levelBonus;
        char.speed = classConfig.baseStats.speed + growth.speed * levelBonus;
        char.crit = classConfig.baseStats.crit + growth.crit * levelBonus;
    }

    /**
     * 升级角色
     */
    public levelUp(): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        char.level++;

        // 更新属性
        this.updateStatsByLevel();

        // 增加技能点
        char.skillPoints++;

        // 恢复所有 HP/MP
        char.hp = char.maxHp;
        char.mp = char.maxMp;

        // 触发升级事件
        EventManager.instance.emit(GameEvents.PLAYER_LEVEL_UP, char.level);
    }

    /**
     * 学习技能
     */
    public learnSkill(skillId: string): boolean {
        if (!this._playerData) return false;

        const char = this._playerData.character;
        const skill = SKILL_CONFIG[skillId];
        if (!skill) {
            console.error(`技能不存在: ${skillId}`);
            return false;
        }

        // 检查技能点
        if (char.skillPoints <= 0) {
            console.error('技能点不足');
            return false;
        }

        // 检查是否已学习
        const existing = char.skills.find(s => s.id === skillId);
        if (existing) {
            if (existing.level >= skill.maxLevel) {
                console.error('技能已满级');
                return false;
            }
            existing.level++;
        } else {
            char.skills.push({
                id: skillId,
                level: 1,
                exp: 0,
                unlocked: true
            });
        }

        char.skillPoints--;
        return true;
    }

    /**
     * 获取已学技能
     */
    public getSkills(): Array<{ id: string; level: number }> {
        if (!this._playerData) return [];
        return this._playerData.character.skills.map(s => ({
            id: s.id,
            level: s.level
        }));
    }

    /**
     * 治疗
     */
    public heal(amount: number): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        const oldHp = char.hp;
        char.hp = Math.min(char.hp + amount, char.maxHp);
        const healed = char.hp - oldHp;

        EventManager.instance.emit(GameEvents.PLAYER_HP_CHANGE, char.hp, char.maxHp);
        EventManager.instance.emit(GameEvents.BATTLE_HEAL, healed);
    }

    /**
     * 受到伤害
     */
    public takeDamage(damage: number): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        const defense = this.getCharacterStats().defense;

        // 计算减伤（防御力减免）
        const actualDamage = Math.max(1, damage - defense * 0.5);
        char.hp -= actualDamage;

        EventManager.instance.emit(GameEvents.PLAYER_HP_CHANGE, char.hp, char.maxHp);
        EventManager.instance.emit(GameEvents.BATTLE_DAMAGE, actualDamage);

        // 检查死亡
        if (char.hp <= 0) {
            char.hp = 0;
            EventManager.instance.emit(GameEvents.PLAYER_DIE);
        }
    }

    /**
     * 消耗 MP
     */
    public consumeMp(amount: number): boolean {
        if (!this._playerData) return false;

        const char = this._playerData.character;
        if (char.mp < amount) {
            return false; // MP不足
        }

        char.mp -= amount;
        EventManager.instance.emit(GameEvents.PLAYER_MP_CHANGE, char.mp, char.maxMp);
        return true;
    }

    /**
     * 恢复 MP
     */
    public restoreMp(amount: number): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        char.mp = Math.min(char.mp + amount, char.maxMp);
        EventManager.instance.emit(GameEvents.PLAYER_MP_CHANGE, char.mp, char.maxMp);
    }

    /**
     * 获取默认属性
     */
    private getDefaultStats(): CharacterStats {
        return {
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 10,
            defense: 5,
            speed: 10,
            crit: 5,
            critDamage: 1.5
        };
    }

    /**
     * 复活（回城）
     */
    public revive(): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        char.hp = Math.floor(char.maxHp * 0.3); // 复活后恢复30% HP
        char.mp = Math.floor(char.maxMp * 0.5); // 恢复50% MP

        EventManager.instance.emit(GameEvents.PLAYER_HP_CHANGE, char.hp, char.maxHp);
        EventManager.instance.emit(GameEvents.PLAYER_MP_CHANGE, char.mp, char.maxMp);
    }
}
