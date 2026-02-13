/**
 * 游戏配置数据
 * 可热更新，支持未来扩展
 */

import { SkillData } from './PlayerData';

// ============== 职业配置 ==============
export const CLASS_CONFIG = {
    warrior: {
        name: '剑士',
        description: '近战主力，高攻击高血量',
        baseStats: {
            hp: 150,
            mp: 50,
            attack: 15,
            defense: 10,
            speed: 8,
            crit: 5
        },
        growthStats: {
            hp: 15,
            mp: 5,
            attack: 2,
            defense: 1.5,
            speed: 0.5,
            crit: 0.3
        },
        startingSkills: ['slash', 'shield'],
        color: '#e74c3c'
    },
    mage: {
        name: '法师',
        description: '远程魔法，高爆发AOE伤害',
        baseStats: {
            hp: 80,
            mp: 120,
            attack: 20,
            defense: 5,
            speed: 7,
            crit: 8
        },
        growthStats: {
            hp: 8,
            mp: 15,
            attack: 2.5,
            defense: 0.5,
            speed: 0.5,
            crit: 0.5
        },
        startingSkills: ['fireball', 'frost'],
        color: '#9b59b6'
    },
    healer: {
        name: '牧师',
        description: '治疗和增益，队伍核心',
        baseStats: {
            hp: 90,
            mp: 100,
            attack: 10,
            defense: 8,
            speed: 8,
            crit: 5
        },
        growthStats: {
            hp: 9,
            mp: 12,
            attack: 1,
            defense: 1,
            speed: 0.5,
            crit: 0.2
        },
        startingSkills: ['heal', 'bless'],
        color: '#2ecc71'
    },
    assassin: {
        name: '刺客',
        description: '高暴击潜行，爆发输出',
        baseStats: {
            hp: 85,
            mp: 70,
            attack: 18,
            defense: 6,
            speed: 12,
            crit: 15
        },
        growthStats: {
            hp: 8,
            mp: 7,
            attack: 2.2,
            defense: 0.8,
            speed: 1,
            crit: 0.8
        },
        startingSkills: ['backstab', 'stealth'],
        color: '#34495e'
    }
} as const;

// ============== 技能配置 ==============
export const SKILL_CONFIG: Record<string, {
    id: string;
    name: string;
    type: 'active' | 'passive';
    damage?: number;
    heal?: number;
    manaCost: number;
    cooldown: number;
    description: string;
    maxLevel: number;
    effect?: string;
}> = {
    // 剑士技能
    slash: {
        id: 'slash',
        name: '斩击',
        type: 'active',
        damage: 120,
        manaCost: 5,
        cooldown: 0,
        description: '对单体造成120%攻击力的物理伤害',
        maxLevel: 10
    },
    shield: {
        id: 'shield',
        name: '护盾',
        type: 'active',
        manaCost: 15,
        cooldown: 3,
        description: '获得等于攻击力150%的护盾，持续2回合',
        maxLevel: 5
    },
    // 法师技能
    fireball: {
        id: 'fireball',
        name: '火球术',
        type: 'active',
        damage: 150,
        manaCost: 10,
        cooldown: 1,
        description: '对单体造成150%魔法伤害',
        maxLevel: 10
    },
    frost: {
        id: 'frost',
        name: '冰冻术',
        type: 'active',
        damage: 80,
        manaCost: 8,
        cooldown: 2,
        description: '造成80%魔法伤害，有30%概率使目标减速',
        maxLevel: 5,
        effect: 'slow'
    },
    // 牧师技能
    heal: {
        id: 'heal',
        name: '治疗术',
        type: 'active',
        heal: 150,
        manaCost: 10,
        cooldown: 1,
        description: '恢复单体150%魔法值的治疗量',
        maxLevel: 10
    },
    bless: {
        id: 'bless',
        name: '祝福',
        type: 'active',
        manaCost: 12,
        cooldown: 3,
        description: '使目标攻击力提升20%，持续3回合',
        maxLevel: 5,
        effect: 'buff_attack'
    },
    // 刺客技能
    backstab: {
        id: 'backstab',
        name: '背刺',
        type: 'active',
        damage: 180,
        manaCost: 8,
        cooldown: 1,
        description: '从背后攻击造成180%伤害，必定暴击',
        maxLevel: 10
    },
    stealth: {
        id: 'stealth',
        name: '潜行',
        type: 'active',
        manaCost: 15,
        cooldown: 4,
        description: '进入潜行状态，下次攻击伤害翻倍',
        maxLevel: 5,
        effect: 'stealth'
    }
};

