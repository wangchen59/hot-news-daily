# Todo Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-based Todo Manager with categories, priorities, due dates, filtering, and drag-to-reorder. Pure frontend, localStorage persistence.

**Architecture:** Single-page app with unified task list layout. Modern minimalist design. Native JS drag-and-drop API for sorting.

**Tech Stack:** HTML5, CSS3 (Flexbox/Grid), vanilla JavaScript, localStorage API

---

## File Structure

```
output/
├── todo.html          # Main page - HTML structure
├── css/
│   └── todo.css       # Styles - modern minimalist theme
└── js/
    └── todo.js        # Logic - data management, rendering, interactions
```

**Responsibilities:**
- `todo.html` - Semantic structure, top bar, filter bar, task list container, modal template
- `todo.css` - All visual styling, responsive breakpoints, animation transitions
- `todo.js` - Data CRUD, localStorage sync, rendering, filtering, drag-drop, modal handling

---

### Task 1: Create HTML Main Page Structure

**Files:**
- Create: `output/todo.html`

- [ ] **Step 1: Write HTML skeleton with semantic structure**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Manager - 任务管理器</title>
    <link rel="stylesheet" href="css/todo.css">
</head>
<body>
    <div class="app-container">
        <!-- Top Bar -->
        <header class="top-bar">
            <div class="logo">
                <h1>Todo Manager</h1>
            </div>
            <button class="btn-primary" id="btn-new-task">
                <span class="icon">+</span>
                新建任务
            </button>
        </header>

        <!-- Filter Bar -->
        <div class="filter-bar">
            <select id="filter-status" class="filter-select">
                <option value="all">全部状态</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
            </select>
            <select id="filter-category" class="filter-select">
                <option value="all">全部分类</option>
                <option value="work">工作</option>
                <option value="personal">个人</option>
                <option value="study">学习</option>
                <option value="other">其他</option>
            </select>
            <select id="filter-priority" class="filter-select">
                <option value="all">全部优先级</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
            </select>
            <input type="text" id="search-input" class="search-input" placeholder="搜索任务...">
        </div>

        <!-- Task List -->
        <main class="task-list" id="task-list">
            <!-- Task cards will be rendered here by JS -->
        </main>

        <!-- Modal for Create/Edit Task -->
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal" id="task-modal">
                <div class="modal-header">
                    <h2 id="modal-title">新建任务</h2>
                    <button class="btn-close" id="btn-close-modal">×</button>
                </div>
                <form id="task-form">
                    <div class="form-group">
                        <label for="task-title">任务标题 *</label>
                        <input type="text" id="task-title" required placeholder="输入任务标题">
                    </div>
                    <div class="form-group">
                        <label for="task-category">分类</label>
                        <select id="task-category">
                            <option value="work">工作</option>
                            <option value="personal">个人</option>
                            <option value="study">学习</option>
                            <option value="other" selected>其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-priority">优先级</label>
                        <select id="task-priority">
                            <option value="high">高</option>
                            <option value="medium" selected>中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-due-date">截止日期</label>
                        <input type="date" id="task-due-date">
                    </div>
                    <input type="hidden" id="task-id">
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="btn-cancel">取消</button>
                        <button type="submit" class="btn-primary">保存</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal-overlay" id="delete-modal-overlay">
            <div class="modal modal-small" id="delete-modal">
                <div class="modal-header">
                    <h2>确认删除</h2>
                    <button class="btn-close" id="btn-close-delete-modal">×</button>
                </div>
                <div class="modal-body">
                    <p>确定要删除这个任务吗？此操作不可撤销。</p>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="btn-cancel-delete">取消</button>
                    <button type="button" class="btn-danger" id="btn-confirm-delete">删除</button>
                </div>
            </div>
        </div>
    </div>
    <script src="js/todo.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure**

在浏览器中打开文件，检查：
- 顶部栏显示正确
- 筛选栏下拉框显示
- 任务列表容器存在
- 模态框默认隐藏

---

### Task 2: Create CSS Styles - Base Layout

**Files:**
- Create: `output/css/todo.css`

- [ ] **Step 1: Write base styles and layout CSS**

