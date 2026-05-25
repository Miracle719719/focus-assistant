/* ============================================
   pomodoro.js  -  番茄钟模块 2.0
   新增：专注/休息时间可调，保存到 localStorage
   ============================================ */

// ===== 从 localStorage 读取用户自定义时间（默认 25/5）=====
var workMinutes  = loadData('workMinutes', 25);
var breakMinutes = loadData('breakMinutes', 5);

// ===== 换算成秒 =====
var WORK_TIME   = workMinutes  * 60;
var BREAK_TIME  = breakMinutes * 60;
var RING_LENGTH = 2 * Math.PI * 88;

// ===== 状态 =====
var timer      = null;
var timeLeft   = WORK_TIME;
var totalTime  = WORK_TIME;
var isRunning  = false;
var isWorkMode = true;

// ===== DOM 引用 =====
var timerDisplay      = document.getElementById('timerDisplay');
var timerRing         = document.getElementById('timerRing');
var pomodoroStatus    = document.getElementById('pomodoroStatus');
var pomodoroStatusInline = document.getElementById('pomodoroStatusInline');
var startBtn          = document.getElementById('startBtn');
var pauseBtn          = document.getElementById('pauseBtn');
var resetBtn          = document.getElementById('resetBtn');
var workDisplay       = document.getElementById('workDisplay');
var breakDisplay      = document.getElementById('breakDisplay');
var settingsEl        = document.getElementById('timerSettings');

/**
 * 初始化番茄钟
 */
function initPomodoro() {
  timerRing.style.strokeDasharray = RING_LENGTH;
  updateDisplay();
  updateRing();
  updateStatusText();
  updateButtons();
  updateSettingsDisplay();

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  // 时间调节按钮（事件委托）
  settingsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ts-btn');
    if (!btn) return;

    var target = btn.dataset.target;   // "work" 或 "break"
    var dir    = parseInt(btn.dataset.dir, 10);  // 正数=加，负数=减

    if (target === 'work') {
      var newVal = workMinutes + dir;
      if (newVal < 1)  newVal = 1;
      if (newVal > 120) newVal = 120;
      setWorkTime(newVal);
    } else {
      var newVal = breakMinutes + dir;
      if (newVal < 1)  newVal = 1;
      if (newVal > 60) newVal = 60;
      setBreakTime(newVal);
    }
  });
}

/**
 * 设置专注时间
 */
function setWorkTime(minutes) {
  workMinutes = minutes;
  WORK_TIME = minutes * 60;
  saveData('workMinutes', minutes);
  updateSettingsDisplay();

  // 空闲状态且专注模式下，立即重置倒计时
  if (!isRunning && isWorkMode) {
    timeLeft  = WORK_TIME;
    totalTime = WORK_TIME;
    updateDisplay();
    updateRing();
  }
}

/**
 * 设置休息时间
 */
function setBreakTime(minutes) {
  breakMinutes = minutes;
  BREAK_TIME = minutes * 60;
  saveData('breakMinutes', minutes);
  updateSettingsDisplay();

  if (!isRunning && !isWorkMode) {
    timeLeft  = BREAK_TIME;
    totalTime = BREAK_TIME;
    updateDisplay();
    updateRing();
  }
}

/**
 * 更新设置界面的数字显示
 */
function updateSettingsDisplay() {
  workDisplay.textContent  = workMinutes;
  breakDisplay.textContent = breakMinutes;
}

/**
 * 按钮状态
 */
function updateButtons() {
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
  timerDisplay.classList.toggle('timer__display--running', isRunning);
}

/**
 * 开始倒计时
 */
function startTimer() {
  if (isRunning) return;
  stopAlarm();

  isRunning = true;
  updateStatusText();
  updateButtons();

  timer = setInterval(function () {
    if (timeLeft > 1) playTick();

    timeLeft--;
    updateDisplay();
    updateRing();

    if (timeLeft <= 0) {
      pauseTimer();
      playAlarm();

      if (isWorkMode) {
        // 【专注完成】
        addFocusMinutes(WORK_TIME / 60);
        timeLeft  = BREAK_TIME;
        totalTime = BREAK_TIME;
        isWorkMode = false;
        timerRing.classList.add('timer-ring__progress--break');
        alert('🎉 专注结束！休息 ' + breakMinutes + ' 分钟吧');
      } else {
        // 【休息完成】
        timeLeft  = WORK_TIME;
        totalTime = WORK_TIME;
        isWorkMode = true;
        timerRing.classList.remove('timer-ring__progress--break');
        alert('⏰ 休息结束！开始新的专注');
      }

      updateDisplay();
      updateRing();
      updateStatusText();
    }
  }, 1000);
}

/**
 * 暂停
 */
function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  timer = null;
  updateStatusText();
  updateButtons();
}

/**
 * 重置
 */
function resetTimer() {
  stopAlarm();
  pauseTimer();
  isWorkMode = true;
  timeLeft  = WORK_TIME;
  totalTime = WORK_TIME;
  timerRing.classList.remove('timer-ring__progress--break');
  updateDisplay();
  updateRing();
  updateStatusText();
}

/**
 * 更新数字显示
 */
function updateDisplay() {
  var m = Math.floor(timeLeft / 60);
  var s = timeLeft % 60;
  timerDisplay.textContent =
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0');
}

/**
 * 更新环形进度
 */
function updateRing() {
  var progress = 1 - timeLeft / totalTime;
  timerRing.style.strokeDashoffset = RING_LENGTH * progress;
}

/**
 * 更新状态文字
 */
function updateStatusText() {
  var statusText, inlineText;
  if (isRunning) {
    statusText = isWorkMode ? '专注中' : '休息中';
    inlineText = isWorkMode ? '专注' : '休息';
  } else {
    statusText = isWorkMode ? '准备就绪' : '休息待开始';
    inlineText = isWorkMode ? '专注' : '休息';
  }
  pomodoroStatus.textContent       = statusText;
  pomodoroStatusInline.textContent = inlineText;
}
