# Kenney Pixel UI Pack 使用指南

> Kenney UI Pack 使用的是 16x16 tile 图集格式
> 已复制到：`assets/resources/images/ui/`
> 创建日期：2025-02-13

---

## 📊 图集信息

- **文件名**: UIpackSheet_magenta.png（品红色版本）或 UIpackSheet_transparent.png（透明背景版本）
- **Tile 大小**: 16 x 16 像素
- **Tile 间距**: 2 像素
- **License**: CC0（可免费商用）

---

## 🖼️ 图集包含的 UI 元素

根据 Kenney 官方说明，这个图集包含：

### 按钮类型
- 普通按钮（圆角矩形）
- 按下状态（不同颜色）
- 小按钮
- 开关/关闭按钮

### 窗口和面板
- 主窗口背景
- 小面板背景
- 弹窗背景

### 进度条
- 进度条填充
- 进度条背景
- 进度条末端

### 图标
- 设置齿轮图标
- 关闭 X 图标
- 各种状态图标

### 其他 UI 元素
- 文本框背景
- 装饰边框
- 分隔线

---

## 🎯 在 Cocos Creator 中的使用方法

### 方法 1: 创建 Sprite Frame（推荐）⭐

1. **导入图集**
   - 在 Cocos Creator 中，将 `UIpackSheet_magenta.png` 拖入 Assets 面板

2. **创建 Sprite Frame 资源**
   - 在 Assets 面板，右键图集文件
   - 选择 "Create > Sprite Frames"

3. **配置 Sprite Frame**
   - Sprite Frame Type: Auto
   - Pixel X: 16
   - Pixel Y: 16
   - Frame X: 0
   - Frame Y: 0
   - Border X: 2
   - Border Y: 2

4. **生成多个 Frame**
   - 根据图集内容，系统会自动识别并生成多个 Sprite Frame
   - 每个 Frame 代表一个 UI 元素

### 方法 2: 使用 Sprite Frame

1. 在场景中创建一个 Sprite 节点
2. 在 Inspector 中添加 Sprite 组件
3. Sprite 组件 > Sprite Frame 属性 > 选择你需要的 UI 元素
4. 设置 Type: Simple（使用整个 Frame）
   或 Sprite（使用 Frame 的部分区域）

---

## 📝 在代码中使用

### 按钮组件调整

```typescript
// Button.ts 中设置 Sprite Frame
this._background.spriteFrame = this._background?.getComponent(SpriteFrame);

// 或使用 uuid 引用
const spriteFrame = this.getSpriteFrame('ui/button_01');
```

### 查找 Sprite Frame

在 Cocos Creator Assets 面板中，生成的 Sprite Frame 会有类似这样的命名：
- `UIpackSheet_magenta-0`
- `UIpackSheet_magenta-1`
- `UIpackSheet_magenta-2`
- ...

你需要通过预览（Preview.png）或实际使用来确定每个 Frame 对应什么 UI 元素。

---

## 🔍 确定 UI 元素对应关系

由于图集是自动切片生成的，你需要通过以下方式确定：

1. **查看预览图**：`Preview.png`
2. **在 Cocos Creator 中逐个测试 Frame**
3. **参考官方说明**：https://kenney.nl/assets/pixel-ui-pack

### 推荐的 Frame 映射（实际使用时调整）

| Frame ID | UI 元素 | 用途 |
|-----------|---------|------|
| 0-5 | 普通按钮 | 主菜单按钮 |
| 6-10 | 小按钮 | 辅助按钮 |
| 11-13 | 关闭按钮 | 面板关闭 |
| 14-16 | 进度条 | HP/MP/经验条 |
| 17-18 | 窗口背景 | 对话框/面板 |
| 19-20 | 图标 | 设置/关闭/状态 |
| 21+ | 装饰边框 | 面板装饰 |

**注意**：实际 Frame 数量和顺序可能不同，需要测试确定

---

## ✅ 验证步骤

1. 导入图集到 Cocos Creator
2. 创建 Sprite Frames
3. 在场景中测试使用几个 Frame
4. 在代码中引用 Frame 的 uuid

---

## 💡 代码示例

### 创建按钮的 Sprite

```typescript
// 假设 Frame ID 是 0
const buttonFrame = 'UIpackSheet_magenta-0';

// 设置到 Sprite
this._background.spriteFrame = this.getSpriteFrame(buttonFrame);
```

### 动态切换 Sprite Frame

```typescript
private getSpriteFrame(frameId: string): SpriteFrame {
    // 从资源管理器或直接引用
    return resources.get<SpriteFrame>(`ui/${frameId}`);
}
```

---

## 🎯 下一步

1. **下载其他 3 个素材包**：
   - 496 Pixel Art RPG Icons
   - Top Down RPG Characters
   - RPG Tileset

2. **下载完成后复制到对应目录**

3. **在 Cocos Creator 中导入所有素材**

4. **完成时告诉我**

---

## ⚠️ 注意事项

1. **图集是 16x16 + 2px margin**，裁切时注意间距
2. **使用品红色版本（magenta）**或透明背景版本
3. **所有素材都是 CC0 许可证**，可商用
4. **如果需要更精细的 UI，可以使用其他资源**

---

**需要帮助调整代码或使用其他功能时随时告诉我！** 🚀
