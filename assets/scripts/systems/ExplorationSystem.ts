/**
 * 探索系统
 * 负责地图生成、探索、秘密发现
 */

import { _decorator, Component } from 'cc';
import { PlayerData } from '../data/PlayerData';
import { MAP_CONFIG, ENEMY_CONFIG } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';

const { ccclass, property } = _decorator;

export interface MapTile {
    x: number;
    y: number;
    type: 'grass' | 'dirt' | 'water' | 'wall' | 'floor' | 'door';
    walkable: boolean;
    decoration?: string;
    secret?: string;
}

export interface MapData {
    id: string;
    name: string;
    realm: string;
    width: number;
    height: number;
    tiles: MapTile[][];
    entryPoint: { x: number; y: number };
    exitPoints: Array<{ x: number; y: number; targetMap: string }>;
    secrets: string[];
}

export interface Encounter {
    type: 'enemy' | 'treasure' | 'secret' | 'nothing';
    enemyId?: string;
    gold?: number;
    item?: any;
    secretId?: string;
}

@ccclass('ExplorationSystem')
export class ExplorationSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    // 当前地图
    private _currentMap: MapData | null = null;

    // 玩家位置
    private _playerPos: { x: number; y: number } = { x: 0, y: 0 };

    // 探索进度
    private _exploredTiles: Set<string> = new Set();

    protected onLoad(): void {
        // 加载玩家所在地图
        this.loadMap(this._playerData?.exploration.currentMapId || 'starter_village');
    }

    /**
     * 加载地图
     */
    public loadMap(mapId: string): boolean {
        const config = MAP_CONFIG[mapId];
        if (!config) {
            console.error(`地图配置不存在: ${mapId}`);
            return false;
        }

        // 检查解锁条件
        if (config.unlockCondition && !this.checkUnlockCondition(config.unlockCondition)) {
            console.error('地图未解锁');
            return false;
        }

        // 生成地图
        this._currentMap = this.generateMap(config);

        // 设置玩家位置
        this._playerPos = { ...this._currentMap.entryPoint };

        // 清空探索进度
        this._exploredTiles.clear();

        // 记录已访问
        if (!this._playerData) return false;

        if (!this._playerData.exploration.visitedMaps.includes(mapId)) {
            this._playerData.exploration.visitedMaps.push(mapId);
        }

        this._playerData.exploration.currentMapId = mapId;

        EventManager.instance.emit(GameEvents.MAP_ENTER, mapId);

        console.log(`进入地图: ${config.name}`);
        return true;
    }

    /**
     * 检查解锁条件
     */
    private checkUnlockCondition(condition: string): boolean {
        if (!this._playerData) return false;

        // 解析条件
        // 示例: "level >= 5"
        if (condition.startsWith('level >=')) {
            const level = parseInt(condition.replace('level >= ', ''));
            return this._playerData.character.level >= level;
        }

        if (condition.startsWith('mainQuest >=')) {
            const quest = parseInt(condition.replace('mainQuest >= ', ''));
            return this._playerData.quests.mainQuestProgress >= quest;
        }

        return false;
    }

    /**
     * 生成地图
     */
    private generateMap(config: any): MapData {
        const width = config.width;
        const height = config.height;
        const tiles: MapTile[][] = [];

        // 初始化所有地块为草地
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                tiles[y][x] = {
                    x,
                    y,
                    type: 'grass',
                    walkable: true
                };
            }
        }

        // 生成墙壁（随机）
        const wallCount = Math.floor(width * height * 0.1); // 10% 墙壁
        for (let i = 0; i < wallCount; i++) {
            const x = Utils.randomInt(1, width - 2);
            const y = Utils.randomInt(1, height - 2);
            tiles[y][x] = {
                x,
                y,
                type: 'wall',
                walkable: false
            };
        }

        // 生成水域（随机）
        const waterCount = Math.floor(width * height * 0.05); // 5% 水域
        for (let i = 0; i < waterCount; i++) {
            const x = Utils.randomInt(1, width - 2);
            const y = Utils.randomInt(1, height - 2);
            tiles[y][x] = {
                x,
                y,
                type: 'water',
                walkable: false
            };
        }

        // 生成装饰物（树木、石头）
        this.generateDecorations(tiles, width, height);

        // 生成秘密位置
        this.generateSecrets(tiles, width, height, config.secrets);

        // 生成出口点
        const exitPoints: Array<{ x: number; y: number; targetMap: string }> = [];
        if (config.id === 'starter_village') {
            // 新手村到暗黑森林
            exitPoints.push({ x: width - 2, y: Math.floor(height / 2), targetMap: 'dark_forest' });
        }

        // 入口点（地图中心）
        const entryPoint = {
            x: Math.floor(width / 2),
            y: Math.floor(height / 2)
        };

        return {
            id: config.id,
            name: config.name,
            realm: config.realm,
            width,
            height,
            tiles,
            entryPoint,
            exitPoints,
            secrets: config.secrets
        };
    }

    /**
     * 生成装饰物
     */
    private generateDecorations(tiles: MapTile[][], width: number, height: number): void {
        const decorationCount = Math.floor(width * height * 0.08); // 8% 装饰物

        for (let i = 0; i < decorationCount; i++) {
            const x = Utils.randomInt(1, width - 2);
            const y = Utils.randomInt(1, height - 2);

            if (tiles[y][x].type === 'grass') {
                const decorations = ['tree', 'rock', 'bush'];
                tiles[y][x].decoration = Utils.randomChoice(decorations);
            }
        }
    }

    /**
     * 生成秘密位置
     */
    private generateSecrets(tiles: MapTile[][], width: number, height: number, secrets: string[]): void {
        secrets.forEach(secretId => {
            let x, y;
            let attempts = 0;

            // 尝试找到可行走位置
            do {
                x = Utils.randomInt(1, width - 2);
                y = Utils.randomInt(1, height - 2);
                attempts++;
            } while ((!tiles[y][x].walkable || tiles[y][x].decoration) && attempts < 100);

            if (attempts < 100) {
                tiles[y][x].secret = secretId;
            }
        });
    }

    /**
     * 移动玩家
     */
    public movePlayer(dx: number, dy: number): boolean {
        if (!this._currentMap) return false;

        const newX = this._playerPos.x + dx;
        const newY = this._playerPos.y + dy;

        // 检查边界
        if (newX < 0 || newX >= this._currentMap.width ||
            newY < 0 || newY >= this._currentMap.height) {
            return false;
        }

        // 检查可行走
        const tile = this._currentMap.tiles[newY][newX];
        if (!tile.walkable) {
            return false;
        }

        // 移动玩家
        this._playerPos = { x: newX, y: newY };

        // 记录探索
        const tileKey = `${newX},${newY}`;
        if (!this._exploredTiles.has(tileKey)) {
            this._exploredTiles.add(tileKey);
            EventManager.instance.emit(GameEvents.MAP_EXPLORE, newX, newY);
        }

        // 检查秘密
        if (tile.secret && !this._playerData?.exploration.discoveredSecrets.includes(tile.secret)) {
            this.discoverSecret(tile.secret);
        }

        // 检查出口
        const exit = this._currentMap.exitPoints.find(e => e.x === newX && e.y === newY);
        if (exit) {
            this.switchMap(exit.targetMap);
        }

        return true;
    }

    /**
     * 发现秘密
     */
    private discoverSecret(secretId: string): void {
        if (!this._playerData) return;

        this._playerData.exploration.discoveredSecrets.push(secretId);
        EventManager.instance.emit(GameEvents.SECRET_DISCOVER, secretId);

        // 奖励
        this._playerData.base.resources.gold += 100;
        console.log(`发现秘密: ${secretId}`);
    }

    /**
     * 切换地图
     */
    private switchMap(targetMap: string): void {
        console.log(`切换地图: ${this._currentMap!.id} -> ${targetMap}`);
        this.loadMap(targetMap);
    }

    /**
     * 遭遇敌事件
     */
    public triggerEncounter(): Encounter {
        if (!this._currentMap) {
            return { type: 'nothing' };
        }

        const config = MAP_CONFIG[this._currentMap.id];
        if (!config || !config.monsters) {
            return { type: 'nothing' };
        }

        // 随机选择敌人
        const enemyId = Utils.randomChoice(config.monsters);

        // 随机宝箱
        const treasureChance = 5; // 5% 概率
        if (Utils.randomInt(1, 100) <= treasureChance) {
            return {
                type: 'treasure',
                gold: Utils.randomInt(10, 50),
                item: { id: 'health_potion', quantity: Utils.randomInt(1, 3) }
            };
        }

        return {
            type: 'enemy',
            enemyId
        };
    }

    /**
     * 获取当前地图
     */
    public getCurrentMap(): MapData | null {
        return this._currentMap;
    }

    /**
     * 获取玩家位置
     */
    public getPlayerPosition(): { x: number; y: number } {
        return { ...this._playerPos };
    }

    /**
     * 获取探索进度
     */
    public getExplorationProgress(): { explored: number; total: number; percentage: number } {
        if (!this._currentMap) {
            return { explored: 0, total: 0, percentage: 0 };
        }

        const total = this._currentMap.width * this._currentMap.height;
        const explored = this._exploredTiles.size;

        return {
            explored,
            total,
            percentage: Utils.percentage(explored, total)
        };
    }

    /**
     * 是否已发现所有秘密
     */
    public allSecretsDiscovered(): boolean {
        if (!this._currentMap || !this._playerData) return false;

        return this._currentMap.secrets.every(secret =>
            this._playerData.exploration.discoveredSecrets.includes(secret)
        );
    }
}