// ============== 宠物配置 ==============
export const PET_CONFIG: Record<string, {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    baseStats: {
        attack: number;
        defense: number;
        speed: number;
    };
    skills: string[];
    description: string;
    captureRate: number;
}> = {
    // 普通宠物
    slime: {
        id: 'slime',
        name: '史莱姆',
        rarity: 'common',
        baseStats: { attack: 5, defense: 8, speed: 3 },
        skills: ['absorb'],
        description: '可爱的软体生物，能吸收攻击',
        captureRate: 60
    },
    wolf: {
        id: 'wolf',
        name: '雪狼',
        rarity: 'common',
        baseStats: { attack: 10, defense: 5, speed: 8 },
        skills: ['howl'],
        description: '快速的野兽，能够增强队友',
        captureRate: 50
    },
    // 稀有宠物
    phoenix: {
        id: 'phoenix',
        name: '火凤凰',
        rarity: 'rare',
        baseStats: { attack: 18, defense: 10, speed: 12 },
        skills: ['fireball', 'rebirth'],
        description: '传说中的神鸟，拥有复活能力',
        captureRate: 20
    },
    dragon: {
        id: 'dragon',
        name: '幼龙',
        rarity: 'rare',
        baseStats: { attack: 22, defense: 15, speed: 6 },
        skills: ['fire_breath', 'roar'],
        description: '拥有龙族血统，战力强大',
        captureRate: 15
    },
    // 史诗宠物
    unicorn: {
        id: 'unicorn',
        name: '独角兽',
        rarity: 'epic',
        baseStats: { attack: 20, defense: 18, speed: 10 },
        skills: ['heal_light', 'purify'],
        description: '神圣生物，拥有强大的治愈能力',
        captureRate: 5
    },
    // 传说宠物
    celestial_dragon: {
        id: 'celestial_dragon',
        name: '天界龙',
        rarity: 'legendary',
        baseStats: { attack: 35, defense: 30, speed: 20 },
        skills: ['divine_breath', 'immortal_shield', 'destiny_call'],
        description: '六界传说神兽之一',
        captureRate: 1
    }
};

// ============== 建筑配置 ==============
export const BUILDING_CONFIG: Record<string, {
    id: string;
    name: string;
    type: 'resource' | 'combat' | 'social' | 'decoration';
    maxLevel: number;
    cost: {
        level: number;
        gold: number;
        wood: number;
        stone: number;
    }[];
    effect: string;
    icon: string;
}> = {
    // 资源建筑
    gold_mine: {
        id: 'gold_mine',
        name: '金矿',
        type: 'resource',
        maxLevel: 10,
        cost: Array.from({ length: 11 }, (_, i) => ({
            level: i,
            gold: 0,
            wood: 50 * i,
            stone: 30 * i
        })),
        effect: '每小时产出金币',
        icon: 'building_gold'
    },
    lumber_mill: {
        id: 'lumber_mill',
        name: '伐木场',
        type: 'resource',
        maxLevel: 10,
        cost: Array.from({ length: 11 }, (_, i) => ({
            level: i,
            gold: 100 * i,
            wood: 0,
            stone: 20 * i
        })),
        effect: '每小时产出木材',
        icon: 'building_wood'
    },
    // 战斗建筑
    training_ground: {
        id: 'training_ground',
        name: '练武场',
        type: 'combat',
        maxLevel: 5,
        cost: Array.from({ length: 6 }, (_, i) => ({
            level: i,
            gold: 200 * i,
            wood: 100 * i,
            stone: 100 * i
        })),
        effect: '提升宠物训练效果',
        icon: 'building_training'
    },
    // 社交建筑 (预留)
    guild_hall: {
        id: 'guild_hall',
        name: '公会大厅',
        type: 'social',
        maxLevel: 5,
        cost: Array.from({ length: 6 }, (_, i) => ({
            level: i,
            gold: 500 * i,
            wood: 300 * i,
            stone: 300 * i
        })),
        effect: '增加公会成员上限',
        icon: 'building_guild'
    }
};

