# 🎯 专注助手

> **四象限番茄钟 · 时间管理桌面工具**  
> macOS / Windows / Android 全平台支持

一个轻量的时间管理与专注工具，采用**四象限法则**规划任务优先级，配合**番茄工作法**提升专注力。纯前端开发，无需服务器。

---

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 📋 **四象限任务** | 重要紧急 / 重要不紧急 / 紧急不重要 / 不紧急不重要，四色标识 |
| 🍅 **番茄钟** | 专注倒计时 + 环形进度条，专注/休息时间可自定义 |
| 🔊 **声音提醒** | 走表滴答声 + 闹钟响铃（Web Audio 实时合成） |
| 📊 **学习统计** | 今日专注时间 / 完成任务数 / 连续学习天数 |
| 🌙 **深色模式** | 一键切换，自动记住偏好 |
| 💾 **本地存储** | 所有数据保存在浏览器，刷新不丢失 |

## 🖼 截图

| 浅色模式 | 深色模式 |
|---------|---------|
| ![light](https://via.placeholder.com/320x480/e8e6f0/1a1a2e?text=浅色模式) | ![dark](https://via.placeholder.com/320x480/1a1932/e8e6f0?text=深色模式) |

## 🚀 快速开始

### 下载安装包

从 [Releases](https://github.com/Miracle719719/focus-assistant/releases) 页面下载对应平台的安装包：

| 平台 | 文件 |
|------|------|
| macOS Intel | `专注助手-1.0.0.dmg` |
| macOS M芯片 | `专注助手-1.0.0-arm64.dmg` |
| Windows | `专注助手 Setup 1.0.0.exe` |
| Android | `专注助手-v1.0.0.apk` |

### 从源码运行

```bash
git clone https://github.com/Miracle719719/focus-assistant.git
cd focus-assistant

# 桌面版（需要 Node.js）
npm install
npm start

# Android 版（需要 Node.js + Android SDK）
npm install
npm run cap:android
```

## 🏗 项目结构

```
focus-assistant/
├── index.html              # 主页面
├── main.js                 # Electron 桌面入口
├── package.json            # 项目配置 + 打包脚本
├── capacitor.config.json   # Android 打包配置
├── css/
│   └── style.css           # 全部样式（深色/浅色 + 响应式）
├── js/
│   ├── app.js              # 入口，初始化所有模块
│   ├── tasks.js            # 四象限任务管理
│   ├── pomodoro.js         # 番茄钟 + 时间设置
│   ├── stats.js            # 学习统计
│   ├── storage.js          # localStorage 封装
│   └── sound.js            # 声音系统（滴答 + 闹铃）
├── android/                # Android 原生项目
└── dist/                   # 打包好的安装包（本地生成）
```

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| HTML + CSS + JavaScript | 纯原生开发，零框架依赖 |
| Electron | macOS / Windows 桌面包装 |
| Capacitor | Android 原生包装 |
| Web Audio API | 实时合成提示音 |
| localStorage | 本地数据持久化 |
| SVG | 环形进度条、图标 |

## 📦 打包自己的安装包

```bash
# macOS
npm run build:mac

# Windows（macOS 上也能交叉编译）
npm run build:win

# Android（需要 Android SDK）
npm run cap:android
```

## 📄 许可

MIT

---

*专注助手 · 让每一分钟都有价值*
