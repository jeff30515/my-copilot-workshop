// 這個檔案負責管理待辦清單的資料、渲染畫面、深色模式與篩選功能。

const STORAGE_KEY = 'todo-list-v1';
const THEME_KEY = 'todo-theme-v1';
const FILTER_KEY = 'todo-filter-v1';

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const todoCount = document.querySelector('#todo-count');
const emptyState = document.querySelector('#empty-state');
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');
const filterButtons = document.querySelectorAll('.filter-btn');

// 先從 localStorage 讀取已存在的待辦資料與主題設定。
let todos = loadTodos();
let currentFilter = loadFilter();
let isDarkMode = loadThemePreference();

// 這個函式會依照目前篩選條件，回傳顯示資料。
function getFilteredTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 這個函式會把目前待辦轉成 DOM 列表並更新統計資訊。
function renderTodos() {
  const filteredTodos = getFilteredTodos();
  todoList.innerHTML = '';

  if (filteredTodos.length === 0) {
    const emptyMessage = getEmptyMessage();
    emptyState.textContent = emptyMessage;
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  filteredTodos.forEach((todo) => {
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

// 這個函式會依照篩選狀態，回傳對應的空白提示文字。
function getEmptyMessage() {
  if (currentFilter === 'active') {
    return '目前沒有未完成的待辦事項';
  }

  if (currentFilter === 'completed') {
    return '目前沒有已完成的待辦事項';
  }

  return '還沒有任何待辦事項,新增一個吧!';
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

// 這個函式會根據作業系統設定或使用者手動設定，回傳深色模式狀態。
function loadThemePreference() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme === 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 這個函式會把主題設定寫進 localStorage。
function saveThemePreference() {
  localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
}

// 這個函式會更新畫面中的深色模式按鈕文字與圖示。
function updateThemeUI() {
  document.body.classList.toggle('dark-theme', isDarkMode);

  if (isDarkMode) {
    themeIcon.textContent = '☀️';
    themeText.textContent = '淺色模式';
    themeToggle.setAttribute('aria-label', '切換為淺色模式');
  } else {
    themeIcon.textContent = '🌙';
    themeText.textContent = '深色模式';
    themeToggle.setAttribute('aria-label', '切換為深色模式');
  }
}

// 這個函式會讀取篩選狀態，預設為全部。
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);
  return savedFilter === 'active' || savedFilter === 'completed' ? savedFilter : 'all';
}

// 這個函式會將篩選狀態保存到 localStorage。
function saveFilter() {
  localStorage.setItem(FILTER_KEY, currentFilter);
}

// 這個函式會更新篩選按鈕的選取狀態與目前顯示內容。
function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

// 這個函式會處理深色模式切換按鈕點選事件。
themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  saveThemePreference();
  updateThemeUI();
});

// 這個函式會處理篩選按鈕點選事件。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    saveFilter();
    updateFilterButtons();
    renderTodos();
  });
});

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

// 監聽作業系統主題變更，只有在使用者沒有手動設定時才跟隨。
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (event) => {
  if (!localStorage.getItem(THEME_KEY)) {
    isDarkMode = event.matches;
    updateThemeUI();
  }
});

// 啟動頁面時先將資料、主題與篩選狀態更新到畫面。
updateThemeUI();
updateFilterButtons();
renderTodos();
