# 六界：起源 (Six Realms: Origin)

## 游戏信息

- **游戏类型**: 2D像素风 RPG
- **平台**: 微信小程序
- **引擎**: Cocos Creator 3.8+
- **时长**: 约5小时短篇

## 世界观设定

六界传说 - 人界、灵界、仙界、魔界、混沌界、神界

### 本代（单人版）
- 玩家扮演"天选之子"觉醒
- 净化人界的黑暗
- 初步揭示六界秘密
- 结局：打开通往其他世界的门

### 核心玩法
- 🏠 家园建造 - 建设自己的基地
- 🐾 宠物系统 - 招募升级伙伴
- ⚔️ 战斗成长 - 打怪升级、装备技能
- 🔍 探索解谜 - 随机地图、发现秘密
- 🏆 成就收集 - 各种成就和收集任务

## 项目结构

```
six-realms-origin/
├── .git/                      # Git 仓库
├── .gitignore                 # Git 忽略配置
├── README.md                  # 本文件 - 项目说明
├── ASSETS_GUIDE.md           # 素材下载指南 ⭐
├── DEVELOPMENT_SUMMARY.md     # 技术总结
├── DEVELOPMENT_PLAN.md         # 完整开发计划 ⭐
├── PROGRESS.md                # 每日进度记录 ⭐
├── project.json              # Cocos 项目配置
├── settings/                 # 项目设置
└── assets/                   # 资源目录
    └── scripts/              # 游戏脚本 ⭐
        ├── components/      # UI 组件 (1 个)
        ├── managers/        # 管理器 (4 个)
        ├── data/            # 数据结构 (2 个)
        ├── systems/         # 游戏系统 (6 个)
        ├── utils/           # 工具类 (3 个)
        └── scenes/          # 场景基类 (1 个)
```

## 开发进度

- [x] 创建项目结构
- [x] 获取像素风素材
- [x] 设计数据架构
- [x] 实现游戏框架
- [x] 角色和战斗系统
- [x] 宠物和建造系统
- [x] 探索和地图生成
- [x] 成就和任务系统

**核心系统完成度**：100% ✅
**代码文件数**：17 个脚本文件
**代码总行数**：5569 行

## IP可扩展性

本代设计为IP系列的开端，支持未来扩展：
- 第二代：联机版（灵界、仙界开放）
- 第三代：MMO版（六界完全开放）

数据结构已预留联机接口：
- 宠物交易支持（instanceId）
- 建筑共建支持
- 成就排行榜支持
- 云存储接口（云函数预留）

## 许可证

本游戏使用免费素材开发，遵循相关素材许可证。

## 快速开始

### 查看开发计划
```bash
cat DEVELOPMENT_PLAN.md
```

### 查看每日进度
```bash
cat PROGRESS.md
```

### 查看技术总结
```bash
cat DEVELOPMENT_SUMMARY.md
```

### 查看素材指南
```bash
cat ASSETS_GUIDE.md
```

### Git 操作
```bash
# 查看状态
git status

# 提交更改
git add .
git commit -m "feat: 描述内容"

# 推送到 GitHub
git push origin master
```

## 在线仓库

- **GitHub**: https://github.com/ylrsmart/game
- **当前分支**: master
- **远程**: origin/master

## 项目文档

| 文档 | 说明 | 优先级 |
|------|--------|--------|
| DEVELOPMENT_PLAN.md | 完整开发计划（6 阶段）| ⭐⭐⭐ 最高 |
| PROGRESS.md | 每日进度记录 | ⭐⭐⭐ 最高 |
| ASSETS_GUIDE.md | 免费素材下载指南 | ⭐⭐ 高 |
| DEVELOPMENT_SUMMARY.md | 技术架构总结 | ⭐ 高 |
| README.md | 项目说明（本文件）| ⭐ 中 |

## 开发资源

- [Cocos Creator 文档](https://docs.cocos.com/creator/3.8/manual/zh/)
- [Cocos Creator API](https://docs.cocos.com/creator/3.8/api/zh/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [微信小游戏文档](https://developers.weixin.qq.com/minigame/dev/guide/framework/quick-start.html)

## 当前状态

**阶段**：准备阶段完成，等待进入 UI 开发阶段

**进度**：
```
核心系统代码 ███████████████████ 100%
UI 界面制作 ░░░░░░░░░░░░░░░░ 0%
游戏场景搭建 ░░░░░░░░░░░░░░░░░ 0%
系统整合测试 ░░░░░░░░░░░░░░░░░ 0%
```

---

**项目创建日期**: 2025-02-13
**最后更新**: 2025-02-13
