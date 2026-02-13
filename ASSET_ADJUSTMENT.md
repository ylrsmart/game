# 素材下载后的处理指南

> 由于资源包的实际文件可能不同，请按以下步骤操作

---

## 📋 实际下载文件处理步骤

### 步骤 1：查看你下载到的文件

解压下载的 ZIP 文件后，查看里面的文件列表。

---

### 步骤 2：复制到你下载的文件

将解压后的文件复制到项目对应目录：

| 你的文件类型 | 复制到 |
|--------------|---------|
| 按钮相关文件 | `assets/resources/images/ui/` |
| 面板/窗口文件 | `assets/resources/images/ui/` |
| 图标文件 | `assets/resources/images/icons/` |
| 带颜色的图片 | 根据内容放入对应目录 |

---

### 步骤 3：调整代码中的引用

代码中引用的路径可以灵活调整，例如：

**之前可能写的**：
```typescript
const bgSprite = 'ui/button_01.png';
```

**实际可以是**：
```typescript
const bgSprite = 'ui/实际文件名.png';
// 或者在 Cocos Creator 中查看 Sprite 的 uuid
```

---

## 📁 目录创建命令

如果下载的文件和我列出的不同，可以先创建目录：

```bash
cd /Users/smartylr/Projects/six-realms-origin

# 复制你实际的文件到对应目录
cp -r 你的下载路径/* assets/resources/images/ui/
cp -r 你的下载路径/* assets/resources/images/icons/
```

---

## ✅ 关键点

1. **文件名不一定要和指南完全一致** - Cocos Creator 导入后会有新的路径
2. **只要文件复制到对应目录即可** - 代码中的引用可以在 Cocos Creator 中调整
3. **优先使用你下载到的实际文件** - 如果没有我列出的某些文件也没关系
4. **告诉我实际下载了哪些文件** - 我可以根据实际情况调整

---

## 🎯 需要我调整代码吗？

请告诉我：
1. 你实际下载到了哪些文件
2. 文件名是什么样的
3. 复制到哪些目录了

**如果需要，我会更新代码中的路径引用！** 🚀
