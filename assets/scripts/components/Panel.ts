/**
 * 面板组件
 * 用于弹窗、对话框等
 */

import { _decorator, Component, Node, Sprite, UITransform, Vec3, tween, UIOpacity } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Button } from './Button';

const { ccclass, property } = _decorator;

export type PanelState = 'closed' | 'opening' | 'open' | 'closing';

@ccclass('Panel')
export class Panel extends Component {
    // ========== 属性 ==========

    @property({ tooltip: '面板标题' })
    title: string = '';

    @property({ tooltip: '面板宽度' })
    width: number = 400;

    @property({ tooltip: '面板高度' })
    height: number = 300;

    @property({ tooltip: '是否模态窗口' })
    isModal: boolean = false;

    @property({ tooltip: '是否可拖动' })
    draggable: boolean = false;

    @property(Node)
    contentContainer: Node | null = null;

    // ========== 内部变量 ==========

    private _background: Sprite | null = null;
    private _currentState: PanelState = 'closed';
    private _closeButton: Button | null = null;
    private _callback: (() => void) | null = null;

    // ========== 生命周期 ==========

    protected onLoad(): void {
        this.initUI();
    }

    protected start(): void {
        this.bindEvents();
    }

    protected onDestroy(): void {
        this.unbindEvents();
    }

    // ========== UI 初始化 ==========

    private initUI(): void {
        this._background = this.getComponent(Sprite);
        this._closeButton = this.getComponentInChildren(Button);

        if (this._closeButton) {
            this._closeButton.text = '关闭';
            this._closeButton.colorType = 'danger';
            this._closeButton.setCallback(() => this.close());
        }

        // 设置尺寸
        const transform = this.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(this.width, this.height);
            transform.setAnchorPoint(0.5, 0.5);
        }

        // 初始关闭
        this.node.active = false;
    }

    private bindEvents(): void {
        // 点击背景关闭（如果是模态窗口）
        if (this.isModal) {
            this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        }

        // 绑定关闭按钮
        if (this._closeButton) {
            this._closeButton.setCallback(() => this.close());
        }
    }

    private unbindEvents(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    // ========== 事件处理 ==========

    private onTouchStart(event: EventTouch): void {
        // 检查点击的是否是背景（关闭窗口）
        // this._background 应该是第一个子节点
        const target = event.target as Node;

        if (target === this._background?.node) {
            this.close();
        }
    }

    // ========== 公开 API ==========

    /**
     * 显示面板
     */
    public async show(callback?: () => void): Promise<void> {
        if (this._currentState !== 'closed') {
            return;
        }

        this._callback = callback;

        // 显示节点
        this.node.active = true;

        // 播放打开动画
        this._currentState = 'opening';
        await this.playOpenAnimation();

        this._currentState = 'open';

        // 如果是模态窗口，禁用其他交互
        if (this.isModal) {
            EventManager.instance.emit(GameEvents.UI_SHOW, 'modal_open', this.node.uuid);
        }
    }

    /**
     * 隐藏面板
     */
    public async hide(): Promise<void> {
        if (this._currentState === 'closed' || this._currentState === 'closing') {
            return;
        }

        // 播放关闭动画
        this._currentState = 'closing';
        await this.playCloseAnimation();

        this._currentState = 'closed';
        this.node.active = false;

        // 触发关闭回调
        if (this._callback) {
            this._callback();
        }

        // 如果是模态窗口，恢复其他交互
        if (this.isModal) {
            EventManager.instance.emit(GameEvents.UI_HIDE, 'modal_close');
        }
    }

    /**
     * 获取当前状态
     */
    public getState(): PanelState {
        return this._currentState;
    }

    /**
     * 播放打开动画
     */
    private async playOpenAnimation(): Promise<void> {
        return new Promise(resolve => {
            tween(this.node)
                .to(0.2, { scale: new Vec3(0.8, 0.8, 1) })
                .to(0.1, { scale: new Vec3(1.05, 1.05, 1) })
                .call(() => resolve())
                .start();
        });
    }

    /**
     * 播放关闭动画
     */
    private async playCloseAnimation(): Promise<void> {
        return new Promise(resolve => {
            tween(this.node)
                .to(0.15, { scale: new Vec3(0.9, 0.9, 1) })
                .to(0.1, { scale: new Vec3(0.5, 0.5, 1) })
                .call(() => resolve())
                .start();
        });
    }
}
