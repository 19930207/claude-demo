class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initElements();
        this.bindEvents();
        this.loadFromStorage();
        this.updateUI();
    }

    initElements() {
        this.todoInput = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-btn');
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.clearAllBtn = document.getElementById('clear-all');
        this.deleteModal = document.getElementById('delete-modal');
        this.confirmDeleteBtn = document.getElementById('confirm-delete');
        this.cancelDeleteBtn = document.getElementById('cancel-delete');
        this.deleteMessage = document.getElementById('delete-message');
        
        this.totalTasksEl = document.getElementById('total-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        this.remainingTasksEl = document.getElementById('remaining-tasks');
        
        this.deleteCallback = null;
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => {
            this.showDeleteModal('确定要清除所有已完成的任务吗？', () => {
                this.clearCompleted();
            });
        });

        this.clearAllBtn.addEventListener('click', () => {
            this.showDeleteModal('确定要清除所有任务吗？此操作不可撤销。', () => {
                this.clearAll();
            });
        });

        this.confirmDeleteBtn.addEventListener('click', () => {
            if (this.deleteCallback) {
                this.deleteCallback();
                this.deleteCallback = null;
            }
            this.hideDeleteModal();
        });

        this.cancelDeleteBtn.addEventListener('click', () => {
            this.hideDeleteModal();
        });

        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.hideDeleteModal();
            }
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (!text) {
            this.shakeInput();
            return;
        }

        if (this.editingId) {
            this.updateTodo(this.editingId, text);
            this.editingId = null;
            this.addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        } else {
            const todo = {
                id: this.generateId(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.unshift(todo);
        }

        this.todoInput.value = '';
        this.saveToStorage();
        this.updateUI();
    }

    updateTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            todo.updatedAt = new Date().toISOString();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.updateUI();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.updateUI();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.todoInput.value = todo.text;
            this.todoInput.focus();
            this.editingId = id;
            this.addBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            this.todoInput.setSelectionRange(todo.text.length, todo.text.length);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.updateUI();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveToStorage();
        this.updateUI();
    }

    clearAll() {
        this.todos = [];
        this.saveToStorage();
        this.updateUI();
    }

    showDeleteModal(message, callback) {
        this.deleteMessage.textContent = message;
        this.deleteCallback = callback;
        this.deleteModal.classList.add('show');
    }

    hideDeleteModal() {
        this.deleteModal.classList.remove('show');
        this.deleteCallback = null;
    }

    shakeInput() {
        this.todoInput.style.animation = 'none';
        this.todoInput.offsetHeight; 
        this.todoInput.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            this.todoInput.style.animation = '';
        }, 500);
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        this.animateNumber(this.totalTasksEl, total);
        this.animateNumber(this.completedTasksEl, completed);
        this.animateNumber(this.remainingTasksEl, remaining);
    }

    animateNumber(element, targetNumber) {
        const currentNumber = parseInt(element.textContent) || 0;
        const difference = targetNumber - currentNumber;
        const duration = 500;
        const steps = 20;
        const stepValue = difference / steps;
        const stepDuration = duration / steps;

        let current = currentNumber;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += stepValue;
            element.textContent = Math.round(current);

            if (step >= steps) {
                clearInterval(timer);
                element.textContent = targetNumber;
            }
        }, stepDuration);
    }

    updateUI() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            
            filteredTodos.forEach((todo, index) => {
                const li = this.createTodoElement(todo, index);
                this.todoList.appendChild(li);
            });
        }
        
        this.updateStats();
        
        this.clearCompletedBtn.style.display = 
            this.todos.some(t => t.completed) ? 'flex' : 'none';
    }

    createTodoElement(todo, index) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.style.animationDelay = `${index * 0.1}s`;

        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="todoApp.toggleTodo('${todo.id}')">
            </div>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="action-icon edit-btn" 
                        onclick="todoApp.editTodo('${todo.id}')"
                        title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete-btn" 
                        onclick="todoApp.confirmDelete('${todo.id}')"
                        title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return li;
    }

    confirmDelete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.showDeleteModal(`确定要删除任务"${todo.text}"吗？`, () => {
                this.deleteTodo(id);
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        try {
            localStorage.setItem('todoApp', JSON.stringify(this.todos));
        } catch (e) {
            console.error('无法保存数据到本地存储:', e);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('todoApp');
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (e) {
            console.error('无法从本地存储加载数据:', e);
            this.todos = [];
        }
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

let todoApp;

document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});

window.addEventListener('beforeunload', () => {
    if (todoApp) {
        todoApp.saveToStorage();
    }
});