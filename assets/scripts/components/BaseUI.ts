/**
 * 基础 UI 组件
 * 所有 UI 面板的基类
 */

import { _decorator, Component, Node, UITransform, Vec3, tween } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';

const { ccclass, property } = _decorator;

export interface UIPanelData {
    onClose?: () => void;
    onConfirm?: (data?: any) => void;
    [key: string]: any;
}

@ccclass('BaseUI')
export class BaseUI extends Component {
    // 是否为模态窗口（背景变暗）
    @property({ tooltip: '是否为模态窗口' })
    isModal: boolean = false;

    // 是否自动居中
    @property({ tooltip: '是否自动居中显示' })
    autoCenter: boolean = true;

    // 动画时长
    @property({ tooltip: '显示/隐藏动画时长' })
    animDuration: number = 0.3;

    // 面板数据
    protected _data: UIPanelData | null = null;

    // 背景节点
    protected _bgNode: Node | null = null;

    protected onLoad(): void {
        if (this.autoCenter) {
            this.centerPanel();
        }
    }

    protected start(): void {
        this.onPanelInit();
    }

    /**
     * 面板初始化（子类重写）
     */
    protected onPanelInit(): void {
        // 子类可重写
    }

    /**
     * 显示面板
     */
    public async show(data?: UIPanelData): Promise<void> {
        this._data = data || {};

        // 显示节点
        this.node.active = true;

        // 模态背景
        if (this.isModal && !this._bgNode) {
            this.createModalBg();
        }

        // 播放显示动画
        await this.playShowAnim();

        // 注册关闭事件
        this.node.on(Node.EventType.TOUCH_END, this.onClose, this);
    }

    /**
     * 隐藏面板
     */
    public async hide(): Promise<void> {
        // 播放隐藏动画
        await this.playHideAnim();

        // 隐藏节点
        this.node.active = false;

        // 移除关闭事件
        this.node.off(Node.EventType.TOUCH_END, this.onClose, this);
    }

    /**
     * 关闭面板
     */
    protected onClose(): void {
        if (this._data?.onClose) {
            this._data.onClose();
        }
        this.hide();
    }

    /**
     * 确认操作
     */
    protected onConfirm(data?: any): void {
        if (this._data?.onConfirm) {
            this._data.onConfirm(data);
        }
        this.hide();
    }

    /**
     * 更新面板数据
     */
    public updateData(data: Partial<UIPanelData>): void {
        if (!this._data) {
            this._data = {};
        }
        Object.assign(this._data, data);
        this.onDataChanged();
    }

    /**
     * 数据变化（子类可重写）
     */
    protected onDataChanged(): void {
        // 子类可重写
    }

    /**
     * 创建模态背景
     */
    private createModalBg(): void {
        // TODO: 创建半透明黑色背景
        // 可以通过创建一个全屏黑色半透明 Sprite 来实现
    }

    /**
     * 居中面板
     */
    private centerPanel(): void {
        const transform = this.getComponent(UITransform);
        if (transform) {
            // 已在 Cocos Creator 编辑器中设置
        }
    }

    /**
     * 播放显示动画
     */
    private async playShowAnim(): Promise<void> {
        return new Promise(resolve => {
            this.node.setScale(0.5, 0.5);

            tween(this.node)
                .to(this.animDuration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .call(() => resolve())
                .start();
        });
    }

    /**
     * 播放隐藏动画
     */
    private async playHideAnim(): Promise<void> {
        return new Promise(resolve => {
            tween(this.node)
                .to(this.animDuration, { scale: new Vec3(0.5, 0.5, 1) })
                .call(() => resolve())
                .start();
        });
    }
}
