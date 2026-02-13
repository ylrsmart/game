# Cocos Creator 项目设置工作流程

> **你（Manual Operator）** 需要完成标记为 `[Manual]` 的步骤
> **AI Agent Teams** 会自动完成标记为 `[Auto]` 的步骤

---

## 🎯 总体目标

将 `six-realms-origin` 项目成功迁移到 Cocos Creator 3.8.0，并完成基础配置。

---

## 📋 角色分工

| 角色 | 负责人 | 职责 |
|------|--------|------|
| **Manual Operator** | 你 | 图形界面操作、关键决策、结果反馈 |
| **PM Agent** | AI | 协调、任务跟踪、更新状态 |
| **Dev Agent** | AI | 文件迁移、代码生成、自动化 |
| **Config Agent** | AI | 配置文件生成和更新 |

---

## 🚀 工作流程

### 阶段 1：创建新项目

| 步骤 | 类型 | 执行者 | 状态 |
|------|------|--------|------|
| 1.1 | [Auto] | Dev Agent | ✅ 完成 - 已准备项目信息 |
| 1.2 | [Manual] | **你** | ⏳ 待完成 |
| 1.3 | [Manual] | **你** | ⏳ 待完成 |

---

### ✅ 步骤 1.1: [Auto] Dev Agent 已准备完毕

Dev Agent 已确认：
- 目标路径：`/Users/smartylr/Projects/six-realms-origin-v2`
- 引擎版本：Cocos Creator 3.8.0
- 项目模板：Empty (3D)

---

### ⏳ 步骤 1.2: [Manual] 你需要操作

**操作：**

1. 打开 Cocos Creator 3.8.0

2. 在启动界面点击 **New Project**

3. 选择 **Empty (3D)** 模板

4. 设置项目名称和路径：
   - Project Name: `six-realms-origin-v2`
   - Location: `/Users/smartylr/Projects/six-realms-origin-v2`

5. 点击 **Create**

6. 等待项目创建完成（进度条加载）

7. 确认能正常看到空项目的界面

---

### 📢 反馈结果

完成上述步骤后，告诉我：

- ✅ **成功**：项目成功创建，能正常打开
- ❌ **失败**：遇到了什么错误（截图或描述错误信息）

---

## ⏭️ 接下来

根据你的反馈：
- **成功** → Dev Agent 将自动迁移所有文件
- **失败** → PM Agent 分析问题并提供解决方案

---

---

*本文档由 PM Agent 生成 | 状态：等待你的反馈*
