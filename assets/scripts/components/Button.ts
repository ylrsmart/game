/**
 * 按钮组件
 * Cocos Creator 中的按钮实现
 */

import { _decorator, Component, Node, Sprite, Label, UITransform, Vec3, tween, UIOpacity, Color } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';

const { ccclass, property } = _decorator;

export type ButtonState = 'normal' | 'pressed' | 'disabled' | 'hover';

@ccclass('Button')
export class Button extends Component {
    // ========== 属性 ==========

    @property({ tooltip: '按钮文本' })
    text: string = '';

    @property({ tooltip: '是否默认禁用' })
    disabled: boolean = false;

    @property({ tooltip: '按钮颜色类型 (primary/secondary/success/danger)' })
    colorType: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';

    @property({ tooltip: '按钮宽度' })
    width: number = 200;

    @property({ tooltip: '按钮高度' })
    height: number = 60;

    @property({ tooltip: '字体大小' })
    fontSize: number = 24;

    @property({ tooltip: '是否圆角' })
    rounded: boolean = true;

    // ========== 内部变量 ==========

    private _background: Node | null = null;
    private _labelNode: Label | null = null;
    private _currentState: ButtonState = 'normal';
    private _callback: (() => void) | null = null;

    // ========== 颜色配置 ==========

    private static readonly COLORS = {
        primary: {
            normal: new Color(65, 141, 255),    // #418dff
            pressed: new Color(52, 113, 255),   // #3471ff
            disabled: new Color(128, 128, 128),   // 灰色
            hover: new Color(102, 170, 255)     // #66aaff
        },
        secondary: {
            normal: new Color(255, 255, 255),
            pressed: new Color(220, 220, 220),
            disabled: new Color(128, 128, 128),
            hover: new Color(255, 255, 255)
        },
        success: {
            normal: new Color(46, 204, 113),      // #2ecc71
            pressed: new Color(39, 174, 96),
            disabled: new Color(128, 128, 128),
            hover: new Color(67, 219, 142)
        },
        danger: {
            normal: new Color(231, 76, 60),      // #e74c3c
            pressed: new Color(192, 57, 43),
            disabled: new Color(128, 128, 128),
            hover: new Color(241, 112, 90)
        }
    };

    // ========== 生命周期 ==========

    protected onLoad(): void {
        this.initUI();
        this.updateState();
    }

    protected start(): void {
        this.bindEvents();
    }

    protected onDestroy(): void {
        this.unbindEvents();
    }

    // ========== UI 初始化 ==========

    private initUI(): void {
        // 查找或创建子节点
        this._background = this.node.getChildByPath('Background');
        this._labelNode = this.getComponentInChildren(Label) || null;

        // 设置 UITransform
        const transform = this.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(this.width, this.height);
            transform.setAnchorPoint(0.5, 0.5);
        }
    }

    private bindEvents(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private unbindEvents(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    // ========== 触摸事件 ==========

    private onTouchStart(event: EventTouch): void {
        if (this.disabled) return;

        this.setState('pressed');
        EventManager.instance.emit(GameEvents.UI_SHOW, 'button_press', this.node.uuid);
    }

    private onTouchEnd(event: EventTouch): void {
        if (this.disabled || this._currentState === 'disabled') return;

        this.setState('normal');

        // 触发点击回调
        if (this._callback) {
            this._callback();
        }

        EventManager.instance.emit(GameEvents.UI_SHOW, 'button_click', this.node.uuid);
    }

    private onTouchCancel(event: EventTouch): void {
        this.setState('normal');
    }

    // ========== 状态管理 ==========

    private setState(state: ButtonState): void {
        if (this._currentState === state) return;

        this._currentState = state;
        this.updateVisuals();
    }

    private updateState(): void {
        const state = this.disabled ? 'disabled' : 'normal';
        this._currentState = state;
        this.updateVisuals();
    }

    private updateVisuals(): void {
        const colors = Button.COLORS[this.colorType];
        const color = colors[this._currentState];

        // 更新背景颜色
        if (this._background) {
            const bgSprite = this._background.getComponent(Sprite);
            if (bgSprite) {
                bgSprite.color = color;
                bgSprite.enabled = true;
            }
        }

        // 更新文本颜色
        if (this._labelNode) {
            this._labelNode.color = new Color(255, 255, 255);
        }

        // 更新不透明度
        const opacity = this.getComponent(UIOpacity);
        if (opacity) {
            opacity.opacity = this._currentState === 'disabled' ? 0.5 : 1;
        }
    }

    // ========== 公开 API ==========

    /**
     * 设置点击回调
     */
    public setCallback(callback: () => void): void {
        this._callback = callback;
    }

    /**
     * 设置按钮文本
     */
    public setText(text: string): void {
        this.text = text;
        if (this._labelNode) {
            this._labelNode.string = text;
        }
    }

    /**
     * 禁用/启用按钮
     */
    public setEnabled(enabled: boolean): void {
        this.disabled = !enabled;
        this.updateState();
    }

    /**
     * 获取当前状态
     */
    public getState(): ButtonState {
        return this._currentState;
    }

    /**
     * 播放点击动画
     */
    public playClickAnimation(): Promise<void> {
        return new Promise(resolve => {
            if (this._background) {
                tween(this._background)
                    .to(0.1, { scale: new Vec3(0.9, 0.9, 1) })
                    .to(0.1, { scale: new Vec3(1.05, 1.05, 1) })
                    .call(() => resolve())
                    .start();
            } else {
                resolve();
            }
        });
    }
}
