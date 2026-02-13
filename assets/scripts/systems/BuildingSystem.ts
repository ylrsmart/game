/**
 * 建筑系统
 * 负责建筑建造、升级、资源产出
 */

import { _decorator, Component } from 'cc';
import { PlayerData, BuildingData } from '../data/PlayerData';
import { BUILDING_CONFIG } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';

const { ccclass, property } = _decorator;

export interface BuildingProduction {
    buildingId: string;
    resourceType: 'gold' | 'wood' | 'stone' | 'crystals';
    amount: number;
    lastCollectTime: number;
}

@ccclass('BuildingSystem')
export class BuildingSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    // 产出计时器
    private _productionTimer: number = 0;
    private _productionInterval: number = 1000; // 每秒检查一次

    protected onLoad(): void {
        this.startProduction();
    }

    protected onDestroy(): void {
        this.stopProduction();
    }

    /**
     * 获取所有建筑
     */
    public getBuildings(): BuildingData[] {
        return this._playerData?.base.buildings || [];
    }

    /**
     * 获取建筑详情
     */
    public getBuilding(buildingId: string): { data: BuildingData | null; config: any } {
        const data = this.getBuildings().find(b => b.id === buildingId);
        const config = BUILDING_CONFIG[buildingId];

        return {
            data: data || null,
            config: config || null
        };
    }

    /**
     * 建造建筑
     */
    public buildBuilding(buildingId: string, position: { x: number; y: number }): boolean {
        if (!this._playerData) return false;

        const config = BUILDING_CONFIG[buildingId];
        if (!config) {
            console.error(`建筑配置不存在: ${buildingId}`);
            return false;
        }

        // 检查是否已存在
        const existing = this.getBuildings().find(b => b.id === buildingId);
        const currentLevel = existing ? existing.level : 0;

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
        const resources = this._playerData.base.resources;
        if (resources.gold < cost.gold ||
            resources.wood < cost.wood ||
            resources.stone < cost.stone) {
            console.error('资源不足');
            return false;
        }

        // 扣除资源
        resources.gold -= cost.gold;
        resources.wood -= cost.wood;
        resources.stone -= cost.stone;

        // 更新或创建建筑
        if (existing) {
            existing.level++;
            existing.position = position;
        } else {
            const newBuilding: BuildingData = {
                id: buildingId,
                type: config.type,
                level: 1,
                position: position,
                isComplete: true,
                lastCollectTime: Date.now()
            };
            this._playerData.base.buildings.push(newBuilding);
        }

        EventManager.instance.emit(GameEvents.BUILDING_BUILD, buildingId, position);
        EventManager.instance.emit(GameEvents.RESOURCE_CHANGE);

        console.log(`建造/升级: ${config.name} Lv.${currentLevel + 1}`);
        return true;
    }

    /**
     * 拆除建筑
     */
    public demolishBuilding(buildingId: string): boolean {
        if (!this._playerData) return false;

        const building = this.getBuildings().find(b => b.id === buildingId);
        if (!building) {
            console.error('建筑不存在');
            return false;
        }

        // 拆除获得部分资源返还（50%）
        const config = BUILDING_CONFIG[buildingId];
        const cost = config.cost[building.level];

        this._playerData.base.resources.gold += Math.floor(cost.gold * 0.5);
        this._playerData.base.resources.wood += Math.floor(cost.wood * 0.5);
        this._playerData.base.resources.stone += Math.floor(cost.stone * 0.5);

        // 移除建筑
        this._playerData.base.buildings =
            this._playerData.base.buildings.filter(b => b.id !== buildingId);

        console.log(`拆除建筑: ${config.name}`);
        return true;
    }

    /**
     * 收集产出
     */
    public collectProduction(buildingId: string): { success: boolean; amount: number } | null {
        if (!this._playerData) return null;

        const building = this.getBuildings().find(b => b.id === buildingId);
        if (!building) {
            console.error('建筑不存在');
            return { success: false, amount: 0 };
        }

        const config = BUILDING_CONFIG[buildingId];
        if (!config || config.type !== 'resource') {
            console.error('该建筑不产出资源');
            return { success: false, amount: 0 };
        }

        // 计算产出
        const now = Date.now();
        const elapsedHours = (now - (building.lastCollectTime || now)) / (1000 * 60 * 60);

        if (elapsedHours < 1) {
            console.log('产出未满1小时');
            return { success: false, amount: 0 };
        }

        // 根据建筑等级计算产出
        const baseOutput = this.calculateBaseOutput(buildingId, building.level);
        const amount = Math.floor(baseOutput * elapsedHours);

        // 资源类型映射
        let resourceType: 'gold' | 'wood' | 'stone' | 'crystals';
        switch (buildingId) {
            case 'gold_mine':
                resourceType = 'gold';
                break;
            case 'lumber_mill':
                resourceType = 'wood';
                break;
            default:
                return { success: false, amount: 0 };
        }

        // 添加到资源
        this._playerData.base.resources[resourceType] += amount;
        building.lastCollectTime = now;

        EventManager.instance.emit(GameEvents.BUILDING_COLLECT, buildingId, amount);
        EventManager.instance.emit(GameEvents.RESOURCE_CHANGE);

        console.log(`收集产出: ${amount} ${resourceType}`);
        return { success: true, amount };
    }

    /**
     * 计算建筑产出
     */
    private calculateBaseOutput(buildingId: string, level: number): number {
        // 基础产出 * 等级倍率
        const baseOutput: Record<string, number> = {
            gold_mine: 100,
            lumber_mill: 50
        };

        const levelMultiplier = 1 + (level - 1) * 0.5;
        return Math.floor((baseOutput[buildingId] || 0) * levelMultiplier);
    }

    /**
     * 获取可收集产出
     */
    public getCollectableResources(): BuildingProduction[] {
        const collectable: BuildingProduction[] = [];

        if (!this._playerData) return collectable;

        const now = Date.now();

        this.getBuildings().forEach(building => {
            const config = BUILDING_CONFIG[building.id];
            if (!config || config.type !== 'resource') return;

            const elapsedHours = (now - (building.lastCollectTime || now)) / (1000 * 60 * 60);
            if (elapsedHours < 1) return;

            const amount = this.calculateBaseOutput(building.id, building.level);

            let resourceType: 'gold' | 'wood' | 'stone' | 'crystals' = 'gold';
            switch (building.id) {
                case 'gold_mine':
                    resourceType = 'gold';
                    break;
                case 'lumber_mill':
                    resourceType = 'wood';
                    break;
            }

            collectable.push({
                buildingId: building.id,
                resourceType,
                amount: Math.floor(amount * elapsedHours),
                lastCollectTime: building.lastCollectTime || now
            });
        });

        return collectable;
    }

    /**
     * 开始产出计时
     */
    private startProduction(): void {
        this.schedule(() => {
            this.updateProduction();
        }, this._productionInterval);
    }

    /**
     * 停止产出计时
     */
    private stopProduction(): void {
        this.unscheduleAllCallbacks();
    }

    /**
     * 更新产出（每秒检查）
     */
    private updateProduction(): void {
        if (!this._playerData) return;

        // 自动产出（可选功能）
        // 当前设计为手动收集，这里可以自动收集
    }

    /**
     * 获取建筑升级信息
     */
    public getUpgradeInfo(buildingId: string): {
        canUpgrade: boolean;
        currentLevel: number;
        nextLevel: number;
        cost: { gold: number; wood: number; stone: number };
    } | null {
        const building = this.getBuildings().find(b => b.id === buildingId);
        const config = BUILDING_CONFIG[buildingId];

        if (!config) return null;

        const currentLevel = building ? building.level : 0;

        if (currentLevel >= config.maxLevel) {
            return {
                canUpgrade: false,
                currentLevel,
                nextLevel: currentLevel,
                cost: { gold: 0, wood: 0, stone: 0 }
            };
        }

        const cost = config.cost[currentLevel + 1];

        return {
            canUpgrade: this._playerData?.base.resources.gold >= cost.gold &&
                     this._playerData?.base.resources.wood >= cost.wood &&
                     this._playerData?.base.resources.stone >= cost.stone,
            currentLevel,
            nextLevel: currentLevel + 1,
            cost
        };
    }
}
