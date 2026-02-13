/**
 * 玩家数据结构
 * 设计为可扩展到联机版本
 */
export interface PlayerData {
    // ============== 基础信息 (跨代不变) ==============
    id: string;                    // 玩家唯一ID (未来支持设备迁移)
    nickname: string;              // 玩家昵称
    avatar: string;                // 头像
    createTime: number;            // 创建时间戳
    lastLoginTime: number;         // 最后登录时间

    // ============== 角色属性 (可扩展) ==============
    character: {
        race: 'human' | 'elf' | 'orc' | 'angel';  // 种族 (预留扩展)
        class: 'warrior' | 'mage' | 'healer' | 'assassin';  // 职业
        level: number;                            // 等级
        exp: number;                              // 经验值
        expToNext: number;                        // 升级所需经验

        // 基础属性
        hp: number;                               // 当前生命值
        maxHp: number;                            // 最大生命值
        mp: number;                               // 当前魔法值
        maxMp: number;                            // 最大魔法值

        // 战斗属性
        attack: number;                           // 攻击力
        defense: number;                          // 防御力
        speed: number;                            // 速度
        crit: number;                              // 暴击率 (0-100)
        critDamage: number;                        // 暴击伤害倍率

        // 技能
        skills: SkillData[];                       // 已学技能
        skillPoints: number;                       // 可用技能点
    };

    // ============== 宠物系统 (联机交易支持) ==============
    pets: {
        slots: number;                             // 可用宠物槽位
        activePets: PetData[];                     // 上阵宠物
        storagePets: PetData[];                    // 仓库宠物
    };

    // ============== 建筑系统 (联机共建支持) ==============
    base: {
        level: number;                             // 基地等级
        resources: {                               // 资源
            gold: number;                          // 金币
            wood: number;                          // 木材
            stone: number;                         // 石材
            crystals: number;                      // 水晶
        };
        buildings: BuildingData[];                 // 已建造建筑
        decorations: DecorationData[];             // 装饰品
    };

    // ============== 装备和背包 (联机交易支持) ==============
    inventory: {
        capacity: number;                          // 背包容量
        items: ItemData[];                         // 物品列表
        equipment: {
            weapon: EquipData | null;              // 武器
            armor: EquipData | null;               // 护甲
            helmet: EquipData | null;              // 头盔
            accessory: EquipData | null;          // 饰品
        };
    };

    // ============== 成就系统 (排行榜支持) ==============
    achievements: AchievementProgress[];
    achievementPoints: number;                      // 成就点数

    // ============== 任务系统 ==============
    quests: {
        completed: QuestData[];                    // 已完成任务
        active: QuestProgress[];                    // 进行中任务
        mainQuestProgress: number;                  // 主线进度
    };

    // ============== 探索进度 ==============
    exploration: {
        currentMapId: string;                       // 当前地图ID
        visitedMaps: string[];                     // 已探索地图
        discoveredSecrets: string[];              // 发现的秘密
    };

    // ============== 社交数据 (预留，联机用) ==============
    social?: {
        friends: FriendData[];                     // 好友列表
        guild?: GuildData;                         // 公会数据
    };

    // ============== 游戏设置 ==============
    settings: {
        soundEnabled: boolean;                     // 音效开关
        musicEnabled: boolean;                     // 音乐开关
        vibrationEnabled: boolean;                 // 震动开关
        language: 'zh-CN' | 'en-US';               // 语言设置
    };

    // ============== 版本信息 (支持迁移) ==============
    version: number;                                // 数据版本号
    isFirstLaunch: boolean;                         // 是否首次启动
}

/**
 * 技能数据
 */
export interface SkillData {
    id: string;
    level: number;
    exp: number;
    unlocked: boolean;
}

/**
 * 宠物数据
 */
export interface PetData {
    id: string;
    instanceId: string;                            // 实例ID (用于交易)
    type: string;                                  // 宠物类型
    name: string;
    level: number;
    exp: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    stats: {
        attack: number;
        defense: number;
        speed: number;
    };
    skills: string[];                              // 拥有技能
    affection: number;                             // 好感度
}

/**
 * 建筑数据
 */
export interface BuildingData {
    id: string;
    type: string;
    level: number;
    position: { x: number; y: number };
    isComplete: boolean;
    lastCollectTime?: number;
}

/**
 * 装饰品数据
 */
export interface DecorationData {
    id: string;
    instanceId: string;
    position: { x: number; y: number };
}

/**
 * 物品数据
 */
export interface ItemData {
    id: string;
    instanceId: string;
    type: 'consumable' | 'material' | 'equip' | 'special';
    quantity: number;
    data: any;
}

/**
 * 装备数据
 */
export interface EquipData {
    id: string;
    instanceId: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    level: number;
    stats: {
        attack?: number;
        defense?: number;
        hp?: number;
        mp?: number;
        crit?: number;
    };
    enhancements: number;                          // 强化等级
}

/**
 * 成就进度
 */
export interface AchievementProgress {
    id: string;
    completed: boolean;
    progress: number;
    completedTime?: number;
}

/**
 * 任务进度
 */
export interface QuestProgress {
    id: string;
    stage: number;
    objectives: {
        id: string;
        current: number;
        target: number;
        completed: boolean;
    }[];
    startedTime: number;
}

/**
 * 任务数据
 */
export interface QuestData {
    id: string;
    type: 'main' | 'side' | 'daily';
    completedTime: number;
    rewardsCollected: boolean;
}

/**
 * 好友数据 (预留)
 */
export interface FriendData {
    id: string;
    nickname: string;
    relationLevel: number;
    lastInteractionTime: number;
}

/**
 * 公会数据 (预留)
 */
export interface GuildData {
    id: string;
    name: string;
    level: number;
    role: 'member' | 'officer' | 'leader';
    joinedTime: number;
    contribution: number;
}
