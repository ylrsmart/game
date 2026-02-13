/**
 * 存档管理器
 * 负责游戏数据的保存和加载
 * 支持多种存储方式：本地存储、云存储（预留）
 */

import { _decorator, Component, sys } from 'cc';
import { PlayerData } from '../data/PlayerData';
import DataManager from './DataManager';

const { ccclass } = _decorator;

@ccclass('SaveManager')
export class SaveManager extends Component {
    private static readonly SAVE_KEY = 'six_realms_save';
    private static readonly SAVE_VERSION_KEY = 'six_realms_save_version';
    private static readonly AUTO_SAVE_INTERVAL = 60000; // 60秒自动保存

    private autoSaveTimer: number = 0;
    private dataManager: DataManager = null!;

    protected onLoad(): void {
        this.dataManager = this.getComponent(DataManager) || this.getComponentInParent(DataManager);
        this.startAutoSave();
    }

    protected onDestroy(): void {
        this.stopAutoSave();
    }

    /**
     * 保存数据到本地
     */
    public async saveData(data: PlayerData): Promise<boolean> {
        try {
            const saveTime = Date.now();
            const saveString = JSON.stringify(data);

            // 验证数据
            const parsed = JSON.parse(saveString);
            if (!this.dataManager || !this.dataManager.validateData(parsed)) {
                throw new Error('数据验证失败');
            }

            // 保存到本地存储
            sys.localStorage.setItem(SaveManager.SAVE_KEY, saveString);
            sys.localStorage.setItem(SaveManager.SAVE_VERSION_KEY, saveTime.toString());

            console.log(`数据保存成功，耗时: ${Date.now() - saveTime}ms`);

            // TODO: 同步到云端（预留）
            await this.syncToCloud(data);

            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    /**
     * 加载本地数据
     */
    public async loadSave(): Promise<PlayerData | null> {
        try {
            const saveString = sys.localStorage.getItem(SaveManager.SAVE_KEY);

            if (!saveString) {
                console.log('没有找到存档');
                return null;
            }

            const saveTime = sys.localStorage.getItem(SaveManager.SAVE_VERSION_KEY);
            console.log(`存档时间: ${saveTime ? new Date(parseInt(saveTime)).toLocaleString() : '未知'}`);

            const data = JSON.parse(saveString) as PlayerData;

            // 验证数据
            if (!this.dataManager || !this.dataManager.validateData(data)) {
                console.error('存档数据无效');
                return null;
            }

            return data;
        } catch (error) {
            console.error('加载存档失败:', error);
            return null;
        }
    }

    /**
     * 检查存档是否存在
     */
    public hasSave(): boolean {
        return sys.localStorage.getItem(SaveManager.SAVE_KEY) !== null;
    }

    /**
     * 删除存档
     */
    public async deleteSave(): Promise<boolean> {
        try {
            sys.localStorage.removeItem(SaveManager.SAVE_KEY);
            sys.localStorage.removeItem(SaveManager.SAVE_VERSION_KEY);
            console.log('存档已删除');
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }

    /**
     * 获取存档信息
     */
    public getSaveInfo(): { exists: boolean; saveTime: Date; level: number } | null {
        const saveString = sys.localStorage.getItem(SaveManager.SAVE_KEY);
        if (!saveString) return null;

        try {
            const data = JSON.parse(saveString) as PlayerData;
            const saveTime = sys.localStorage.getItem(SaveManager.SAVE_VERSION_KEY);

            return {
                exists: true,
                saveTime: saveTime ? new Date(parseInt(saveTime)) : new Date(),
                level: data.character.level
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * 导出存档（用于备份）
     */
    public exportSave(): string {
        const saveString = sys.localStorage.getItem(SaveManager.SAVE_KEY);
        if (!saveString) {
            throw new Error('没有存档可导出');
        }

        // Base64编码
        return btoa(saveString);
    }

    /**
     * 导入存档（从备份恢复）
     */
    public async importSave(encodedData: string): Promise<boolean> {
        try {
            // Base64解码
            const saveString = atob(encodedData);
            const data = JSON.parse(saveString) as PlayerData;

            // 验证数据
            if (!this.dataManager || !this.dataManager.validateData(data)) {
                throw new Error('存档数据无效');
            }

            // 保存导入的数据
            return await this.saveData(data);
        } catch (error) {
            console.error('导入存档失败:', error);
            return false;
        }
    }

    /**
     * 开始自动保存
     */
    private startAutoSave(): void {
        // Cocos Creator的定时器
        this.schedule(() => {
            const gameManager = this.getComponentInParent(GameManager);
            if (gameManager && gameManager.playerData) {
                this.saveData(gameManager.playerData);
            }
        }, SaveManager.AUTO_SAVE_INTERVAL / 1000);
    }

    /**
     * 停止自动保存
     */
    private stopAutoSave(): void {
        this.unscheduleAllCallbacks();
    }

    /**
     * 手动触发自动保存
     */
    public triggerAutoSave(): void {
        const gameManager = this.getComponentInParent(GameManager);
        if (gameManager && gameManager.playerData) {
            this.saveData(gameManager.playerData);
        }
    }

    /**
     * 同步到云端（预留接口）
     * 未来可接入微信云开发或其他云服务
     */
    private async syncToCloud(data: PlayerData): Promise<void> {
        // TODO: 实现云同步
        // 示例代码（微信云开发）:
        // if (typeof wx !== 'undefined') {
        //     try {
        //         await wx.cloud.callFunction({
        //             name: 'saveGame',
        //             data: { saveData: data }
        //         });
        //     } catch (error) {
        //         console.error('云同步失败:', error);
        //     }
        // }
    }

    /**
     * 从云端加载（预留接口）
     */
    public async loadFromCloud(): Promise<PlayerData | null> {
        // TODO: 实现从云端加载
        return null;
    }
}
