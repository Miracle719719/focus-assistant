/* ============================================
   stats.js  -  统计数据模块
   职责：追踪今日专注时间、完成任务数、连续学习天数
   所有数据通过 localStorage 持久化
   ============================================ */

// ===== 数据模型 =====
// 在 localStorage 中保存的结构：
// {
//   date: "2026-5-25",         ← 当前记录的是哪一天
//   focusMinutes: 0,           ← 今日累计专注分钟
//   completedTasks: 0,         ← 今日完成任务数
//   streak: 0,                 ← 当前连续学习天数
//   lastActiveDate: "2026-5-25" ← 最近一次活跃日期
// }
const STATS_KEY = 'focusStats';

// ===== DOM 引用 =====
var todayMinutes   = document.getElementById('todayMinutes');
var completedTasks = document.getElementById('completedTasks');
var streakDays     = document.getElementById('streakDays');

// ===== 当前统计数据（内存中的副本）=====
var statsData = null;

/**
 * 初始化统计模块
 * 1. 从 localStorage 加载数据
 * 2. 检查日期，如果是新的一天则重置
 * 3. 更新页面显示
 */
function initStats() {
  statsData = loadData(STATS_KEY, null);

  // 首次使用，创建默认数据
  if (statsData === null) {
    statsData = createFreshStats();
  }

  // 检查日期：如果今天 != 记录中的日期，重置每日数据
  var today = getTodayStr();
  if (statsData.date !== today) {
    // 把旧数据保留到 lastActiveDate 用于连续天数判断
    resetDailyStats(today);
  }

  updateStatsDisplay();
}

/**
 * 添加专注分钟数
 * 【被 pomodoro.js 调用】
 * @param {number} minutes - 本次专注的分钟数
 */
function addFocusMinutes(minutes) {
  ensureToday();  // 确保是在"今天"的数据上操作

  statsData.focusMinutes += minutes;
  updateStreak();           // 更新连续天数
  saveStats();
  updateStatsDisplay();
}

/**
 * 增加完成任务计数
 * 【被 tasks.js 调用】
 */
function incrementCompletedTasks() {
  ensureToday();
  statsData.completedTasks++;
  updateStreak();
  saveStats();
  updateStatsDisplay();
}

/**
 * 减少完成任务计数（取消勾选时）
 * 【被 tasks.js 调用】
 */
function decrementCompletedTasks() {
  ensureToday();
  if (statsData.completedTasks > 0) {
    statsData.completedTasks--;
  }
  saveStats();
  updateStatsDisplay();
}

/**
 * 更新页面上的统计数字
 */
function updateStatsDisplay() {
  if (statsData === null) return;

  todayMinutes.textContent   = statsData.focusMinutes;
  completedTasks.textContent = statsData.completedTasks;
  streakDays.textContent     = statsData.streak;
}

// ===================== 内部辅助函数 =====================

/**
 * 确保统计数据属于"今天"
 * 如果跨天了，重置每日数据
 *
 * 原理：每次操作时检查日期，
 *       避免跨天时数据遗留问题。
 */
function ensureToday() {
  var today = getTodayStr();
  if (statsData.date !== today) {
    resetDailyStats(today);
  }
}

/**
 * 创建一份全新的统计数据
 */
function createFreshStats() {
  var today = getTodayStr();
  return {
    date: today,
    focusMinutes: 0,
    completedTasks: 0,
    streak: 0,
    lastActiveDate: today
  };
}

/**
 * 重置每日数据（保留连续天数的连续性）
 * @param {string} today - 今天的日期字符串
 */
function resetDailyStats(today) {
  // 检查是否连续：昨天是否活跃过
  var yesterday = getYesterdayStr();
  var wasActiveYesterday = (statsData.lastActiveDate === yesterday);

  // 重置每日数据
  statsData.date = today;
  statsData.focusMinutes = 0;
  statsData.completedTasks = 0;

  // 如果昨天活跃过，保留 streak；否则重置
  if (!wasActiveYesterday) {
    statsData.streak = 0;
  }

  saveStats();
}

/**
 * 更新连续学习天数
 * 规则：
 *   - 如果 lastActiveDate 是昨天 → streak + 1
 *   - 如果 lastActiveDate 是今天 → 不变（今天已算过）
 *   - 如果不是昨天也不是今天 → 从 1 开始
 */
function updateStreak() {
  var today = getTodayStr();
  var yesterday = getYesterdayStr();

  if (statsData.lastActiveDate === yesterday) {
    // 昨天活跃过 → 连续天数 +1
    statsData.streak++;
  } else if (statsData.lastActiveDate !== today) {
    // 中间断开了 → 重新从 1 开始
    statsData.streak = 1;
  }
  // 如果 lastActiveDate === today，说明今天已经更新过，不重复加

  statsData.lastActiveDate = today;
}

/**
 * 保存统计数据到 localStorage
 */
function saveStats() {
  saveData(STATS_KEY, statsData);
}

/**
 * 获取今天的日期字符串（格式：YYYY-M-D）
 * 为什么不补零？因为比较时 "2026-5-25" === "2026-5-25" 更直观
 */
function getTodayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

/**
 * 获取昨天的日期字符串
 */
function getYesterdayStr() {
  var d = new Date();
  d.setDate(d.getDate() - 1);  // 往前推一天
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
