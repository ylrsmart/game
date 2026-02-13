/**
 * 游戏主场景
 * 核心游戏玩法场景
 */

import { _decorator, Component, Node, Sprite, Camera, Vec3, UITransform, input, Input, director, KeyCode } from 'cc';
import { EventManager, GameEvents } from '../utils/EventManager';
import { BaseScene } from './BaseScene';
import { Button } from '../components/Button';
import { CharacterSystem } from '../systems/CharacterSystem';
import { ExplorationSystem } from '../systems/ExplorationSystem';
import { BattleSystem } from '../systems/BattleSystem';
import { BuildingSystem } from '../systems/BuildingSystem';

const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends BaseScene {
    // ========== UI 节点 ==========

    @property(Node)
    uiLayer: Node | null = null;

    @property(Node)
    joystickNode: Node | null = null;

    @property(Node)
    skillBarNode: Node | null = null;

    @property(Node)
    statusBarNode: Node | null = null;

    // ========== 游戏系统 ==========

    private _characterSystem: CharacterSystem | null = null;
    private _explorationSystem: ExplorationSystem | null = null;
    private _battleSystem: BattleSystem | null = null;
    private _buildingSystem: BuildingSystem | null = null;

    // ========== 游戏状态 ==========

    private _isInBattle: boolean = false;
    private _isInBaseMode: boolean = false;
    private _currentMapId: string = 'starter_village';

    // ========== 生命周期 ==========

    protected onPanelInit(): void {
        // 场景淡入
        this.fadeIn(0.5);

        // 初始化系统
        this.initSystems();

        // 初始化UI
        this.initUI();

        // 绑定输入事件
        this.bindInput();
    }

    protected onExit(): void {
        super.onExit();

        // 清理系统
        this.cleanupSystems();

        // 解绑输入
        this.unbindInput();
    }

    // ========== 系统初始化 ==========

    private initSystems(): void {
        this._characterSystem = this.getComponent(CharacterSystem);
        this._explorationSystem = this.getComponent(ExplorationSystem);
        this._battleSystem = this.getComponent(BattleSystem);
        this._buildingSystem = this.getComponent(BuildingSystem);

        if (!this._characterSystem) {
            console.error('CharacterSystem not found');
        }
    }

    private cleanupSystems(): void {
        // 清理时可以做的操作
    }

    // ========== UI 初始化 ==========

    private initUI(): void {
        // TODO: 初始化虚拟摇杆
        // TODO: 初始化技能按钮
        // TODO: 初始化状态栏

        console.log('UI 初始化完成');
    }

    // ========== 输入绑定 ==========

    private bindInput(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private unbindInput(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // ========== 输入处理 ==========

    private onKeyDown(event: EventKeyboard): void {
        if (this._isInBattle) {
            // 战斗中的按键处理
            this.handleBattleInput(event.keyCode);
        } else {
            // 游戏中的按键处理
            this.handleGameInput(event.keyCode);
        }
    }

    private onKeyUp(event: EventKeyboard): void {
        // 按键抬起处理
    }

    private onTouchStart(event: EventTouch): void {
        const touch = event.touch;

        // 检查点击 UI 按钮
        const uiButtons = this.uiLayer?.getComponentsInChildren(Button);
        if (uiButtons) {
            for (const button of uiButtons) {
                // 简单的点击检测
                // 实际需要根据按钮位置判断
            }
        }

        // 检查点击地图
        if (!this._isInBattle && !this._isInBaseMode) {
            this._explorationSystem?.movePlayer(0, 0);
        }
    }

    private onTouchMove(event: EventTouch): void {
        if (this._isInBattle) return;

        const touch = event.touch;
        // TODO: 虚拟摇杆移动
        // this.handleJoystickMovement(touch);
    }

    private onTouchEnd(event: EventTouch): void {
        // 触摸结束处理
    }

    // ========== 游戏输入处理 ==========

    private handleGameInput(keyCode: KeyCode): void {
        switch (keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_UP_ARROW:
                this._explorationSystem?.movePlayer(0, 1);
                break;
            case KeyCode.KEY_S:
            case KeyCode.KEY_DOWN_ARROW:
                this._explorationSystem?.movePlayer(0, -1);
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_LEFT_ARROW:
                this._explorationSystem?.movePlayer(-1, 0);
                break;
            case KeyCode.KEY_D:
            case KeyCode.KEY_RIGHT_ARROW:
                this._explorationSystem?.movePlayer(1, 0);
                break;
            case KeyCode.KEY_E:
            // 交互键
                this.handleInteraction();
                break;
            case KeyCode.ESCAPE:
                // 打开菜单
                this.toggleMenu();
                break;
            case KeyCode.KEY_I:
                // 打开背包
                this.openInventory();
                break;
            case KeyCode.KEY_B:
                // 打开建造界面
                this.openBuildings();
                break;
        }
    }

    private handleBattleInput(keyCode: KeyCode): void {
        switch (keyCode) {
            case KeyCode.KEY_1:
            case KeyCode.KEY_Q:
                // 技能1
                this._battleSystem?.useSkill(this._characterSystem?.getCharacterStats(), null, 'attack');
                break;
            case KeyCode.KEY_2:
            case KeyCode.KEY_W:
                // 技能2
                break;
            case KeyCode.KEY_3:
            case KeyCode.KEY_E:
                // 技能3
                break;
            case KeyCode.ESCAPE:
                // 逃跑
                this._battleSystem?.skipTurn();
                break;
        }
    }

    private handleInteraction(): void {
        // TODO: 与NPC/物体交互
        console.log('交互');
    }

    private openInventory(): void {
        console.log('打开背包');
        EventManager.instance.emit(GameEvents.UI_SHOW, 'inventory');
    }

    private openBuildings(): void {
        console.log('打开建造界面');
        this._isInBaseMode = !this._isInBaseMode;
    }

    private toggleMenu(): void {
        console.log('切换菜单');
    }

    // ========== 游戏循环 ==========

    protected update(deltaTime: number): void {
        // 游戏主循环更新
        // TODO: 角色动画更新
        // TODO: 粒子效果更新
        // TODO: UI 状态更新
    }
}
