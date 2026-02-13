/**
 * 宠物系统
 * 负责宠物收集、养成、战斗
 */

import { _decorator, Component } from 'cc';
import { PlayerData, PetData } from '../data/PlayerData';
import { PET_CONFIG, GAME_CONSTANTS } from '../data/GameConfig';
import { EventManager, GameEvents } from '../utils/EventManager';
import { Utils } from '../utils/Utils';

const { ccclass, property } = _decorator;

@ccclass('PetSystem')
export class PetSystem extends Component {
    // 玩家数据引用
    private _playerData: PlayerData | null = null;

    /**
     * 获取玩家所有宠物
     */
    public getAllPets(): PetData[] {
        if (!this._playerData) return [];
        return [
            ...this._playerData!.pets.activePets,
            ...this._playerData!.pets.storagePets
        ];
    }

    /**
     * 获取上阵宠物
     */
    public getActivePets(): PetData[] {
        return this._playerData?.pets.activePets || [];
    }

    /**
     * 获取仓库宠物
     */
    public getStoragePets(): PetData[] {
        return this._playerData?.pets.storagePets || [];
    }

    /**
     * 捕获宠物
     */
    public capturePet(petType: string): boolean {
        if (!this._playerData) return false;

        const config = PET_CONFIG[petType];
        if (!config) {
            console.error(`宠物配置不存在: ${petType}`);
            return false;
        }

        // 检查仓库是否有空位
        const totalPets = this.getAllPets().length;
        const storageCapacity = GAME_CONSTANTS.MAX_INVENTORY_CAPACITY;
        const activeSlots = this._playerData.pets.slots;

        if (totalPets >= storageCapacity) {
            console.error('仓库已满');
            return false;
        }

        // 计算捕获成功率
        const success = Utils.randomInt(1, 100) <= config.captureRate;

        if (!success) {
            console.log('捕获失败');
            return false;
        }

        // 创建新宠物
        const newPet: PetData = {
            id: petType,
            instanceId: Utils.generateId('pet_'),
            type: petType,
            name: config.name,
            level: 1,
            exp: 0,
            rarity: config.rarity,
            stats: { ...config.baseStats },
            skills: [...config.skills],
            affection: 0
        };

        // 添加到仓库
        this._playerData.pets.storagePets.push(newPet);

        EventManager.instance.emit(GameEvents.PET_CAPTURE, newPet);
        console.log(`捕获宠物: ${config.name}`);

        return true;
    }

    /**
     * 上阵宠物
     */
    public setPetActive(instanceId: string): boolean {
        if (!this._playerData) return false;

        const pet = this._playerData.pets.storagePets.find(p => p.instanceId === instanceId);
        if (!pet) {
            console.error('宠物不存在');
            return false;
        }

        // 检查上阵位
        if (this._playerData.pets.activePets.length >= this._playerData.pets.slots) {
            console.error('上阵位已满');
            return false;
        }

        // 移动到上阵列表
        this._playerData.pets.storagePets =
            this._playerData.pets.storagePets.filter(p => p.instanceId !== instanceId);
        this._playerData.pets.activePets.push(pet);

        EventManager.instance.emit(GameEvents.PET_GET, pet);
        return true;
    }

    /**
     * 下阵宠物
     */
    public setPetInactive(instanceId: string): boolean {
        if (!this._playerData) return false;

        const pet = this._playerData.pets.activePets.find(p => p.instanceId === instanceId);
        if (!pet) {
            console.error('宠物不在阵中');
            return false;
        }

        // 移动到仓库
        this._playerData.pets.activePets =
            this._playerData.pets.activePets.filter(p => p.instanceId !== instanceId);
        this._playerData.pets.storagePets.push(pet);

        return true;
    }

