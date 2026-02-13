/**
 * 事件管理器
 * 全局事件系统，支持组件间通信
 */

export type EventHandler = (...args: any[]) => void;

export class EventManager {
    private static _instance: EventManager;
    public static get instance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    private _eventMap: Map<string, Set<EventHandler>> = new Map();

    /**
     * 注册事件监听
     */
    public on(eventName: string, handler: EventHandler): void {
        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, new Set());
        }
        this._eventMap.get(eventName)!.add(handler);
    }

    /**
     * 移除事件监听
     */
    public off(eventName: string, handler: EventHandler): void {
        const handlers = this._eventMap.get(eventName);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this._eventMap.delete(eventName);
            }
        }
    }

    /**
     * 触发事件
     */
    public emit(eventName: string, ...args: any[]): void {
        const handlers = this._eventMap.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(...args);
                } catch (error) {
                    console.error(`事件处理错误 [${eventName}]:`, error);
                }
            });
        }
    }

    /**
     * 注册一次性事件监听
     */
    public once(eventName: string, handler: EventHandler): void {
        const onceHandler: EventHandler = (...args: any[]) => {
            handler(...args);
            this.off(eventName, onceHandler);
        };
        this.on(eventName, onceHandler);
    }

    /**
     * 移除所有监听
     */
    public clear(eventName?: string): void {
        if (eventName) {
            this._eventMap.delete(eventName);
        } else {
            this._eventMap.clear();
        }
    }

    /**
     * 获取事件监听数量
     */
    public getListenerCount(eventName: string): number {
        return this._eventMap.get(eventName)?.size || 0;
    }
}

// ============== 游戏事件定义 ==============
export const GameEvents = {
    // 玩家事件
    PLAYER_LEVEL_UP: 'player:level_up',
    PLAYER_EXP_GAIN: 'player:exp_gain',
    PLAYER_HP_CHANGE: 'player:hp_change',
    PLAYER_MP_CHANGE: 'player:mp_change',
    PLAYER_DIE: 'player:die',

    // 战斗事件
    BATTLE_START: 'battle:start',
    BATTLE_END: 'battle:end',
    BATTLE_TURN_START: 'battle:turn_start',
    BATTLE_TURN_END: 'battle:turn_end',
    BATTLE_SKILL_USE: 'battle:skill_use',
    BATTLE_DAMAGE: 'battle:damage',
    BATTLE_HEAL: 'battle:heal',

    // 宠物事件
    PET_GET: 'pet:get',
    PET_LEVEL_UP: 'pet:level_up',
    PET_CAPTURE: 'pet:capture',

    // 建筑事件
    BUILDING_BUILD: 'building:build',
    BUILDING_UPGRADE: 'building:upgrade',
    BUILDING_COLLECT: 'building:collect',

    // 探索事件
    MAP_ENTER: 'map:enter',
    MAP_EXPLORE: 'map:explore',
    SECRET_DISCOVER: 'secret:discover',

    // 任务事件
    QUEST_START: 'quest:start',
    QUEST_COMPLETE: 'quest:complete',
    QUEST_PROGRESS: 'quest:progress',

    // 成就事件
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',

    // 资源事件
    RESOURCE_CHANGE: 'resource:change',

    // UI事件
    UI_SHOW: 'ui:show',
    UI_HIDE: 'ui:hide',
    UI_UPDATE: 'ui:update',

    // 存档事件
    SAVE: 'game:save',
    LOAD: 'game:load',

    // 场景事件
    SCENE_LOAD_START: 'scene:load_start',
    SCENE_LOAD_END: 'scene:load_end'
} as const;
