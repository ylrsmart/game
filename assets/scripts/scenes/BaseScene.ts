/**
 * 基础场景类
 * 所有游戏场景的基类
 */

import { _decorator, Component, Node, UIOpacity, tween, Vec3 } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';

const { ccclass, property } = _decorator;

@ccclass('BaseScene')
export class BaseScene extends Component {
    // 场景数据（从 SceneManager 传入）
    public sceneData: any = null;

    // UI 节点
    @property(Node)
    uiLayer: Node | null = null;

    protected onLoad(): void {
        this.onEnter();
    }

    protected start(): void {
        this.onSceneReady();
    }

    protected onDestroy(): void {
        this.onExit();
    }

    /**
     * 场景进入时调用
     */
    public onEnter(): void {
        console.log(`场景进入: ${this.node.name}`);
        EventManager.instance.emit(GameEvents.SCENE_LOAD_END, this.node.name);
    }

    /**
     * 场景数据初始化（由 SceneManager 调用）
     */
    public onSceneData(data: any): void {
        this.sceneData = data;
        console.log('场景数据:', data);
    }

    /**
     * 场景准备就绪
     */
    protected onSceneReady(): void {
        // 子类可重写
    }

    /**
     * 场景退出时调用
     */
    public onExit(): void {
        console.log(`场景退出: ${this.node.name}`);
        // 清理工作
    }

    /**
     * 显示 UI 面板
     */
    protected showPanel(panelName: string, data?: any): void {
        EventManager.instance.emit(GameEvents.UI_SHOW, panelName, data);
    }

    /**
     * 隐藏 UI 面板
     */
    protected hidePanel(panelName: string): void {
        EventManager.instance.emit(GameEvents.UI_HIDE, panelName);
    }

    /**
     * 场景淡入
     */
    protected fadeIn(duration: number = 0.5): Promise<void> {
        return new Promise(resolve => {
            const uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
            uiOpacity.opacity = 0;

            tween(uiOpacity)
                .to(duration, { opacity: 255 })
                .call(() => resolve())
                .start();
        });
    }

    /**
     * 场景淡出
     */
    protected fadeOut(duration: number = 0.5): Promise<void> {
        return new Promise(resolve => {
            const uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);

            tween(uiOpacity)
                .to(duration, { opacity: 0 })
                .call(() => resolve())
                .start();
        });
    }
}
