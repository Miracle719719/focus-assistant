/* ============================================
   sound.js  -  声音系统
   职责：走表滴答声 + 闹钟响铃声
   原理：Web Audio API 实时生成，无需音频文件
   ============================================ */

// ===== 滴答声（每秒钟走表）=====
// 非常短促轻柔，像真实时钟的滴答
function playTick() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 1200;   // 清脆的高频
    gain.gain.setValueAtTime(0.04, ctx.currentTime);           // 极轻
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);  // 只有 0.03 秒
  } catch (e) {
    // 不支持音频就静默
  }
}

// ===== 闹铃声（倒计时结束响铃）=====
var alarmTimer = null;   // setInterval 句柄，用于停止闹铃

/**
 * 开始响铃
 * 模式：嘀 ~ 嘀 ~ 嘀 ~（800Hz ↔ 1000Hz 交替，模拟真实闹钟）
 * 默认响 12 次（约 8 秒）后自动停止
 */
function playAlarm() {
  var count = 0;
  var maxBeeps = 12;

  function beep() {
    if (count >= maxBeeps) {
      stopAlarm();
      return;
    }
    count++;

    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // 交替频率听起来像 "叮咚 ~ 叮咚"
      osc.frequency.value = count % 2 === 0 ? 1000 : 800;
      // 方波更响亮，更像闹钟
      osc.type = 'square';
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // 静默
    }
  }

  beep();
  alarmTimer = setInterval(beep, 650);  // 每 0.65 秒响一次
}

/**
 * 停止闹铃
 */
function stopAlarm() {
  if (alarmTimer !== null) {
    clearInterval(alarmTimer);
    alarmTimer = null;
  }
}
