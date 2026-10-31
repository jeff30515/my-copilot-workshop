// 這個檔案負責管理待辦清單的資料、渲染畫面與本地儲存。

const STORAGE_KEY = 'todo-list-v1';

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const todoCount = document.querySelector('#todo-count');
const emptyState = document.querySelector('#empty-state');

// 先從 localStorage 讀取已存在的待辦資料。
let todos = loadTodos();

// 這個函式會將目前待辦轉成 DOM 列表並更新統計資訊。
function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const main = document.createElement('div');
    main.className = 'todo-main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記 ${todo.text} 完成`);

    // 勾選後會切換完成狀態，並更新儲存資料。
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `刪除 ${todo.text}`);

    // 刪除按鈕會移除這筆待辦，並重新更新畫面與儲存。
    deleteBtn.addEventListener('click', () => {
      todos = todos.filter((entry) => entry.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    main.appendChild(checkbox);
    main.appendChild(text);
    item.appendChild(main);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${activeCount} 項`;
}

// 讀取 localStorage 中的待辦資料，若資料不存在則回傳空陣列。
function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('讀取待辦資料失敗:', error);
    return [];
  }
}

// 將待辦資料保存到 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 新增待辦事項，並忽略空白輸入。
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now() + Math.random(),
    text,
    completed: false,
  });

  todoInput.value = '';
  todoInput.focus();
  saveTodos();
  renderTodos();
});

// 啟動頁面時先將資料渲染出來。
renderTodos();
