/**
 * 游戏主管理器
 * 负责游戏初始化、全局状态管理
 */

import { _decorator, Component } from 'cc';
import { PlayerData } from '../data/PlayerData';
import DataManager from './DataManager';
import SceneManager from './SceneManager';
import SaveManager from './SaveManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;
    public static get instance(): GameManager {
        return GameManager._instance;
    }

    // ========== 子管理器 ==========
    public dataManager: DataManager = null!;
    public sceneManager: SceneManager = null!;
    public saveManager: SaveManager = null!;

    // ========== 游戏状态 ==========
    private _gameState: 'loading' | 'menu' | 'playing' | 'paused' = 'loading';
    public get gameState(): 'loading' | 'menu' | 'playing' | 'paused' {
        return this._gameState;
    }

    // ========== 玩家数据 ==========
    private _playerData: PlayerData | null = null;
    public get playerData(): PlayerData | null {
        return this._playerData;
    }

    // ========== 系统初始化 ==========
    protected onLoad(): void {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;

        this.initManagers();
        this.loadGameData();
    }

    /**
     * 初始化子管理器
     */
    private initManagers(): void {
        // 查找或创建子管理器
        this.dataManager = this.getComponent(DataManager) || this.addComponent(DataManager);
        this.sceneManager = this.getComponent(SceneManager) || this.addComponent(SceneManager);
        this.saveManager = this.getComponent(SaveManager) || this.addComponent(SaveManager);
    }

    /**
     * 加载游戏数据
     */
    private async loadGameData(): Promise<void> {
        this._gameState = 'loading';

        try {
            // 尝试加载存档
            const savedData = await this.saveManager.loadSave();

            if (savedData) {
                // 加载存档
                this._playerData = savedData;
                console.log('存档加载成功');
            } else {
                // 创建新数据
                this._playerData = this.dataManager.createNewPlayer();
                console.log('创建新玩家数据');
            }

            // 验证数据版本
            if (this._playerData.version !== this.getCurrentVersion()) {
                this.migrateData(this._playerData);
            }

            // 更新最后登录时间
            this._playerData.lastLoginTime = Date.now();

            // 进入主菜单
            this._gameState = 'menu';
            this.sceneManager.loadMenuScene();
        } catch (error) {
            console.error('加载数据失败:', error);
            // 失败则创建新数据
            this._playerData = this.dataManager.createNewPlayer();
            this._gameState = 'menu';
            this.sceneManager.loadMenuScene();
        }
    }

    /**
     * 开始新游戏
     */
    public startNewGame(characterClass: 'warrior' | 'mage' | 'healer' | 'assassin'): void {
        this._playerData = this.dataManager.createNewPlayer(characterClass);
        this.saveManager.saveData(this._playerData);
        this._gameState = 'playing';
        this.sceneManager.loadGameScene();
    }

    /**
     * 继续游戏
     */
    public continueGame(): void {
        if (!this._playerData) {
            console.error('没有存档数据');
            return;
        }
        this._gameState = 'playing';
        this.sceneManager.loadGameScene();
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        this._gameState = 'paused';
        this.sceneManager.showPauseMenu();
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        this._gameState = 'playing';
        this.sceneManager.hidePauseMenu();
    }

    /**
     * 保存游戏
     */
    public async saveGame(): Promise<void> {
        if (!this._playerData) return;

        try {
            await this.saveManager.saveData(this._playerData);
            console.log('游戏已保存');
        } catch (error) {
            console.error('保存失败:', error);
        }
    }

    /**
     * 获取当前数据版本
     */
    private getCurrentVersion(): number {
        return 1; // 随着游戏更新增加
    }

    /**
     * 数据迁移（版本兼容）
     */
    private migrateData(data: PlayerData): void {
        console.log(`迁移数据从版本 ${data.version} 到 ${this.getCurrentVersion()}`);
        // 处理版本兼容性
        data.version = this.getCurrentVersion();
    }

    /**
     * 添加经验值
     */
    public addExp(amount: number): void {
        if (!this._playerData) return;

        this._playerData.character.exp += amount;

        // 检查升级
        while (this._playerData.character.exp >= this._playerData.character.expToNext) {
            this.levelUp();
        }

        // 自动保存
        this.saveGame();
    }

    /**
     * 升级
     */
    private levelUp(): void {
        if (!this._playerData) return;

        const char = this._playerData.character;
        char.exp -= char.expToNext;
        char.level++;
        char.expToNext = this.getNextLevelExp(char.level);

        // 增加属性点
        char.skillPoints++;

        console.log(`升级！当前等级: ${char.level}`);

        // TODO: 播放升级特效
    }

    /**
     * 获取升级所需经验
     */
    private getNextLevelExp(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    /**
     * 更新资源
     */
    public updateResource(type: 'gold' | 'wood' | 'stone' | 'crystals', amount: number): void {
        if (!this._playerData) return;

        this._playerData.base.resources[type] += amount;
        this.saveGame();
    }

    /**
     * 游戏退出时保存
     */
    protected onDestroy(): void {
        if (this._playerData) {
            this.saveManager.saveData(this._playerData);
        }
    }
}