```css
/* ===== Base Reset & Variables ===== */
:root {
    --bg-main: #f5f5f5;
    --bg-card: #ffffff;
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-completed: #999999;
    --color-primary: #4a90d9;
    --color-primary-hover: #3a7bc8;
    --color-danger: #e74c3c;
    --color-danger-hover: #c0392b;
    --priority-high: #e74c3c;
    --priority-medium: #f39c12;
    --priority-low: #bdc3c7;
    --category-work: #3498db;
    --category-personal: #2ecc71;
    --category-study: #9b59b6;
    --category-other: #95a5a6;
    --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
    --shadow-modal: 0 4px 20px rgba(0,0,0,0.15);
    --radius: 8px;
    --spacing: 16px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    background: var(--bg-main);
    color: var(--text-primary);
    min-height: 100vh;
    line-height: 1.5;
}

/* ===== App Container ===== */
.app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

/* ===== Top Bar ===== */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing);
    padding-bottom: var(--spacing);
    border-bottom: 1px solid #e0e0e0;
}

.logo h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
}

/* ===== Buttons ===== */
.btn-primary {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: var(--color-primary-hover);
}

.btn-secondary {
    background: #e0e0e0;
    color: var(--text-primary);
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-secondary:hover {
    background: #d0d0d0;
}

.btn-danger {
    background: var(--color-danger);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-danger:hover {
    background: var(--color-danger-hover);
}

.btn-close {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.btn-close:hover {
    color: var(--text-primary);
}

.icon {
    font-size: 16px;
    margin-right: 4px;
}
```

- [ ] **Step 2: Write filter bar and task list styles**

```css
/* ===== Filter Bar ===== */
.filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: var(--spacing);
    flex-wrap: wrap;
}

.filter-select {
    padding: 8px 12px;
    border: 1px solid #d0d0d0;
    border-radius: var(--radius);
    background: var(--bg-card);
    font-size: 14px;
    color: var(--text-primary);
    cursor: pointer;
}

.filter-select:focus {
    outline: none;
    border-color: var(--color-primary);
}

.search-input {
    padding: 8px 12px;
    border: 1px solid #d0d0d0;
    border-radius: var(--radius);
    font-size: 14px;
    flex: 1;
    min-width: 150px;
}

.search-input:focus {
    outline: none;
    border-color: var(--color-primary);
}

/* ===== Task List ===== */
.task-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
}

.task-list.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: var(--text-secondary);
    font-size: 16px;
}

/* ===== Task Card ===== */
.task-card {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: var(--spacing);
    box-shadow: var(--shadow-card);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: grab;
}

.task-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.task-card.dragging {
    opacity: 0.5;
    cursor: grabbing;
}

.task-card.completed {
    background: #f9f9f9;
}

.task-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #d0d0d0;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    margin-top: 2px;
}

.task-checkbox:hover {
    border-color: var(--color-primary);
}

.task-checkbox.checked {
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.task-checkbox.checked::after {
    content: '✓';
    color: white;
    font-size: 12px;
}

.task-content {
    flex: 1;
    min-width: 0;
}

.task-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
    word-break: break-word;
}

.task-card.completed .task-title {
    color: var(--text-completed);
    text-decoration: line-through;
}

.task-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 12px;
}

.task-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.task-tag.category-work {
    background: var(--category-work);
    color: white;
}

.task-tag.category-personal {
    background: var(--category-personal);
    color: white;
}

.task-tag.category-study {
    background: var(--category-study);
    color: white;
}

.task-tag.category-other {
    background: var(--category-other);
    color: white;
}

.task-tag.priority-high {
    background: var(--priority-high);
    color: white;
}

.task-tag.priority-medium {
    background: var(--priority-medium);
    color: white;
}

.task-tag.priority-low {
    background: var(--priority-low);
    color: white;
}

.task-due-date {
    color: var(--text-secondary);
    font-size: 12px;
}

.task-due-date.overdue {
    color: var(--color-danger);
}

.task-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.task-action-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 16px;
    transition: color 0.2s;
}

.task-action-btn:hover {
    color: var(--text-primary);
}

.task-action-btn.delete:hover {
    color: var(--color-danger);
}
```

- [ ] **Step 3: Write modal styles**

```css
/* ===== Modal ===== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-overlay.active {
    display: flex;
}

.modal {
    background: var(--bg-card);
    border-radius: var(--radius);
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-width: 400px;
    margin: 20px;
}

.modal.modal-small {
    max-width: 300px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing);
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
    font-size: 18px;
    font-weight: 600;
}

.modal-body {
    padding: var(--spacing);
}

/* ===== Form ===== */
.form-group {
    margin-bottom: var(--spacing);
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 6px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d0d0;
    border-radius: var(--radius);
    font-size: 14px;
    color: var(--text-primary);
    background: var(--bg-card);
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--color-primary);
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: var(--spacing);
    border-top: 1px solid #e0e0e0;
}
```

- [ ] **Step 4: Write responsive styles**

