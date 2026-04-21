// ===== Data Management =====
const STORAGE_KEY = 'todoManager_tasks';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

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

function deleteTask(id) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
}

function toggleComplete(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.customOrder = null;
        saveTasks(tasks);
        return task;
    }
    return null;
}

// ===== Sorting =====
const priorityOrder = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        if (a.customOrder !== null && b.customOrder !== null) {
            return a.customOrder - b.customOrder;
        }
        if (a.customOrder !== null) return -1;
        if (b.customOrder !== null) return 1;
        
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        
        return b.createdAt - a.createdAt;
    });
}

// ===== Filtering =====
function filterTasks(tasks, filters) {
    return tasks.filter(task => {
        if (filters.status === 'active' && task.completed) return false;
        if (filters.status === 'completed' && !task.completed) return false;
        
        if (filters.category !== 'all' && task.category !== filters.category) return false;
        
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        
        return true;
    });
}

function getCurrentFilters() {
    return {
        status: document.getElementById('filter-status').value,
        category: document.getElementById('filter-category').value,
        priority: document.getElementById('filter-priority').value,
        search: document.getElementById('search-input').value.trim()
    };
}

// ===== Rendering =====
const taskListEl = document.getElementById('task-list');

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

function isOverdue(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

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

function getCategoryLabel(category) {
    const labels = { work: '工作', personal: '个人', study: '学习', other: '其他' };
    return labels[category] || '其他';
}

function getPriorityLabel(priority) {
    const labels = { high: '高', medium: '中', low: '低' };
    return labels[priority] || '中';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

function closeTaskModal() {
    modalOverlay.classList.remove('active');
    taskForm.reset();
}

function openDeleteModal(taskId) {
    deleteTargetId = taskId;
    deleteModalOverlay.classList.add('active');
}

function closeDeleteModal() {
    deleteTargetId = null;
    deleteModalOverlay.classList.remove('active');
}

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
        updateTask(existingId, { title, category, priority, dueDate });
    } else {
        createTask(title, category, priority, dueDate);
    }
    
    closeTaskModal();
    renderTasks();
}

function handleDeleteConfirm() {
    if (deleteTargetId) {
        deleteTask(deleteTargetId);
        closeDeleteModal();
        renderTasks();
    }
}

function bindModalEvents() {
    document.getElementById('btn-new-task').addEventListener('click', openNewTaskModal);
    
    btnCloseModal.addEventListener('click', closeTaskModal);
    btnCancel.addEventListener('click', closeTaskModal);
    
    taskForm.addEventListener('submit', handleFormSubmit);
    
    btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    btnConfirmDelete.addEventListener('click', handleDeleteConfirm);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeTaskModal();
    });
    deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) closeDeleteModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) closeTaskModal();
            if (deleteModalOverlay.classList.contains('active')) closeDeleteModal();
        }
    });
}

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

function handleFilterChange() {
    renderTasks();
}

function bindTaskEvents() {
    taskListEl.addEventListener('click', handleTaskAction);
    
    document.getElementById('filter-status').addEventListener('change', handleFilterChange);
    document.getElementById('filter-category').addEventListener('change', handleFilterChange);
    document.getElementById('filter-priority').addEventListener('change', handleFilterChange);
    document.getElementById('search-input').addEventListener('input', handleFilterChange);
}

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
    
    const cards = [...taskListEl.querySelectorAll('.task-card')];
    const tasks = loadTasks();
    
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

// ===== Initialize =====
function init() {
    bindModalEvents();
    bindTaskEvents();
    bindDragEvents();
    renderTasks();
}

document.addEventListener('DOMContentLoaded', init);

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