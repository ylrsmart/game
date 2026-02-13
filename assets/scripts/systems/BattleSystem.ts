/**
 * 战斗系统
 * 回合制战斗逻辑
 */

import { _decorator, Component, Node } from 'cc';
import { CharacterSystem, CharacterStats } from './CharacterSystem';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';
import { ENEMY_CONFIG, SKILL_CONFIG } from '../data/GameConfig';

const { ccclass, property } = _decorator;

export interface BattleUnit {
    id: string;
    name: string;
    isPlayer: boolean;
    stats: CharacterStats;
    sprite: string;
    skills: string[];
    buffs: Buff[];
}

export interface Buff {
    id: string;
    type: 'buff' | 'debuff';
    effect: string;
    value: number;
    duration: number;
    turns: number;
}

export interface BattleResult {
    win: boolean;
    exp: number;
    gold: number;
    drops: any[];
}

@ccclass('BattleSystem')
export class BattleSystem extends Component {
    // 战斗参与者
    private _player: BattleUnit | null = null;
    private _enemies: BattleUnit[] = [];

    // 战斗状态
    private _inBattle: boolean = false;
    private _currentTurn: number = 0;
    private _turnTimer: number = 0;
    private _isPlayerTurn: boolean = true;

    // 战斗设置
    @property({ tooltip: '每回合时长（秒）' })
    turnDuration: number = 10;

    // 角色系统引用
    private _characterSystem: CharacterSystem | null = null;

    protected onLoad(): void {
        // 查找角色系统
        this._characterSystem = this.getComponent(CharacterSystem);
    }

    /**
     * 开始战斗
     */
    public async startBattle(enemyId: string): Promise<BattleResult> {
        if (this._inBattle) {
            console.error('战斗已在进行中');
            return { win: false, exp: 0, gold: 0, drops: [] };
        }

        this._inBattle = true;
        this._currentTurn = 0;
        this._isPlayerTurn = true;

        // 初始化玩家
        this._player = this.createPlayerUnit();

        // 初始化敌人
        this._enemies = [this.createEnemyUnit(enemyId)];

        // 触发战斗开始事件
        EventManager.instance.emit(GameEvents.BATTLE_START, this._player, this._enemies);

        // 战斗循环
        const result = await this.battleLoop();

        // 战斗结束
        this._inBattle = false;
        EventManager.instance.emit(GameEvents.BATTLE_END, result);

        return result;
    }

    /**
     * 创建玩家战斗单位
     */
    private createPlayerUnit(): BattleUnit {
        if (!this._characterSystem) {
            throw new Error('角色系统未初始化');
        }

        const stats = this._characterSystem.getCharacterStats();

        return {
            id: 'player',
            name: '玩家',
            isPlayer: true,
            stats: { ...stats },
            sprite: 'hero',
            skills: this._characterSystem.getSkills().map(s => s.id),
            buffs: []
        };
    }

    /**
     * 创建敌人战斗单位
     */
    private createEnemyUnit(enemyId: string): BattleUnit {
        const config = ENEMY_CONFIG[enemyId];
        if (!config) {
            throw new Error(`敌人配置不存在: ${enemyId}`);
        }

        return {
            id: enemyId,
            name: config.name,
            isPlayer: false,
            stats: {
                hp: config.stats.hp,
                maxHp: config.stats.hp,
                mp: 0,
                maxMp: 0,
                attack: config.stats.attack,
                defense: config.stats.defense,
                speed: config.stats.speed,
                crit: 5,
                critDamage: 1.5
            },
            sprite: config.sprite,
            skills: config.skills,
            buffs: []
        };
    }

    /**
     * 战斗主循环
     */
    private async battleLoop(): Promise<BattleResult> {
        while (this._inBattle) {
            await this.startTurn();

            // 检查战斗结束
            if (this.checkBattleEnd()) {
                break;
            }

            // 切换回合
            this._isPlayerTurn = !this._isPlayerTurn;
        }

        return this.calculateBattleResult();
    }

    /**
     * 开始回合
     */
    private async startTurn(): Promise<void> {
        this._currentTurn++;

        EventManager.instance.emit(GameEvents.BATTLE_TURN_START, this._currentTurn);

        // 处理 Buff 持续时间
        this.processBuffs(this._isPlayerTurn ? this._player! : this._enemies[0]);

        if (this._isPlayerTurn) {
            await this.playerTurn();
        } else {
            await this.enemyTurn();
        }

        EventManager.instance.emit(GameEvents.BATTLE_TURN_END, this._currentTurn);
    }

    /**
     * 玩家回合
     */
    private async playerTurn(): Promise<void> {
        // TODO: 显示玩家操作界面
        // 玩家选择：攻击、技能、物品、逃跑

        // 模拟玩家攻击
        await Utils.delay(1000);
        this.useSkill(this._player!, this._enemies[0], 'attack');
    }