    /**
     * 宠物升级
     */
    public levelUpPet(instanceId: string, expAmount: number): boolean {
        if (!this._playerData) return false;

        const pet = this.findPet(instanceId);
        if (!pet) {
            console.error('宠物不存在');
            return false;
        }

        // 增加经验
        pet.exp += expAmount;

        // 检查升级
        let leveled = false;
        const expToNext = this.getExpToNextLevel(pet.level);
        while (pet.exp >= expToNext) {
            pet.exp -= expToNext;
            pet.level++;
            leveled = true;

            // 增加属性
            const config = PET_CONFIG[pet.id];
            if (config) {
                pet.stats.attack += Math.floor(config.baseStats.attack * 0.1);
                pet.stats.defense += Math.floor(config.baseStats.defense * 0.1);
                pet.stats.speed += Math.floor(config.baseStats.speed * 0.1);
            }

            // 升级学会新技能
            this.checkSkillLearn(pet);
        }

        if (leveled) {
            EventManager.instance.emit(GameEvents.PET_LEVEL_UP, pet);
        }

        return true;
    }

    /**
     * 获取升级所需经验
     */
    private getExpToNextLevel(level: number): number {
        return Math.floor(50 * Math.pow(1.3, level - 1));
    }

    /**
     * 检查宠物是否学习新技能
     */
    private checkSkillLearn(pet: PetData): void {
        const config = PET_CONFIG[pet.id];
        if (!config) return;

        // 根据等级学习技能
        const skillLevels = [1, 5, 10, 15, 20]; // 学习等级
        const currentSkillCount = pet.skills.length;

        skillLevels.forEach((level, index) => {
            if (pet.level >= level && index + 1 > currentSkillCount) {
                if (config.skills[index]) {
                    pet.skills.push(config.skills[index]);
                }
            }
        });
    }

    /**
     * 增加好感度
     */
    public addAffection(instanceId: string, amount: number): boolean {
        if (!this._playerData) return false;

        const pet = this.findPet(instanceId);
        if (!pet) return false;

        pet.affection = Math.min(100, pet.affection + amount);

        // 好感度达到100可解锁特殊功能
        if (pet.affection === 100) {
            // TODO: 解锁宠物特殊技能或形态
        }

        return true;
    }

    /**
     * 获取宠物总属性（包含等级加成）
     */
    public getPetStats(pet: PetData): PetData['stats'] {
        const config = PET_CONFIG[pet.id];
        if (!config) {
            return { attack: 0, defense: 0, speed: 0 };
        }

        // 等级加成
        const levelBonus = pet.level - 1;
        const levelMultiplier = 1 + levelBonus * 0.1;

        return {
            attack: Math.floor(config.baseStats.attack * levelMultiplier),
            defense: Math.floor(config.baseStats.defense * levelMultiplier),
            speed: Math.floor(config.baseStats.speed * levelMultiplier)
        };
    }

    /**
     * 释放宠物
     */
    public releasePet(instanceId: string): boolean {
        if (!this._playerData) return false;

        // 从仓库中移除
        const wasInStorage = this._playerData.pets.storagePets.some(p => p.instanceId === instanceId);
        this._playerData.pets.storagePets =
            this._playerData.pets.storagePets.filter(p => p.instanceId !== instanceId);

        // 从阵中移除
        this._playerData.pets.activePets =
            this._playerData.pets.activePets.filter(p => p.instanceId !== instanceId);

        if (wasInStorage) {
            console.log('宠物已释放');
        }

        return true;
    }

    /**
     * 查找宠物
     */
    private findPet(instanceId: string): PetData | undefined {
        return this.getAllPets().find(p => p.instanceId === instanceId);
    }

    /**
     * 扩展宠物槽位
     */
    public expandPetSlots(): boolean {
        if (!this._playerData) return false;

        const maxSlots = 10; // 最大槽位
        if (this._playerData.pets.slots >= maxSlots) {
            console.error('已达到最大槽位');
            return false;
        }

        this._playerData.pets.slots++;
        return true;
    }
}
