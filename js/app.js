/* ============================================
   app.js  -  应用入口
   职责：页面加载时初始化所有模块
   ============================================ */

/**
 * 显示今天日期
 */
function displayToday() {
  var now = new Date();
  var dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  document.getElementById('currentDate').textContent = dateStr;
}

/**
 * 主题切换逻辑
 * 把主题偏好存到 localStorage，刷新后保留
 */
function initTheme() {
  var saved = loadData('theme', 'light');
  applyTheme(saved);

  document.getElementById('themeToggle').addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = (current === 'dark') ? 'light' : 'dark';
    applyTheme(next);
    saveData('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * 入口
 */
function initApp() {
  displayToday();
  initTheme();      // 主题先加载（影响所有元素颜色）
  initStats();
  initTasks();
  initPomodoro();
}

document.addEventListener('DOMContentLoaded', initApp);