    /**
     * 敌人回合
     */
    private async enemyTurn(): Promise<void> {
        const enemy = this._enemies[0];

        // AI 决策
        await Utils.delay(1000);

        // 简单 AI：直接攻击
        this.useSkill(enemy, this._player!, 'attack');
    }

    /**
     * 使用技能
     */
    public useSkill(attacker: BattleUnit, target: BattleUnit, skillId: string): void {
        const skill = SKILL_CONFIG[skillId];
        if (!skill) {
            // 默认攻击
            this.dealDamage(attacker, target, attacker.stats.attack);
            return;
        }

        // 检查 MP（仅玩家）
        if (attacker.isPlayer) {
            const charSystem = this.getComponent(CharacterSystem);
            if (!charSystem?.consumeMp(skill.manaCost)) {
                console.log('MP不足');
                return;
            }
        }

        // 应用技能效果
        if (skill.damage) {
            const damage = Math.floor(attacker.stats.attack * skill.damage / 100);
            this.dealDamage(attacker, target, damage);
        }

        if (skill.heal) {
            const heal = Math.floor(attacker.stats.attack * skill.heal / 100);
            this.applyHeal(attacker, heal);
        }

        if (skill.effect) {
            this.applyEffect(target, skill.effect);
        }

        EventManager.instance.emit(GameEvents.BATTLE_SKILL_USE, attacker, target, skillId);
    }

    /**
     * 造成伤害
     */
    private dealDamage(attacker: BattleUnit, target: BattleUnit, baseDamage: number): void {
        // 计算暴击
        const isCrit = Utils.randomInt(1, 100) <= attacker.stats.crit;
        let damage = baseDamage;

        if (isCrit) {
            damage = Math.floor(damage * attacker.stats.critDamage);
        }

        // 计算减伤
        const damageAfterDefense = Math.max(1, damage - target.stats.defense * 0.3);

        // 应用伤害
        target.stats.hp -= damageAfterDefense;

        EventManager.instance.emit(GameEvents.BATTLE_DAMAGE, damageAfterDefense, isCrit);

        // 检查死亡
        if (target.stats.hp <= 0) {
            target.stats.hp = 0;
            this.onUnitDeath(target);
        }
    }

    /**
     * 治疗
     */
    private applyHeal(target: BattleUnit, amount: number): void {
        target.stats.hp = Math.min(target.stats.hp + amount, target.stats.maxHp);
        EventManager.instance.emit(GameEvents.BATTLE_HEAL, amount);
    }

    /**
     * 应用效果（Buff/Debuff）
     */
    private applyEffect(target: BattleUnit, effect: string): void {
        // TODO: 实现各种效果
        switch (effect) {
            case 'slow':
                target.buffs.push({
                    id: 'slow',
                    type: 'debuff',
                    effect: 'speed',
                    value: -0.3,
                    duration: 2,
                    turns: 2
                });
                break;
            case 'buff_attack':
                target.buffs.push({
                    id: 'buff_attack',
                    type: 'buff',
                    effect: 'attack',
                    value: 0.2,
                    duration: 3,
                    turns: 3
                });
                break;
        }
    }

    /**
     * 处理 Buff 持续时间
     */
    private processBuffs(unit: BattleUnit): void {
        unit.buffs = unit.buffs.filter(buff => {
            buff.turns--;
            return buff.turns > 0;
        });
    }

    /**
     * 单位死亡
     */
    private onUnitDeath(unit: BattleUnit): void {
        if (unit.isPlayer) {
            // 玩家死亡
            this._inBattle = false;
        } else {
            // 敌人死亡
            this._enemies = this._enemies.filter(e => e.id !== unit.id);
        }
    }

    /**
     * 检查战斗结束
     */
    private checkBattleEnd(): boolean {
        const playerDead = this._player!.stats.hp <= 0;
        const allEnemiesDead = this._enemies.every(e => e.stats.hp <= 0);

        return playerDead || allEnemiesDead;
    }

    /**
     * 计算战斗结果
     */
    private calculateBattleResult(): BattleResult {
        const win = !this._enemies.every(e => e.stats.hp <= 0);

        if (win) {
            const enemy = ENEMY_CONFIG[this._enemies[0].id];
            return {
                win: true,
                exp: enemy.exp,
                gold: enemy.gold,
                drops: [] // TODO: 计算掉落
            };
        } else {
            return {
                win: false,
                exp: 0,
                gold: 0,
                drops: []
            };
        }
    }

    /**
     * 跳过回合
     */
    public skipTurn(): void {
        // 直接进入下一回合
    }

    /**
     * 逃跑
     */
    public attemptEscape(): boolean {
        // 逃跑成功率计算
        const escapeChance = 30 + this._player!.stats.speed * 0.5;
        const success = Utils.randomInt(1, 100) <= escapeChance;

        if (success) {
            this._inBattle = false;
        }

        return success;
    }
}
