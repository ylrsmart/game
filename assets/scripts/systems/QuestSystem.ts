/**
 * 任务系统
 * 负责主线任务、支线任务、任务追踪
 */

import { _decorator, Component } from 'cc';
import { PlayerData, QuestProgress, QuestData } from '../data/PlayerData';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';

const { ccclass, property } = _decorator;

export interface QuestObjective {
    id: string;
    description: string;
    type: 'kill' | 'collect' | 'explore' | 'talk' | 'build';
    target: number;
    current: number;
    completed: boolean;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    type: 'main' | 'side' | 'daily';
    chapter: number;
    stage: number;
    objectives: QuestObjective[];
    rewards: {
        gold: number;
        exp: number;
        items?: any[];
    };
    prerequisites?: string[];
    unlockCondition?: string;
}

@ccclass('QuestSystem')
export class QuestSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    // 当前任务数据
    private _quests: Map<string, Quest> = new Map();

    protected onLoad(): void {
        this.loadQuests();
        this.registerEventListeners();
    }

    protected onDestroy(): void {
        this.unregisterEventListeners();
    }

    /**
     * 加载任务数据
     */
    private loadQuests(): void {
        if (!this._playerData) return;

        // 定义主线任务
        this.defineMainQuests();

        // 定义支线任务
        this.defineSideQuests();

        // 初始化任务状态
        this.initQuestStates();
    }

    /**
     * 定义主线任务
     */
    private defineMainQuests(): void {
        const mainQuests: Quest[] = [
            {
                id: 'mq_1_1',
                name: '天选之子的觉醒',
                description: '发现自己拥有特殊力量，并前往村长家了解情况',
                type: 'main',
                chapter: 1,
                stage: 1,
                objectives: [
                    {
                        id: 'explore_village',
                        description: '探索新手村',
                        type: 'explore',
                        target: 10,
                        current: 0,
                        completed: false
                    },
                    {
                        id: 'talk_chief',
                        description: '与村长对话',
                        type: 'talk',
                        target: 1,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 100,
                    exp: 50
                }
            },
            {
                id: 'mq_1_2',
                name: '黑暗的威胁',
                description: '暗黑森林出现怪物，前去消灭',
                type: 'main',
                chapter: 1,
                stage: 2,
                objectives: [
                    {
                        id: 'kill_slime_5',
                        description: '击败5只史莱姆',
                        type: 'kill',
                        target: 5,
                        current: 0,
                        completed: false
                    },
                    {
                        id: 'kill_wolf_3',
                        description: '击败3只雪狼',
                        type: 'kill',
                        target: 3,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 200,
                    exp: 100,
                    items: [{ id: 'health_potion', quantity: 5 }]
                },
                prerequisites: ['mq_1_1']
            },
            {
                id: 'mq_1_3',
                name: '森林守护者',
                description: '击败暗黑森林的守护者',
                type: 'main',
                chapter: 1,
                stage: 3,
                objectives: [
                    {
                        id: 'kill_guardian',
                        description: '击败森林守护者',
                        type: 'kill',
                        target: 1,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 500,
                    exp: 300,
                    items: [{ id: 'rare_weapon', quantity: 1 }]
                },
                prerequisites: ['mq_1_2'],
                unlockCondition: 'level >= 5'
            },
            {
                id: 'mq_2_1',
                name: '通往新世界',
                description: '击败森林守护者后，找到通往灵界的线索',
                type: 'main',
                chapter: 2,
                stage: 1,
                objectives: [
                    {
                        id: 'discover_portal',
                        description: '发现传送门',
                        type: 'explore',
                        target: 1,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 1000,
                    exp: 500,
                    items: [{ id: 'portal_key', quantity: 1 }]
                },
                prerequisites: ['mq_1_3'],
                unlockCondition: 'mainQuest >= 5'
            }
        ];

        // 存储到 Map
        mainQuests.forEach(quest => {
            this._quests.set(quest.id, quest);
        });
    }

    /**
     * 定义支线任务
     */
    private defineSideQuests(): void {
        const sideQuests: Quest[] = [
            {
                id: 'sq_1_1',
                name: '收集药草',
                description: '为村民收集10株药草',
                type: 'side',
                chapter: 1,
                stage: 1,
                objectives: [
                    {
                        id: 'collect_herbs',
                        description: '收集药草',
                        type: 'collect',
                        target: 10,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 150,
                    exp: 75
                }
            },
            {
                id: 'sq_1_2',
                name: '建造家园',
                description: '建造你的第一个资源建筑',
                type: 'side',
                chapter: 1,
                stage: 1,
                objectives: [
                    {
                        id: 'build_mine',
                        description: '建造金矿',
                        type: 'build',
                        target: 1,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 300,
                    exp: 150
                }
            },
            {
                id: 'sq_1_3',
                name: '驯兽师之路',
                description: '捕获你的第一只宠物',
                type: 'side',
                chapter: 1,
                stage: 1,
                objectives: [
                    {
                        id: 'capture_pet',
                        description: '捕获宠物',
                        type: 'kill', // 用捕获机制
                        target: 1,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: {
                    gold: 200,
                    exp: 100,
                    items: [{ id: 'pet_food', quantity: 10 }]
                }
            }
        ];

        sideQuests.forEach(quest => {
            this._quests.set(quest.id, quest);
        });
    }

    /**
     * 初始化任务状态
     */
    private initQuestStates(): void {
        if (!this._playerData) return;

        // 初始化所有进行中的任务
        Object.keys(this._quests).forEach(questId => {
            const quest = this._quests.get(questId)!;
            const progress = this._playerData.quests.active.find(q => q.id === questId);

            if (progress) {
                // 已有进度，恢复
                quest.objectives.forEach(obj => {
                    const existing = progress.objectives.find(o => o.id === obj.id);
                    if (existing) {
                        obj.current = existing.current;
                        obj.completed = existing.completed;
                    }
                });
            } else {
                // 新任务，全部目标初始为0
                quest.objectives.forEach(obj => {
                    obj.current = 0;
                    obj.completed = false;
                });
            }
        });
    }

    /**
     * 注册事件监听
     */
    private registerEventListeners(): void {
        const events = EventManager.instance;

        // 击杀敌人
        events.on(GameEvents.BATTLE_END, this.onBattleEnd, this);

        // 探索
        events.on(GameEvents.MAP_EXPLORE, this.onMapExplore, this);

        // 对话
        events.on(GameEvents.MAP_ENTER, this.onMapEnter, this);

        // 建造
        events.on(GameEvents.BUILDING_BUILD, this.onBuildingBuild, this);

        // 收集
        events.on(GameEvents.BUILDING_COLLECT, this.onCollect, this);
    }

    /**
     * 移除事件监听
     */
    private unregisterEventListeners(): void {
        const events = EventManager.instance;
        events.off(GameEvents.BATTLE_END, this.onBattleEnd);
        events.off(GameEvents.MAP_EXPLORE, this.onMapExplore, this);
        events.off(GameEvents.MAP_ENTER, this.onMapEnter, this);
        events.off(GameEvents.BUILDING_BUILD, this.onBuildingBuild);
        events.off(GameEvents.BUILDING_COLLECT, this.onCollect);
    }

    /**
     * 战斗结束事件
     */
    private onBattleEnd(result: any): void {
        if (result.win) {
            // 更新击杀目标
            this.updateObjectivesByType('kill', 1);
        }
    }

    /**
     * 地图探索事件
     */
    private onMapExplore(x: number, y: number): void {
        // 更新探索目标
        this.updateObjectivesByType('explore', 1);
    }

    /**
     * 地图进入事件
     */
    private onMapEnter(mapId: string): void {
        // 特定NPC对话触发
        // 例如：进入 starter_village 时检查村长对话任务
    }

    /**
     * 建造事件
     */
    private onBuildingBuild(buildingId: string): void {
        this.updateObjectivesByType('build', 1);
    }

    /**
     * 收集事件
     */
    private onCollect(buildingId: string, amount: number): void {
        // 可用于收集类任务
    }

    /**
     * 更新目标进度
     */
    private updateObjectivesByType(type: string, amount: number): void {
        if (!this._playerData) return;

        // 更新所有进行中任务的对应目标
        this._playerData.quests.active.forEach(progress => {
            const quest = this._quests.get(progress.id);
            if (!quest) return;

            quest.objectives.forEach(obj => {
                if (obj.type === type && !obj.completed) {
                    obj.current = Math.min(obj.current + amount, obj.target);

                    if (obj.current >= obj.target) {
                        obj.completed = true;
                    }
                }
            });

            // 检查任务完成
            this.checkQuestComplete(progress);
        });
    }

    /**
     * 检查任务完成
     */
    private checkQuestComplete(progress: QuestProgress): void {
        const quest = this._quests.get(progress.id);
        if (!quest) return;

        const allCompleted = quest.objectives.every(obj => obj.completed);

        if (allCompleted && !this.isQuestCompleted(progress.id)) {
            this.completeQuest(progress.id);
        }
    }

    /**
     * 完成任务
     */
    private completeQuest(questId: string): void {
        if (!this._playerData) return;

        const quest = this._quests.get(questId);
        if (!quest) return;

        // 发放奖励
        this._playerData.base.resources.gold += quest.rewards.gold;

        // 给予经验
        const gameManager = this.getComponentInParent(any)?.getComponent('GameManager');
        if (gameManager && gameManager.addExp) {
            gameManager.addExp(quest.rewards.exp);
        }

        // 给予物品
        if (quest.rewards.items) {
            quest.rewards.items.forEach(item => {
                this._playerData.inventory.items.push({
                    id: item.id,
                    instanceId: Utils.generateId('item_'),
                    type: 'consumable',
                    quantity: item.quantity,
                    data: {}
                });
            });
        }

        // 移动到已完成列表
        this._playerData.quests.active =
            this._playerData.quests.active.filter(q => q.id !== questId);

        this._playerData.quests.completed.push({
            id: questId,
            type: quest.type,
            completedTime: Date.now(),
            rewardsCollected: true
        });

        // 更新主线进度
        if (quest.type === 'main') {
            const chapterStage = quest.chapter * 10 + quest.stage;
            this._playerData.quests.mainQuestProgress = Math.max(
                this._playerData.quests.mainQuestProgress,
                chapterStage
            );
        }

        // 触发事件
        EventManager.instance.emit(GameEvents.QUEST_COMPLETE, questId, quest.rewards);

        // 解锁新任务
        this.unlockNextQuests(questId);

        console.log(`任务完成: ${quest.name}`);
    }

    /**
     * 解锁后续任务
     */
    private unlockNextQuests(completedQuestId: string): void {
        this._quests.forEach((quest, id) => {
            if (quest.prerequisites?.includes(completedQuestId)) {
                // 检查是否满足解锁条件
                if (this.checkUnlockCondition(quest)) {
                    this.acceptQuest(id);
                }
            }
        });
    }

    /**
     * 检查解锁条件
     */
    private checkUnlockCondition(quest: Quest): boolean {
        if (!quest.unlockCondition) return true;

        // 解析条件
        if (quest.unlockCondition.startsWith('level >=')) {
            const level = parseInt(quest.unlockCondition.replace('level >= ', ''));
            return this._playerData!.character.level >= level;
        }

        if (quest.unlockCondition.startsWith('mainQuest >=')) {
            const quest = parseInt(quest.unlockCondition.replace('mainQuest >= ', ''));
            return this._playerData!.quests.mainQuestProgress >= quest;
        }

        return false;
    }

    /**
     * 接受任务
     */
    public acceptQuest(questId: string): boolean {
        if (!this._playerData) return false;

        const quest = this._quests.get(questId);
        if (!quest) return false;

        // 检查是否已在进行中
        if (this._playerData.quests.active.some(q => q.id === questId)) {
            console.error('任务已在进行中');
            return false;
        }

        // 检查前置条件
        if (quest.prerequisites) {
            const completedPrereqs = quest.prerequisites.every(preId =>
                this.isQuestCompleted(preId)
            );
            if (!completedPrereqs) {
                console.error('未满足前置任务');
                return false;
            }
        }

        // 检查解锁条件
        if (!this.checkUnlockCondition(quest)) {
            console.error('未满足解锁条件');
            return false;
        }

        // 添加到进行中
        const progress: QuestProgress = {
            id: questId,
            stage: 1,
            objectives: quest.objectives.map(obj => ({
                id: obj.id,
                current: obj.current,
                target: obj.target,
                completed: obj.completed
            })),
            startedTime: Date.now()
        };

        this._playerData.quests.active.push(progress);

        EventManager.instance.emit(GameEvents.QUEST_START, questId);

        console.log(`接受任务: ${quest.name}`);
        return true;
    }

    /**
     * 放弃任务
     */
    public abandonQuest(questId: string): boolean {
        if (!this._playerData) return false;

        // 不能放弃主线任务
        const quest = this._quests.get(questId);
        if (quest?.type === 'main') {
            console.error('不能放弃主线任务');
            return false;
        }

        // 移除任务
        this._playerData.quests.active =
            this._playerData.quests.active.filter(q => q.id !== questId);

        console.log(`放弃任务: ${quest?.name}`);
        return true;
    }

    /**
     * 获取可接任务列表
     */
    public getAvailableQuests(): Quest[] {
        const available: Quest[] = [];

        this._quests.forEach((quest, id) => {
            // 不在已完成列表
            if (!this.isQuestCompleted(id)) {
                // 不在进行中列表
                if (!this._playerData?.quests.active.some(q => q.id === id)) {
                    // 满足条件
                    if (this.checkUnlockCondition(quest)) {
                        available.push(quest);
                    }
                }
            }
        });

        return available;
    }

    /**
     * 获取进行中任务
     */
    public getActiveQuests(): Array<{
        quest: Quest;
        progress: QuestProgress;
    }> {
        const active: Array<any> = [];

        this._playerData?.quests.active.forEach(progress => {
            const quest = this._quests.get(progress.id);
            if (quest) {
                active.push({ quest, progress });
            }
        });

        return active;
    }

    /**
     * 检查任务是否已完成
     */
    private isQuestCompleted(questId: string): boolean {
        return this._playerData?.quests.completed.some(q => q.id === questId) || false;
    }

    /**
     * 获取主线进度
     */
    public getMainQuestProgress(): { current: number; total: number } {
        const totalQuests = Object.values(this._quests).filter(q => q.type === 'main').length;
        const completedCount = this._playerData?.quests.completed.filter(q => {
            const quest = this._quests.get(q.id);
            return quest?.type === 'main';
        }).length || 0;

        return {
            current: completedCount,
            total: totalQuests
        };
    }
}
