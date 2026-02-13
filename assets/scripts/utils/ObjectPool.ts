/**
 * 对象池
 * 用于重用游戏对象，减少垃圾回收
 */

export class ObjectPool<T> {
    private _pool: T[] = [];
    private _factory: () => T;
    private _resetFn?: (obj: T) => void;
    private _maxSize: number;

    /**
     * 创建对象池
     * @param factory 对象创建函数
     * @param resetFn 对象重置函数
     * @param maxSize 最大缓存数量
     */
    constructor(
        factory: () => T,
        resetFn?: (obj: T) => void,
        maxSize: number = 100
    ) {
        this._factory = factory;
        this._resetFn = resetFn;
        this._maxSize = maxSize;
    }

    /**
     * 从池中获取对象
     */
    public get(): T {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }
        return this._factory();
    }

    /**
     * 将对象放回池中
     */
    public release(obj: T): void {
        if (this._pool.length >= this._maxSize) {
            return; // 池已满，直接丢弃
        }

        // 重置对象状态
        if (this._resetFn) {
            this._resetFn(obj);
        }

        this._pool.push(obj);
    }

    /**
     * 清空对象池
     */
    public clear(): void {
        this._pool = [];
    }

    /**
     * 获取池中对象数量
     */
    public get size(): number {
        return this._pool.length;
    }
}
