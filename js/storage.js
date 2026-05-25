/* ============================================
   storage.js  -  本地存储模块
   职责：封装 localStorage 的读写操作
   原理：localStorage 是浏览器自带的"小数据库"，
         刷新页面后数据仍然存在。
   注意：用 try-catch 包裹，防止隐私模式或存满时报错
   ============================================ */

// ===== 存储工具函数 =====

/**
 * 保存数据到 localStorage
 * @param {string} key    - 存储的键名
 * @param {any}    value  - 要存储的数据（对象/数组/字符串等）
 *
 * 为什么要 JSON.stringify？
 * localStorage 只能存字符串，所以对象要先转成 JSON 字符串。
 *
 * 为什么要 try-catch？
 * 隐私模式 / 存满 5MB / 用户禁用 cookie 等原因都会让
 * localStorage 报错，捕获后静默失败不会影响页面正常运行。
 */
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // localStorage 不可用或存满时，什么也不做
    console.warn('存储失败：', e.message);
  }
}

/**
 * 从 localStorage 读取数据
 * @param  {string} key        - 键名
 * @param  {any}    defaultVal - 如果没有数据，返回的默认值
 * @return {any}               解析后的数据
 *
 * JSON.parse 把 JSON 字符串变回对象/数组。
 */
function loadData(key, defaultVal = null) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      return defaultVal;        // 还没有这个 key，返回默认值
    }
    return JSON.parse(data);    // 解析 JSON 字符串
  } catch {
    return defaultVal;          // 任何异常都返回默认值
  }
}
