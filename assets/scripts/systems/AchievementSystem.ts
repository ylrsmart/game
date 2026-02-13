/**
 * 成就系统
 * 负责成就解锁、追踪、奖励发放
 */

import { _decorator, Component } from 'cc';
import { PlayerData, AchievementProgress } from '../data/PlayerData';
import { ACHIEVEMENT_CONFIG, GAME_CONSTANTS } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';

const { ccclass, property } = _decorator;

@ccclass('AchievementSystem')
export class AchievementSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    // 成就追踪数据
    private _progress: Map<string, number> = new Map();

    protected onLoad(): void {
        this.registerEventListeners();
        this.loadProgress();
    }

    protected onDestroy(): void {
        this.unregisterEventListeners();
    }

    /**
     * 注册事件监听
     */
    private registerEventListeners(): void {
        const events = EventManager.instance;

        // 战斗相关
        events.on(GameEvents.BATTLE_END, this.onBattleEnd, this);

        // 探索相关
        events.on(GameEvents.MAP_EXPLORE, this.onMapExplore, this);

        // 收集相关
        events.on(GameEvents.PET_GET, this.onPetGet, this);

        // 击杀敌人
        events.on(GameEvents.BATTLE_DAMAGE, this.onEnemyDefeated, this);
    }

    /**
     * 移除事件监听
     */
    private unregisterEventListeners(): void {
        const events = EventManager.instance;
        events.off(GameEvents.BATTLE_END, this.onBattleEnd, this);
        events.off(GameEvents.MAP_EXPLORE, this.onMapExplore, this);
        events.off(GameEvents.PET_GET, this.onPetGet, this);
        events.off(GameEvents.BATTLE_DAMAGE, this.onEnemyDefeated, this);
    }

    /**
     * 加载进度数据
     */
    private loadProgress(): void {
        if (!this._playerData) return;

        // 从玩家数据恢复追踪
        this._playerData.achievements.forEach(achievement => {
            if (achievement.completed) {
                // 已完成的成就，进度设为目标值
                const config = ACHIEVEMENT_CONFIG[achievement.id];
                if (config) {
                    this._progress.set(achievement.id, config.target);
                }
            }
        });
    }

    /**
     * 战斗结束事件
     */
    private onBattleEnd(win: boolean): void {
        if (win) {
            this.updateProgress('first_battle', 1);
        }
    }

    /**
     * 击败敌人事件
     */
    private onEnemyDefeated(damage: number, isCrit: boolean): void {
        if (damage > 0 && !this._playerData) {
            // 玩家造成伤害，说明在战斗中
            // 暴计击杀数（后续完善）
            // const currentKills = this._progress.get('defeat_100_enemies') || 0;
            // this.updateProgress('defeat_100_enemies', currentKills + 1);
        }
    }

    /**
     * 地图探索事件
     */
    private onMapExplore(x: number, y: number): void {
        // 探索新地块增加进度
        // 后续可以实现更精细的探索追踪
    }

    /**
     * 获得宠物事件
     */
    private onPetGet(pet: any): void {
        this.updateProgress('collect_first_pet', 1);

        // 检查传说宠物
        if (pet.rarity === 'legendary') {
            this.updateProgress('collect_legendary_pet', 1);
        }
    }

    /**
     * 更新成就进度
     */
    private updateProgress(achievementId: string, value: number): void {
        if (!this._playerData) return;

        const config = ACHIEVEMENT_CONFIG[achievementId];
        if (!config) return;

        const current = this._progress.get(achievementId) || 0;
        const target = config.target;

        // 更新进度
        this._progress.set(achievementId, value);

        // 检查是否完成
        if (value >= target && !this.isCompleted(achievementId)) {
            this.unlockAchievement(achievementId);
        } else {
            // 保存进度
            this.saveProgress(achievementId, Math.min(value, target));
        }
    }

    /**
     * 解锁成就
     */
    private unlockAchievement(achievementId: string): void {
        if (!this._playerData) return;

        const config = ACHIEVEMENT_CONFIG[achievementId];
        if (!config) return;

        // 发放奖励
        this._playerData.base.resources.gold += config.reward.gold;
        this._playerData.base.resources.crystals += config.reward.crystals;
        this._playerData.achievementPoints += config.reward.achievementPoints;

        // 记录成就
        const progress: AchievementProgress = {
            id: achievementId,
            completed: true,
            progress: config.target,
            completedTime: Date.now()
        };

        this._playerData.achievements.push(progress);

        // 触发事件
        EventManager.instance.emit(GameEvents.ACHIEVEMENT_UNLOCK, achievementId, config);

        console.log(`解锁成就: ${config.name}`);
    }

    /**
     * 保存进度
     */
    private saveProgress(achievementId: string, progress: number): void {
        if (!this._playerData) return;

        const existing = this._playerData.achievements.find(a => a.id === achievementId);

        if (existing) {
            existing.progress = progress;
        } else {
            this._playerData.achievements.push({
                id: achievementId,
                completed: false,
                progress,
                startedTime: Date.now()
            });
        }
    }

    /**
     * 检查成就是否已完成
     */
    public isCompleted(achievementId: string): boolean {
        if (!this._playerData) return false;

        const achievement = this._playerData.achievements.find(a => a.id === achievementId);
        return achievement?.completed || false;
    }

    /**
     * 获取所有成就
     */
    public getAllAchievements(): Array<{
        id: string;
        name: string;
        description: string;
        completed: boolean;
        progress: number;
        target: number;
        reward: any;
    }> {
        const allAchievements: Array<any> = [];

        // 添加所有配置的成就
        Object.keys(ACHIEVEMENT_CONFIG).forEach(id => {
            const config = ACHIEVEMENT_CONFIG[id];
            const progress = this._playerData?.achievements.find(a => a.id === id);

            allAchievements.push({
                id,
                name: config.name,
                description: config.description,
                completed: progress?.completed || false,
                progress: progress?.progress || 0,
                target: config.target,
                reward: config.reward
            });
        });

        return allAchievements;
    }

    /**
     * 获取已完成的成就数量
     */
    public getCompletedCount(): number {
        if (!this._playerData) return 0;
        return this._playerData.achievements.filter(a => a.completed).length;
    }

    /**
     * 获取总成就点数
     */
    public getTotalAchievementPoints(): number {
        return this._playerData?.achievementPoints || 0;
    }

    /**
     * 手动添加进度（用于测试或特定事件）
     */
    public addProgress(achievementId: string, amount: number): void {
        const current = this._progress.get(achievementId) || 0;
        this.updateProgress(achievementId, current + amount);
    }
}
