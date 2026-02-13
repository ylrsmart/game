# 素材下载和整理指南

> 本指南详细说明如何下载游戏所需的素材并整理到项目中
> 目标版本：Cocos Creator 4.7, 4.6

---

## 📦 优先级 P0 核心素材（必先下载）

### 1. Kenney Pixel UI Pack ⭐⭐⭐

**下载链接**: https://kenney.nl/assets/pixel-ui-pack

**下载步骤**：
1. 访问上述链接
2. 点击蓝色 "Download" 按钮
3. 下载后解压（ZIP 文件）
4. 将以下文件复制到项目中：
   ```
   assets/resources/images/ui/
   ```

**需要的文件**：
```
button_*.png           # 各种按钮
panel_*.png            # 面板背景
window_*.png           # 弹窗
bar_*.png              # 进度条
icon_settings.png       # 设置图标
icon_close.png          # 关闭图标
```

---

### 2. 496 Pixel Art RPG Icons ⭐⭐⭐

**下载链接**: https://opengameart.org/content/496-pixel-art-icons-for-medievalfantasy-rpg

**下载步骤**：
1. 访问链接
2. 找到并下载完整的 ZIP 包
3. 解压到临时文件夹
4. 将图标文件复制到：
   ```
   assets/resources/images/icons/
   ```

**需要的文件**：
```
weapon_*.png           # 武器图标
armor_*.png            # 护甲图标
helmet_*.png           # 头盔图标
potion_*.png           # 药水图标
scroll.png              # 卷轴（技能书）
key.png                # 钥匙
chest.png              # 宝箱
food_*.png             # 食物
```

**图标分类建议**：
```
assets/resources/images/icons/
├── weapons/     # 武器
├── armor/       # 护甲
├── helmets/      # 头盔
├── accessories/   # 饰品
├── potions/     # 消耗品
├── materials/   # 材料
├── quest/       # 任务物品
└── system/      # 系统图标
```

---

### 3. Top Down RPG Characters ⭐⭐⭐

**下载链接**: https://opengameart.org/content/top-down-rpg-pixel-art

**下载步骤**：
1. 访问链接
2. 找到角色资源包（可能有多个）
3. 下载并解压
4. 复制到：
   ```
   assets/resources/images/characters/
   ```

**需要的文件结构**：
```
assets/resources/images/characters/
├── hero/                    # 主角
│   ├── idle/              # 待机动画（上下左右）
│   ├── walk/              # 行走动画（上下左右）
│   ├── attack/            # 攻击动画
│   ├── hurt/              # 受伤动画
│   └── skill/             # 技能释放动画
├── enemies/                 # 敌人
│   ├── slime/             # 史莱姆
│   │   ├── idle/
│   │   ├── move/
│   │   └── attack/
│   ├── wolf/              # 雪狼
│   │   ├── idle/
│   │   ├── move/
│   │   └── attack/
│   ├── goblin/            # 哥布林
│   └── boss/             # Boss
└── pets/                    # 宠物
    ├── slime/
    ├── wolf/
    └── dragon/
```

**动画帧命名规范**：
```
idle_down_01.png
idle_down_02.png
walk_down_01.png
walk_down_02.png
walk_down_03.png
attack_01.png
attack_02.png
```

---

### 4. RPG Tileset ⭐⭐⭐

**下载链接**: https://opengameart.org/content/stunning-pixel-art-rpg-tileset

**下载步骤**：
1. 访问链接
2. 下载 ZIP 包
3. 解压
4. 复制到：
   ```
   assets/resources/images/tiles/
   ```

**需要的文件结构**：
```
assets/resources/images/tiles/
├── terrain/            # 地形
│   ├── grass_01.png
│   ├── grass_02.png
│   ├── dirt_01.png
│   ├── dirt_02.png
│   ├── water_01.png
│   └── water_02.png
├── walls/               # 墙壁
│   ├── wall_stone_01.png
│   ├── wall_brick_01.png
│   └── wall_wood_01.png
├── floors/              # 地板
│   ├── floor_stone_01.png
│   └── floor_wood_01.png
├── decorations/         # 装饰物
│   ├── tree_01.png
│   ├── tree_02.png
│   ├── tree_03.png
│   ├── rock_01.png
│   ├── rock_02.png
│   ├── bush_01.png
│   └── flower_01.png
└── objects/            # 物体
    ├── chest_closed.png
    ├── chest_open.png
    ├── door_01.png
    ├── door_02.png
    └── portal.png
```

---

## 📋 次优先级 P1 扩展素材（可选，建议后期添加）

### Kenney Dungeon Kit
**链接**: https://kenney.nl/assets/modular-dungeon-kit
**用途**: 地牢场景素材

