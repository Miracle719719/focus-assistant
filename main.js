/* ============================================
   main.js  -  Electron 主进程
   职责：创建桌面窗口，加载 web 页面
   这是一个标准的 Electron 入口文件
   ============================================ */

// 引入 Electron 模块
const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * 创建主窗口
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 700,          // 窗口宽度
    height: 860,         // 窗口高度
    minWidth: 420,       // 最小宽度（手机布局临界点）
    minHeight: 600,      // 最小高度
    resizable: true,     // 允许调整大小
    title: '专注助手',    // 窗口标题
    backgroundColor: '#f0eff5',  // 背景色，防止白闪
    webPreferences: {
      // 允许在渲染进程中使用 Node.js 特性
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 加载 index.html
  win.loadFile('index.html');

  // 开发时可注释掉这行来打开开发者工具
  // win.webContents.openDevTools();
}

// ===== 应用生命周期 =====

// app.whenReady()：Electron 初始化完成后触发
app.whenReady().then(function () {
  createWindow();

  // macOS 上：点击 dock 图标时重新创建窗口（macOS 习惯）
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