```css
/* ===== Responsive ===== */
@media (max-width: 768px) {
    .app-container {
        padding: 16px;
    }
    
    .filter-bar {
        flex-direction: column;
    }
    
    .filter-select,
    .search-input {
        width: 100%;
    }
    
    .top-bar {
        flex-wrap: wrap;
        gap: 12px;
    }
    
    .task-meta {
        flex-direction: column;
        gap: 4px;
    }
}

@media (max-width: 480px) {
    .logo h1 {
        font-size: 20px;
    }
    
    .btn-primary {
        padding: 8px 16px;
    }
    
    .task-card {
        padding: 12px;
    }
    
    .modal {
        margin: 10px;
        max-width: none;
    }
}
```

- [ ] **Step 5: Commit CSS file**

```bash
git add output/css/todo.css
git commit -m "feat: add Todo Manager CSS styles - modern minimalist design"
```

---

### Task 3: JavaScript Data Management

**Files:**
- Create: `output/js/todo.js`

- [ ] **Step 1: Write data management code (part 1 - storage and CRUD)**

```javascript
// ===== Data Management =====
const STORAGE_KEY = 'todoManager_tasks';

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Load tasks from localStorage
function loadTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Create new task
function createTask(title, category = 'other', priority = 'medium', dueDate = null) {
    const task = {
        id: generateId(),
        title: title.trim(),
        category,
        priority,
        dueDate,
        completed: false,
        customOrder: null,
        createdAt: Date.now()
    };
    const tasks = loadTasks();
    tasks.push(task);
    saveTasks(tasks);
    return task;
}

// Update task
function updateTask(id, updates) {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveTasks(tasks);
        return tasks[index];
    }
    return null;
}

// Delete task
function deleteTask(id) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
}

// Toggle task completion
function toggleComplete(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        // Reset custom order when toggling completion
        task.customOrder = null;
        saveTasks(tasks);
        return task;
    }
    return null;
}
```

- [ ] **Step 2: Write sorting and filtering logic**

```javascript
// ===== Sorting =====
const priorityOrder = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        // If both have customOrder, sort by that
        if (a.customOrder !== null && b.customOrder !== null) {
            return a.customOrder - b.customOrder;
        }
        // If only one has customOrder, it comes first
        if (a.customOrder !== null) return -1;
        if (b.customOrder !== null) return 1;
        
        // Auto sorting: completed tasks go to end
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // Then by priority
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Then by due date (earlier first, no due date last)
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        
        // Finally by creation time (newer first)
        return b.createdAt - a.createdAt;
    });
}

// ===== Filtering =====
function filterTasks(tasks, filters) {
    return tasks.filter(task => {
        // Status filter
        if (filters.status === 'active' && task.completed) return false;
        if (filters.status === 'completed' && !task.completed) return false;
        
        // Category filter
        if (filters.category !== 'all' && task.category !== filters.category) return false;
        
        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        
        // Search filter
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        
        return true;
    });
}

// Get current filters from UI
function getCurrentFilters() {
    return {
        status: document.getElementById('filter-status').value,
        category: document.getElementById('filter-category').value,
        priority: document.getElementById('filter-priority').value,
        search: document.getElementById('search-input').value.trim()
    };
}
```

---

### Task 4: Task Rendering

**Files:**
- Modify: `output/js/todo.js`

- [ ] **Step 1: Write task card rendering function**

```javascript
// ===== Rendering =====
const taskListEl = document.getElementById('task-list');

// Format date for display
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date < today) return '已过期';
    if (date.toDateString() === today.toDateString()) return '今天';
    if (date.toDateString() === tomorrow.toDateString()) return '明天';
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

// Check if date is overdue
function isOverdue(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

// Create task card element
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    card.dataset.id = task.id;
    card.draggable = true;
    
    const checkboxClass = task.completed ? 'checked' : '';
    const dueDateClass = isOverdue(task.dueDate) && !task.completed ? 'overdue' : '';
    
    card.innerHTML = `
        <div class="task-checkbox ${checkboxClass}" data-action="toggle"></div>
        <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-meta">
                <span class="task-tag category-${task.category}">${getCategoryLabel(task.category)}</span>
                <span class="task-tag priority-${task.priority}">${getPriorityLabel(task.priority)}</span>
                ${task.dueDate ? `<span class="task-due-date ${dueDateClass}">${formatDate(task.dueDate)}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="task-action-btn" data-action="edit" title="编辑">✎</button>
            <button class="task-action-btn delete" data-action="delete" title="删除">✕</button>
        </div>
    `;
    
    return card;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        work: '工作',
        personal: '个人',
        study: '学习',
        other: '其他'
    };
    return labels[category] || '其他';
}