### Kenney Character Pack
**链接**: https://kenney.nl/assets/character-pack
**用途**: 更多角色素材

### Modular Platformer Pack
**链接**: https://kenney.nl/assets/platformer-kit
**用途**: 平台跳跃素材（如果有跳跃地图）

---

## 🗂️ 文件整理步骤

### 步骤 1: 创建目录

在项目目录下执行：
```bash
cd /Users/smartylr/Projects/six-realms-origin

# 创建所有必需的目录
mkdir -p assets/resources/images/ui
mkdir -p assets/resources/images/icons/weapons
mkdir -p assets/resources/images/icons/armor
mkdir -p assets/resources/images/icons/helmets
mkdir -p assets/resources/images/icons/accessories
mkdir -p assets/resources/images/icons/potions
mkdir -p assets/resources/images/icons/materials
mkdir -p assets/resources/images/icons/quest
mkdir -p assets/resources/images/icons/system

mkdir -p assets/resources/images/characters/hero/{idle,walk,attack,hurt,skill}
mkdir -p assets/resources/images/characters/enemies/{slime,wolf,goblin,boss}
mkdir -p assets/resources/images/characters/pets

mkdir -p assets/resources/images/tiles/{terrain,walls,floors,decorations,objects}
```

### 步骤 2: 复制素材

从下载的文件夹中复制对应文件到上述目录。

### 步骤 3: 验证整理

```bash
# 检查文件是否复制成功
find assets/resources/images -type f -name "*.png" | wc -l
```

预期应该有 **100-200** 个 PNG 文件。

---

## 📱 Cocos Creator 中导入素材

### 导入步骤

1. **打开 Cocos Creator**
   - 双击 Cocos Creator 应用

2. **打开项目**
   - File > Open Project
   - 选择 `/Users/smartylr/Projects/six-realms-origin`

3. **导入图片资源**
   - 在 Assets 面板中，右键 `resources/images/`
   - 选择 "Create in the Assets panel"
   - 或直接将文件夹拖入 Assets 面板

4. **验证导入**
   - 查看 Assets 面板，确保所有图片都已导入
   - 点击图片可以预览

### 导入后操作

1. **设置图片属性**
   - 选中图片 > Inspector > Sprite 组件
   - Type: Sprite Frame 或 Normal
   - 如果是动画：Sprite Frame
   - Packable: 勾选（如果多个小图）

2. **创建 Atlas（图集）- 可选但推荐
   - 右键多个图片 > Create > Sprite Atlas
   - 这样可以优化渲染性能

---

## ✅ 完成检查清单

下载和整理完成后，检查以下项：

- [ ] UI 图片已复制到 `assets/resources/images/ui/`
- [ ] 图标已复制到 `assets/resources/images/icons/` 及子目录
- [ ] 角色图片已复制到 `assets/resources/images/characters/` 及子目录
- [ ] 地图瓦片已复制到 `assets/resources/images/tiles/` 及子目录
- [ ] 总图片数至少 100 个
- [ ] 所有文件都是 PNG 格式
- [ ] 文件名清晰，没有特殊字符
- [ ] 在 Cocos Creator 中可以成功导入

---

## 🔧 后续配置

素材导入 Cocos Creator 后，需要在以下地方使用：

| 用途 | 代码中的引用 | Cocos 资源路径 |
|--------|--------------|----------------|
| UI 按钮 | `assets/resources/images/ui/button_01.png` | `ui/button_01` |
| 技能图标 | `assets/resources/images/icons/skill_01.png` | `icons/skill_01` |
| 角色精灵 | `assets/resources/images/characters/hero/walk_down_01.png` | `characters/hero/walk_down_01` |
| 地图瓦片 | `assets/resources/images/tiles/terrain/grass_01.png` | `tiles/grass_01` |

---

## 🎯 下载建议

1. **一次下载一个包**，完成后再下载下一个
2. **使用解压软件** 如 7-Zip 或 WinRAR
3. **保持原始文件名**，方便后续更新
4. **记录来源**，方便查找和更新

---

## ⚠️ 常见问题

**Q: Cocos Creator 无法识别图片？**
A: 检查文件格式（必须是 PNG/JPG），确保文件名无特殊字符

**Q: 图片显示模糊？**
A: 在 Cocos Creator Inspector 中设置正确的 Filter Mode

**Q: 动画不播放？**
A: 检查 Sprite Frame 设置，确保帧顺序正确

---

## 📞 技术支持

**Cocos Creator 文档**: https://docs.cocos.com/creator/3.8/

**项目 Discord**: 如遇到问题，记录到 ISSUES.md 并告知

---

**完成时间**: 预计 30-60 分钟（下载 + 整理）

**完成后请通知我，我会继续下一步！** 🚀
