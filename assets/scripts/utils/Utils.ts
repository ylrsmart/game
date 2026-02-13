/**
 * 通用工具类
 */

export class Utils {
    /**
     * 生成随机整数 [min, max]
     */
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 生成随机浮点数 [min, max)
     */
    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 从数组中随机选择一个元素
     */
    public static randomChoice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 洗牌算法（Fisher-Yates）
     */
    public static shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * 深度克隆对象
     */
    public static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime()) as unknown as T;
        }
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item)) as unknown as T;
        }
        const cloned = {} as T;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * 限制数值范围
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * 线性插值
     */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
     * 缓动函数（ease-out）
     */
    public static easeOut(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * 格式化数字（添加千位分隔符）
     */
    public static formatNumber(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * 格式化时间戳
     */
    public static formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN');
    }

    /**
     * 格式化持续时间
     */
    public static formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分${secs}秒`;
        } else {
            return `${secs}秒`;
        }
    }

    /**
     * 生成唯一ID
     */
    public static generateId(prefix: string = ''): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * 延迟函数
     */
    public static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 防抖函数
     */
    public static debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout | null = null;
        return (...args: Parameters<T>) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                func(...args);
            }, wait);
        };
    }

    /**
     * 节流函数
     */
    public static throttle<T extends (...args: any[]) => any>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean = false;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    /**
     * 计算百分比
     */
    public static percentage(value: number, total: number): number {
        return total === 0 ? 0 : (value / total) * 100;
    }

    /**
     * 格式化稀有度颜色
     */
    public static getRarityColor(rarity: string): string {
        const colors: Record<string, string> = {
            common: '#b0b0b0',      // 白色
            rare: '#00aaff',         // 蓝色
            epic: '#a335ee',         // 紫色
            legendary: '#ff8000'      // 橙色
        };
        return colors[rarity] || '#ffffff';
    }

    /**
     * 稀有度中文名称
     */
    public static getRarityName(rarity: string): string {
        const names: Record<string, string> = {
            common: '普通',
            rare: '稀有',
            epic: '史诗',
            legendary: '传说'
        };
        return names[rarity] || '未知';
    }

    /**
     * 计算两点距离
     */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * 判断矩形是否相交
     */
    public static rectIntersect(
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number
    ): boolean {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }

    /**
     * 检查点是否在矩形内
     */
    public static pointInRect(
        px: number, py: number,
        rx: number, ry: number, rw: number, rh: number
    ): boolean {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
}