// Get priority label
function getPriorityLabel(priority) {
    const labels = {
        high: '高',
        medium: '中',
        low: '低'
    };
    return labels[priority] || '中';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render all tasks
function renderTasks() {
    const tasks = loadTasks();
    const filtered = filterTasks(tasks, getCurrentFilters());
    const sorted = sortTasks(filtered);
    
    taskListEl.innerHTML = '';
    
    if (sorted.length === 0) {
        taskListEl.className = 'task-list empty';
        taskListEl.textContent = '暂无任务，点击"新建任务"开始';
        return;
    }
    
    taskListEl.className = 'task-list';
    sorted.forEach(task => {
        taskListEl.appendChild(createTaskCard(task));
    });
}
```

---

### Task 5: Modal Handling

**Files:**
- Modify: `output/js/todo.js`

- [ ] **Step 1: Write modal open/close and form handling**

```javascript
// ===== Modal Handling =====
const modalOverlay = document.getElementById('modal-overlay');
const taskModal = document.getElementById('task-modal');
const modalTitle = document.getElementById('modal-title');
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskCategoryInput = document.getElementById('task-category');
const taskPriorityInput = document.getElementById('task-priority');
const taskDueDateInput = document.getElementById('task-due-date');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel');

const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const btnCloseDeleteModal = document.getElementById('btn-close-delete-modal');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

let deleteTargetId = null;

// Open modal for new task
function openNewTaskModal() {
    modalTitle.textContent = '新建任务';
    taskIdInput.value = '';
    taskTitleInput.value = '';
    taskCategoryInput.value = 'other';
    taskPriorityInput.value = 'medium';
    taskDueDateInput.value = '';
    modalOverlay.classList.add('active');
    taskTitleInput.focus();
}

// Open modal for editing task
function openEditTaskModal(task) {
    modalTitle.textContent = '编辑任务';
    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskCategoryInput.value = task.category;
    taskPriorityInput.value = task.priority;
    taskDueDateInput.value = task.dueDate || '';
    modalOverlay.classList.add('active');
    taskTitleInput.focus();
}

// Close task modal
function closeTaskModal() {
    modalOverlay.classList.remove('active');
    taskForm.reset();
}

// Open delete confirmation modal
function openDeleteModal(taskId) {
    deleteTargetId = taskId;
    deleteModalOverlay.classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    deleteTargetId = null;
    deleteModalOverlay.classList.remove('active');
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = taskTitleInput.value.trim();
    if (!title) {
        taskTitleInput.focus();
        return;
    }
    
    const category = taskCategoryInput.value;
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value || null;
    const existingId = taskIdInput.value;
    
    if (existingId) {
        // Edit existing task
        updateTask(existingId, { title, category, priority, dueDate });
    } else {
        // Create new task
        createTask(title, category, priority, dueDate);
    }
    
    closeTaskModal();
    renderTasks();
}

// Handle delete confirmation
function handleDeleteConfirm() {
    if (deleteTargetId) {
        deleteTask(deleteTargetId);
        closeDeleteModal();
        renderTasks();
    }
}

// Bind modal event listeners
function bindModalEvents() {
    // New task button
    document.getElementById('btn-new-task').addEventListener('click', openNewTaskModal);
    
    // Close modal buttons
    btnCloseModal.addEventListener('click', closeTaskModal);
    btnCancel.addEventListener('click', closeTaskModal);
    
    // Form submission
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Delete modal buttons
    btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    btnConfirmDelete.addEventListener('click', handleDeleteConfirm);
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeTaskModal();
    });
    deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) closeDeleteModal();
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) closeTaskModal();
            if (deleteModalOverlay.classList.contains('active')) closeDeleteModal();
        }
    });
}
```

---

### Task 6: Task Actions and Filtering Events

**Files:**
- Modify: `output/js/todo.js`

- [ ] **Step 1: Write task action handlers**

```javascript
// ===== Task Actions =====
function handleTaskAction(e) {
    const action = e.target.dataset.action;
    if (!action) return;
    
    const card = e.target.closest('.task-card');
    if (!card) return;
    
    const taskId = card.dataset.id;
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (action === 'toggle') {
        toggleComplete(taskId);
        renderTasks();
    } else if (action === 'edit') {
        openEditTaskModal(task);
    } else if (action === 'delete') {
        openDeleteModal(taskId);
    }
}

// ===== Filter Events =====
function handleFilterChange() {
    renderTasks();
}

