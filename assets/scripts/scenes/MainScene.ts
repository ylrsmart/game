/**
 * 主菜单场景
 * 游戏启动界面
 */

import { _decorator, Component, Node, Sprite, Label, director, SpriteFrame } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';
import { BaseScene } from './BaseScene';
import { Button } from '../components/Button';

const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends BaseScene {
    // ========== UI 节点 ==========

    @property(Node)
    bgNode: Node | null = null;

    @property(Node)
    titleNode: Node | null = null;

    @property(Node)
    buttonContainer: Node | null = null;

    // ========== 组件引用 ==========

    private _newGameButton: Button | null = null;
    private _continueGameButton: Button | null = null;
    private _settingsButton: Button | null = null;

    // ========== 生命周期 ==========

    protected onPanelInit(): void {
        // 场景淡入
        this.fadeIn(0.5);

        // 初始化UI
        this.initBackground();
        this.initTitle();
        this.initButtons();
    }

    // ========== UI 初始化 ==========

    private initBackground(): void {
        if (!this.bgNode) return;

        const bgSprite = this.bgNode.getComponent(Sprite);
        if (bgSprite) {
            // 使用资源中的主菜单背景
            bgSprite.spriteFrame = null;
            bgSprite.enabled = true;
        }
    }

    private initTitle(): void {
        if (!this.titleNode) return;

        const titleLabel = this.titleNode.getComponent(Label);
        if (titleLabel) {
            titleLabel.string = '六界：起源';
            titleLabel.fontSize = 48;
            titleLabel.lineHeight = 60;
        }
    }

    private initButtons(): void {
        if (!this.buttonContainer) return;

        const children = this.buttonContainer.children;

        // 绑定按钮组件
        if (children.length >= 1) {
            this._newGameButton = children[0].getComponent(Button);
            if (this._newGameButton) {
                this._newGameButton.text = '新游戏';
                this._newGameButton.colorType = 'primary';
                this._newGameButton.setCallback(() => this.onNewGameClick());
            }
        }

        if (children.length >= 2) {
            this._continueGameButton = children[1].getComponent(Button);
            if (this._continueGameButton) {
                this._continueGameButton.text = '继续游戏';
                this._continueGameButton.colorType = 'success';
                this._continueGameButton.setCallback(() => this.onContinueGameClick());
                // 检查是否有存档
                this.checkSaveExists();
            }
        }

        if (children.length >= 3) {
            this._settingsButton = children[2].getComponent(Button);
            if (this._settingsButton) {
                this._settingsButton.text = '设置';
                this._settingsButton.colorType = 'secondary';
                this._settingsButton.setCallback(() => this.onSettingsClick());
            }
        }
    }

    // ========== 业务逻辑 ==========

    private onNewGameClick(): void {
        console.log('点击新游戏');
        EventManager.instance.emit(GameEvents.UI_SHOW, 'new_game_start');

        // TODO: 进入角色创建场景
        // const sceneManager = this.getComponentInParent(any)?.getComponent('SceneManager');
        // sceneManager?.startCharacterCreateScene();
    }

    private onContinueGameClick(): void {
        console.log('点击继续游戏');
        EventManager.instance.emit(GameEvents.UI_SHOW, 'continue_game');

        // TODO: 进入游戏场景
        // const gameManager = this.getComponentInParent(any)?.getComponent('GameManager');
        // gameManager?.continueGame();
    }

    private onSettingsClick(): void {
        console.log('点击设置');
        EventManager.instance.emit(GameEvents.UI_SHOW, 'open_settings');

        // TODO: 打开设置场景
        // director.loadScene('settings');
    }

    private checkSaveExists(): void {
        // TODO: 检查本地存档是否存在
        // const saveManager = this.getComponentInParent(any)?.getComponent('SaveManager');
        // const hasSave = saveManager?.hasSave();
        // if (!hasSave) {
        //     this._continueGameButton?.setEnabled(false);
        // }
    }

    // ========== 键盘控制 ==========

    protected onDestroy(): void {
        super.onDestroy();
    }
}