// ============== 成就配置 ==============
export const ACHIEVEMENT_CONFIG: Record<string, {
    id: string;
    name: string;
    description: string;
    type: 'battle' | 'exploration' | 'collection' | 'social';
    target: number;
    reward: {
        gold: number;
        crystals: number;
        achievementPoints: number;
    };
}> = {
    // 战斗成就
    first_battle: {
        id: 'first_battle',
        name: '初次战斗',
        description: '完成第一次战斗',
        type: 'battle',
        target: 1,
        reward: { gold: 100, crystals: 10, achievementPoints: 10 }
    },
    defeat_100_enemies: {
        id: 'defeat_100_enemies',
        name: '百斩者',
        description: '击败100个敌人',
        type: 'battle',
        target: 100,
        reward: { gold: 1000, crystals: 50, achievementPoints: 50 }
    },
    // 探索成就
    discover_first_secret: {
        id: 'discover_first_secret',
        name: '探索者',
        description: '发现第一个秘密',
        type: 'exploration',
        target: 1,
        reward: { gold: 200, crystals: 20, achievementPoints: 20 }
    },
    // 收集成就
    collect_first_pet: {
        id: 'collect_first_pet',
        name: '驯兽师',
        description: '获得第一个宠物',
        type: 'collection',
        target: 1,
        reward: { gold: 150, crystals: 15, achievementPoints: 15 }
    },
    collect_legendary_pet: {
        id: 'collect_legendary_pet',
        name: '传说驯兽师',
        description: '获得传说级宠物',
        type: 'collection',
        target: 1,
        reward: { gold: 5000, crystals: 200, achievementPoints: 100 }
    }
};

// ============== 地图配置 ==============
export const MAP_CONFIG: Record<string, {
    id: string;
    name: string;
    realm: 'human' | 'spirit' | 'immortal' | 'demon' | 'chaos' | 'divine';
    level: number;
    width: number;
    height: number;
    monsters: string[];
    bosses?: string[];
    secrets: string[];
    unlockCondition?: string;
}> = {
    starter_village: {
        id: 'starter_village',
        name: '新手村',
        realm: 'human',
        level: 1,
        width: 50,
        height: 50,
        monsters: ['slime', 'wolf'],
        secrets: ['hidden_treasure'],
    },
    dark_forest: {
        id: 'dark_forest',
        name: '暗黑森林',
        realm: 'human',
        level: 5,
        width: 80,
        height: 80,
        monsters: ['wolf', 'goblin'],
        bosses: ['forest_guardian'],
        secrets: ['ancient_altar'],
        unlockCondition: 'level >= 5'
    },
    demon_ruins: {
        id: 'demon_ruins',
        name: '魔族遗迹',
        realm: 'demon',
        level: 20,
        width: 100,
        height: 100,
        monsters: ['demon_soldier', 'shadow_beast'],
        bosses: ['demon_lord'],
        secrets: ['portal_spirit'],
        unlockCondition: 'mainQuest >= 5'
    }
};

// ============== 敌人配置 ==============
export const ENEMY_CONFIG: Record<string, {
    id: string;
    name: string;
    type: 'normal' | 'elite' | 'boss';
    level: number;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
    exp: number;
    gold: number;
    skills: string[];
    sprite: string;
}> = {
    slime: {
        id: 'slime',
        name: '史莱姆',
        type: 'normal',
        level: 1,
        stats: { hp: 30, attack: 5, defense: 3, speed: 2 },
        exp: 10,
        gold: 5,
        skills: [],
        sprite: 'enemy_slime'
    },
    wolf: {
        id: 'wolf',
        name: '雪狼',
        type: 'normal',
        level: 3,
        stats: { hp: 50, attack: 10, defense: 5, speed: 8 },
        exp: 25,
        gold: 15,
        skills: ['howl'],
        sprite: 'enemy_wolf'
    },
    forest_guardian: {
        id: 'forest_guardian',
        name: '森林守护者',
        type: 'boss',
        level: 10,
        stats: { hp: 500, attack: 30, defense: 20, speed: 5 },
        exp: 500,
        gold: 200,
        skills: ['entangle', 'summon'],
        sprite: 'boss_forest_guardian'
    }
};

// ============== 游戏常量 ==============
export const GAME_CONSTANTS = {
    // 经验等级表
    EXP_TABLE: Array.from({ length: 50 }, (_, i) => {
        return Math.floor(100 * Math.pow(1.5, i));
    }),

    // 升级属性增长倍率
    LEVEL_UP_MULTIPLIER: 1.05,

    // 最大背包容量
    MAX_INVENTORY_CAPACITY: 100,

    // 最大宠物槽位
    MAX_PET_SLOTS: 5,

    // 每日任务刷新时间
    DAILY_RESET_TIME: '04:00',

    // 六界设定
    REALMS: {
        human: { name: '人界', description: '人类的居住地' },
        spirit: { name: '灵界', description: '魂魄的归宿' },
        immortal: { name: '仙界', description: '仙人修炼之地' },
        demon: { name: '魔界', description: '黑暗生物的领域' },
        chaos: { name: '混沌界', description: '世界的起源' },
        divine: { name: '神界', description: '至高无上之地' }
    }
} as const;