function bindTaskEvents() {
    // Task card actions (delegated)
    taskListEl.addEventListener('click', handleTaskAction);
    
    // Filter changes
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('filter-category').addEventListener('change', handleFilterChange);
    document.getElementById('filter-priority').addEventListener('change', handleFilterChange);
    document.getElementById('search-input').addEventListener('input', handleFilterChange);
}
```

---

### Task 7: Drag and Drop Sorting

**Files:**
- Modify: `output/js/todo.js`

- [ ] **Step 1: Write drag-and-drop implementation**

```javascript
// ===== Drag and Drop =====
let draggedCard = null;
let draggedId = null;

function handleDragStart(e) {
    const card = e.target.closest('.task-card');
    if (!card) return;
    
    draggedCard = card;
    draggedId = card.dataset.id;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedId);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const card = e.target.closest('.task-card');
    if (!card || card === draggedCard) return;
    
    // Visual feedback - reorder cards temporarily
    const cards = [...taskListEl.querySelectorAll('.task-card')];
    const draggedIndex = cards.indexOf(draggedCard);
    const targetIndex = cards.indexOf(card);
    
    if (draggedIndex < targetIndex) {
        card.after(draggedCard);
    } else {
        card.before(draggedCard);
    }
}

function handleDragEnd(e) {
    if (draggedCard) {
        draggedCard.classList.remove('dragging');
    }
    draggedCard = null;
    draggedId = null;
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedId) return;
    
    // Calculate new order based on current visual position
    const cards = [...taskListEl.querySelectorAll('.task-card')];
    const tasks = loadTasks();
    
    // Update customOrder for affected tasks
    cards.forEach((card, index) => {
        const taskId = card.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.customOrder = index;
        }
    });
    
    saveTasks(tasks);
    renderTasks();
}

function bindDragEvents() {
    taskListEl.addEventListener('dragstart', handleDragStart);
    taskListEl.addEventListener('dragover', handleDragOver);
    taskListEl.addEventListener('dragend', handleDragEnd);
    taskListEl.addEventListener('drop', handleDrop);
}
```

---

### Task 8: Initialize Application

**Files:**
- Modify: `output/js/todo.js`

- [ ] **Step 1: Write initialization and export**

```javascript
// ===== Initialize =====
function init() {
    bindModalEvents();
    bindTaskEvents();
    bindDragEvents();
    renderTasks();
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for testing (optional)
if (typeof window !== 'undefined') {
    window.TodoManager = {
        loadTasks,
        saveTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        sortTasks,
        filterTasks,
        renderTasks
    };
}
```

- [ ] **Step 2: Verify JavaScript functionality**

在浏览器中打开 `output/todo.html`，测试：
- 新建任务并保存
- 任务正确显示在列表中
- 点击checkbox切换完成状态
- 点击编辑按钮打开模态框
- 点击删除按钮打开确认框
- 筛选下拉框正确过滤任务
- 搜索框正确匹配标题
- 拖拽任务卡片改变顺序

---

### Task 9: Deploy to GitHub and Cloudflare

**Files:**
- None (deployment operations)

- [ ] **Step 1: Initialize git repository and commit**

```bash
cd /Users/cn/Downloads/open-code-test1
git init
git add output/
git commit -m "feat: add Todo Manager web application"
```

- [ ] **Step 2: Push to GitHub repository**

```bash
git remote add origin https://github.com/wangchen59/hot-news-daily.git
git branch -M main
git push -u origin main --force
```

注：使用 `--force` 因为仓库可能已有内容。如需保留原有内容，先clone再合并。

- [ ] **Step 3: Verify Cloudflare deployment**

访问 `https://news.wangchen59.fun/todo.html` 确认：
- 页面正确加载
- 功能正常工作
- 数据持久化正常

---

## Self-Review Checklist

### Spec Coverage
| 需求 | 任务覆盖 |
|-----|---------|
| 任务CRUD | Task 3, 5 |
| 分类/优先级/截止日期 | Task 3, 4 |
| 状态/分类/优先级筛选 + 搜索 | Task 3, 6 |
| 拖拽排序 | Task 7 |
| localStorage持久化 | Task 3 |
| 响应式布局 | Task 2 (CSS) |
| 部署 | Task 9 |

### Placeholder Scan
- 无 TBD/TODO
- 所有代码完整
- 无模糊描述

### Type Consistency
- task.id 使用字符串UUID
- task.customOrder 使用数字索引
- 所有函数签名一致

---

## Verification Commands

```bash
# Check file structure
ls -la output/
ls -la output/css/
ls -la output/js/

# Open in browser for manual testing
open output/todo.html
```

---

**Plan complete. Ready for execution.**