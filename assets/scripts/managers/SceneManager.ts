/**
 * 场景管理器
 * 负责场景切换、加载、过渡
 */

import { _decorator, Component, director, Scene } from 'cc';
import GameManager from './GameManager';

const { ccclass } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    private _currentSceneName: string = '';
    private _isLoading: boolean = false;
    private _pauseMenuActive: boolean = false;

    /**
     * 加载主菜单场景
     */
    public loadMenuScene(): void {
        if (this._isLoading) return;
        this.loadScene('menu');
    }

    /**
     * 加载游戏场景
     */
    public loadGameScene(): void {
        if (this._isLoading) return;
        this.loadScene('game');
    }

    /**
     * 加载战斗场景
     */
    public loadBattleScene(enemyId: string, onBattleEnd: (win: boolean) => void): void {
        if (this._isLoading) return;

        // TODO: 传递战斗数据
        const battleData = {
            enemyId: enemyId,
            onBattleEnd: onBattleEnd
        };

        this.loadScene('battle', battleData);
    }

    /**
     * 加载基地场景
     */
    public loadBaseScene(): void {
        if (this._isLoading) return;
        this.loadScene('base');
    }

    /**
     * 显示暂停菜单
     */
    public showPauseMenu(): void {
        this._pauseMenuActive = true;
        // TODO: 显示暂停菜单UI
    }

    /**
     * 隐藏暂停菜单
     */
    public hidePauseMenu(): void {
        this._pauseMenuActive = false;
        // TODO: 隐藏暂停菜单UI
    }

    /**
     * 加载场景（内部方法）
     */
    private loadScene(sceneName: string, data?: any): void {
        if (this._isLoading) return;

        this._isLoading = true;
        const previousScene = this._currentSceneName;

        // 开始加载过渡
        this.startTransition(async () => {
            try {
                // 预加载场景
                await this.preloadScene(sceneName);

                // 切换场景
                director.loadScene(sceneName, (err, scene) => {
                    if (err) {
                        console.error('场景加载失败:', err);
                        this._isLoading = false;
                        return;
                    }

                    this._currentSceneName = sceneName;
                    this._isLoading = false;

                    // 传递数据给新场景
                    if (data) {
                        const sceneComponent = scene.getComponent(sceneName);
                        if (sceneComponent && 'onSceneData' in sceneComponent) {
                            (sceneComponent as any).onSceneData(data);
                        }
                    }

                    console.log(`场景切换: ${previousScene} -> ${sceneName}`);
                });
            } catch (error) {
                console.error('场景加载错误:', error);
                this._isLoading = false;
            }
        });
    }

    /**
     * 预加载场景
     */
    private preloadScene(sceneName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            director.preloadScene(sceneName, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 场景过渡效果
     */
    private startTransition(callback: () => void): void {
        // TODO: 实现过渡动画
        // 例如：淡入淡出、滑动等
        console.log('场景过渡中...');

        // 简单延时模拟过渡
        setTimeout(callback, 100);
    }

    /**
     * 获取当前场景名称
     */
    public getCurrentScene(): string {
        return this._currentSceneName;
    }

    /**
     * 是否正在加载
     */
    public isLoading(): boolean {
        return this._isLoading;
    }

    /**
     * 是否暂停菜单激活
     */
    public isPauseMenuActive(): boolean {
        return this._pauseMenuActive;
    }
}
