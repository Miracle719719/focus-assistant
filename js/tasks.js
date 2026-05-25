/* ============================================
   tasks.js  -  任务列表模块（四象限版）
   职责：管理任务 增/删/改 + 四象限优先级
   四象限：q1 立即做 · q2 计划做 · q3 委托做 · q4 减少做
   ============================================ */

// ===== 四象限权重（用于排序）=====
var QUAD_WEIGHT = { q1: 3, q2: 2, q3: 1, q4: 0 };

// ===== 四象限显示信息 =====
var QUAD_INFO = {
  q1: { label: '立即做', cls: 'q1' },
  q2: { label: '计划做', cls: 'q2' },
  q3: { label: '委托做', cls: 'q3' },
  q4: { label: '减少做', cls: 'q4' }
};

// ===== 状态 =====
// 任务对象：{ id, text, done, quadrant }
let tasks = [];

// ===== DOM 引用 =====
var taskInput  = document.getElementById('taskInput');
var addTaskBtn = document.getElementById('addTaskBtn');
var taskList   = document.getElementById('taskList');
var taskCount  = document.getElementById('taskCount');
var quadBtns   = document.querySelectorAll('.quad-btn');

// ===== 当前选中的象限 =====
var selectedQuadrant = 'q1';

/**
 * 初始化任务模块
 */
function initTasks() {
  // 从 localStorage 加载，迁移旧数据
  tasks = loadData('tasks', []).map(function (t) {
    // 兼容旧版 high/medium/low → 转为 q2（计划做）
    if (t.priority && !t.quadrant) {
      if (t.priority === 'high')   t.quadrant = 'q1';
      else if (t.priority === 'medium') t.quadrant = 'q2';
      else if (t.priority === 'low')    t.quadrant = 'q4';
      else t.quadrant = 'q2';
    }
    if (!t.quadrant) t.quadrant = 'q2';
    return t;
  });
  saveData('tasks', tasks);

  renderTasks();

  // 绑定事件
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
  });

  // 四象限按钮点击
  quadBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      quadBtns.forEach(function (b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');
      selectedQuadrant = this.dataset.quadrant;
    });
  });

  // 事件委托：任务列表点击
  taskList.addEventListener('click', function (e) {
    var item = e.target.closest('.task-list__item');
    if (!item) return;
    var id = item.dataset.id;

    if (e.target.classList.contains('task-list__delete')) {
      deleteTask(id);
    } else if (e.target.classList.contains('task-list__checkbox')) {
      toggleTask(id);
    } else if (e.target.classList.contains('task-list__prio-btn')) {
      cycleQuadrant(id);
    }
  });
}

/**
 * 添加任务
 */
function addTask() {
  var text = taskInput.value.trim();
  if (text === '') { taskInput.focus(); return; }

  tasks.push({
    id:       Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    text:     text,
    done:     false,
    quadrant: selectedQuadrant
  });

  saveData('tasks', tasks);
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

/**
 * 删除任务
 */
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveData('tasks', tasks);
  renderTasks();
}

/**
 * 切换完成状态
 */
function toggleTask(id) {
  var task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  var wasDone = task.done;
  task.done = !task.done;

  if (typeof incrementCompletedTasks === 'function') {
    if (!wasDone && task.done) incrementCompletedTasks();
    else if (wasDone && !task.done) decrementCompletedTasks();
  }

  saveData('tasks', tasks);
  renderTasks();
}

/**
 * 循环切换象限：q1 → q2 → q3 → q4 → q1
 */
function cycleQuadrant(id) {
  var task = tasks.find(function (t) { return t.id === id; });
  if (!task || task.done) return;

  var order = ['q1', 'q2', 'q3', 'q4'];
  var idx = order.indexOf(task.quadrant);
  task.quadrant = order[(idx + 1) % 4];

  saveData('tasks', tasks);
  renderTasks();
}

/**
 * 渲染列表
 */
function renderTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML =
      '<li class="task-list__item task-list__item--empty">还没有任务，添加一个吧</li>';
    updateTaskCount();
    return;
  }

  // 排序：q1 → q2 → q3 → q4，同象限未完成在前
  var sorted = [...tasks].sort(function (a, b) {
    if (a.done !== b.done) return a.done - b.done;
    return (QUAD_WEIGHT[b.quadrant] || 0) - (QUAD_WEIGHT[a.quadrant] || 0);
  });

  taskList.innerHTML = sorted.map(function (task) {
    var quad = QUAD_INFO[task.quadrant] || QUAD_INFO.q2;
    var doneClass  = task.done ? 'task-list__text--done' : '';
    var checked    = task.done ? 'checked' : '';
    var itemClass  = 'task-list__item--' + quad.cls;
    if (task.done) itemClass += ' task-list__item--done';

    return (
      '<li class="task-list__item ' + itemClass + '" data-id="' + task.id + '">' +
        '<div class="task-list__left">' +
          '<input type="checkbox" class="task-list__checkbox" ' + checked + '>' +
          '<div class="task-list__content">' +
            '<span class="task-list__text ' + doneClass + '">' +
              escapeHtml(task.text) +
            '</span>' +
            '<button class="task-list__prio-btn task-list__prio--' + quad.cls + '">' +
              quad.label +
            '</button>' +
          '</div>' +
        '</div>' +
        '<button class="task-list__delete" title="删除任务">×</button>' +
      '</li>'
    );
  }).join('');

  updateTaskCount();
}

/**
 * 更新计数
 */
function updateTaskCount() {
  var total = tasks.length;
  var done  = tasks.filter(function (t) { return t.done; }).length;
  taskCount.textContent = done + ' / ' + total;
}

/**
 * HTML 转义
 */
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
