/**
 * 数据管理器
 * 负责玩家数据的创建、修改和验证
 */

import { _decorator, Component } from 'cc';
import { PlayerData } from '../data/PlayerData';
import { GAME_CONSTANTS, CLASS_CONFIG, BUILDING_CONFIG } from '../data/GameConfig';

const { ccclass } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    /**
     * 创建新玩家数据
     */
    public createNewPlayer(characterClass?: 'warrior' | 'mage' | 'healer' | 'assassin'): PlayerData {
        const now = Date.now();
        const playerClass = characterClass || 'warrior';

        const playerData: PlayerData = {
            // ============== 基础信息 ==============
            id: this.generatePlayerId(),
            nickname: '天选之子',
            avatar: 'avatar_default',
            createTime: now,
            lastLoginTime: now,

            // ============== 角色属性 ==============
            character: {
                race: 'human',
                class: playerClass,
                level: 1,
                exp: 0,
                expToNext: GAME_CONSTANTS.EXP_TABLE[0],

                // 根据职业设置基础属性
                ...CLASS_CONFIG[playerClass].baseStats,
                maxHp: CLASS_CONFIG[playerClass].baseStats.hp,
                mp: CLASS_CONFIG[playerClass].baseStats.mp,
                maxMp: CLASS_CONFIG[playerClass].baseStats.mp,

                // 初始技能
                skills: CLASS_CONFIG[playerClass].startingSkills.map(skillId => ({
                    id: skillId,
                    level: 1,
                    exp: 0,
                    unlocked: true
                })),
                skillPoints: 0
            },

            // ============== 宠物系统 ==============
            pets: {
                slots: 3,
                activePets: [],
                storagePets: []
            },

            // ============== 建筑系统 ==============
            base: {
                level: 1,
                resources: {
                    gold: 1000,  // 初始资金
                    wood: 100,
                    stone: 100,
                    crystals: 50
                },
                buildings: [],
                decorations: []
            },

            // ============== 装备和背包 ==============
            inventory: {
                capacity: 30,
                items: [],
                equipment: {
                    weapon: null,
                    armor: null,
                    helmet: null,
                    accessory: null
                }
            },

            // ============== 成就系统 ==============
            achievements: [],
            achievementPoints: 0,

            // ============== 任务系统 ==============
            quests: {
                completed: [],
                active: [],
                mainQuestProgress: 0
            },

            // ============== 探索进度 ==============
            exploration: {
                currentMapId: 'starter_village',
                visitedMaps: ['starter_village'],
                discoveredSecrets: []
            },

            // ============== 社交数据 (预留) ==============
            social: undefined,

            // ============== 游戏设置 ==============
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                vibrationEnabled: true,
                language: 'zh-CN'
            },

            // ============== 版本信息 ==============
            version: 1,
            isFirstLaunch: true
        };

        // 初始赠送新手礼包物品
        this.addStartingItems(playerData);

        return playerData;
    }

    /**
     * 生成玩家ID
     */
    private generatePlayerId(): string {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 添加新手物品
     */
    private addStartingItems(playerData: PlayerData): void {
        // 新手装备
        playerData.inventory.items.push({
            id: 'newbie_weapon',
            instanceId: this.generateInstanceId(),
            type: 'equip',
            quantity: 1,
            data: {
                name: '新手剑',
                rarity: 'common',
                level: 1,
                stats: { attack: 5 },
                enhancements: 0
            }
        });

        playerData.inventory.equipment.weapon = playerData.inventory.items[0].data;

        // 恢复药水
        playerData.inventory.items.push({
            id: 'health_potion',
            instanceId: this.generateInstanceId(),
            type: 'consumable',
            quantity: 10,
            data: { heal: 50 }
        });
    }

    /**
     * 生成实例ID
     */
    private generateInstanceId(): string {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 计算角色总属性（包含装备加成）
     */
    public calculateTotalStats(playerData: PlayerData): {
        hp: number;
        mp: number;
        attack: number;
        defense: number;
        speed: number;
        crit: number;
    } {
        const char = playerData.character;
        const equip = playerData.inventory.equipment;

        let totalHp = char.hp;
        let totalMp = char.mp;
        let totalAttack = char.attack;
        let totalDefense = char.defense;
        let totalSpeed = char.speed;
        let totalCrit = char.crit;

        // 添加装备属性
        if (equip.weapon?.stats.attack) totalAttack += equip.weapon.stats.attack;
        if (equip.armor?.stats.defense) totalDefense += equip.armor.stats.defense;
        if (equip.armor?.stats.hp) totalHp += equip.armor.stats.hp;
        if (equip.helmet?.stats.hp) totalHp += equip.helmet.stats.hp;
        if (equip.accessory?.stats.crit) totalCrit += equip.accessory.stats.crit;

        return {
            hp: totalHp,
            mp: totalMp,
            attack: totalAttack,
            defense: totalDefense,
            speed: totalSpeed,
            crit: totalCrit
        };
    }

    /**
     * 建造建筑
     */
    public buildBuilding(playerData: PlayerData, buildingId: string): boolean {
        const config = BUILDING_CONFIG[buildingId];
        if (!config) {
            console.error(`建筑配置不存在: ${buildingId}`);
            return false;
        }

        // 检查是否已建造
        const existingBuilding = playerData.base.buildings.find(b => b.id === buildingId);
        const currentLevel = existingBuilding ? existingBuilding.level : 0;

        if (currentLevel >= config.maxLevel) {
            console.error('建筑已达最高等级');
            return false;
        }

        // 获取建造成本
        const cost = config.cost[currentLevel + 1];
        if (!cost) {
            console.error('获取建造成本失败');
            return false;
        }

        // 检查资源
        if (playerData.base.resources.gold < cost.gold ||
            playerData.base.resources.wood < cost.wood ||
            playerData.base.resources.stone < cost.stone) {
            console.error('资源不足');
            return false;
        }

        // 扣除资源
        playerData.base.resources.gold -= cost.gold;
        playerData.base.resources.wood -= cost.wood;
        playerData.base.resources.stone -= cost.stone;

        // 更新或创建建筑
        if (existingBuilding) {
            existingBuilding.level++;
        } else {
            playerData.base.buildings.push({
                id: buildingId,
                type: config.type,
                level: 1,
                position: { x: 0, y: 0 }, // TODO: 玩家选择位置
                isComplete: true
            });
        }

        return true;
    }

    /**
     * 验证数据完整性
     */
    public validateData(data: PlayerData): boolean {
        try {
            // 基本字段检查
            if (!data.id || !data.character || !data.base) {
                return false;
            }

            // 数值范围检查
            if (data.character.level < 1 || data.character.level > 999) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('数据验证失败:', error);
            return false;
        }
    }
}
