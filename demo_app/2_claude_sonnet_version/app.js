// ── DOM Selection ─────────────────────────────────────
const todoInput      = document.querySelector(".todo-input");
const todoButton     = document.querySelector(".todo-button");
const todoList       = document.querySelector(".todo-list");
const filterButtons  = document.querySelectorAll(".filter-btn");
const emptyState     = document.querySelector(".empty-state");
const progressBar    = document.querySelector(".progress-bar");
const progressCount  = document.querySelector(".progress-count");
const allCount       = document.querySelector(".all-count");
const activeCount    = document.querySelector(".active-count");
const completedCount = document.querySelector(".completed-count");

let currentFilter = "all";

// ── Event Listeners ───────────────────────────────────
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoAction);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilter(currentFilter);
  });
});

// ── Functions ─────────────────────────────────────────

function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }
  saveLocalTodos(text);
  const todoDiv = createTodoElement(text);
  todoList.appendChild(todoDiv);
  todoInput.value = "";
  applyFilter(currentFilter);
  updateStats();
}

function createTodoElement(text) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = text;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  return todoDiv;
}

function handleTodoAction(e) {
  const trashBtn    = e.target.closest(".trash-btn");
  const completeBtn = e.target.closest(".complete-btn");

  if (trashBtn) {
    const todo = trashBtn.parentElement;
    removeLocalTodos(todo);
    todo.style.animation = "slideOut 0.2s ease forwards";
    setTimeout(() => {
      todo.remove();
      updateStats();
      applyFilter(currentFilter);
    }, 200);
  }

  if (completeBtn) {
    const todo = completeBtn.parentElement;
    todo.classList.toggle("completed");
    const icon = completeBtn.querySelector("i");
    if (todo.classList.contains("completed")) {
      icon.classList.replace("fa-check", "fa-times");
    } else {
      icon.classList.replace("fa-times", "fa-check");
    }
    applyFilter(currentFilter);
    updateStats();
  }
}

function applyFilter(filter) {
  const todos = todoList.querySelectorAll(".todo");
  todos.forEach(todo => {
    switch (filter) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
        break;
      case "uncompleted":
        todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
  updateEmptyState(filter);
}

function updateStats() {
  const todos     = todoList.querySelectorAll(".todo");
  const total     = todos.length;
  const done      = todoList.querySelectorAll(".todo.completed").length;
  const remaining = total - done;

  allCount.textContent       = total;
  activeCount.textContent    = remaining;
  completedCount.textContent = done;
  progressCount.textContent  = `${done} / ${total}`;
  progressBar.style.width    = total > 0 ? `${(done / total) * 100}%` : "0%";
}

function updateEmptyState(filter) {
  const visible = Array.from(todoList.querySelectorAll(".todo"))
    .filter(t => t.style.display !== "none").length;

  emptyState.classList.toggle("hidden", visible > 0);

  const messages = {
    all:         "No tasks yet — add one above!",
    uncompleted: "All tasks are completed!",
    completed:   "No completed tasks yet.",
  };
  emptyState.querySelector("p").textContent = messages[filter] ?? "No tasks here";
}

// ── LocalStorage ──────────────────────────────────────

function saveLocalTodos(todo) {
  const todos = getLocalTodos();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todoEl) {
  const todos     = getLocalTodos();
  const todoIndex = todoEl.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
  const raw = localStorage.getItem("todos");
  return raw === null ? [] : JSON.parse(raw);
}

function getTodos() {
  getLocalTodos().forEach(todo => {
    const todoDiv = createTodoElement(todo);
    todoList.appendChild(todoDiv);
  });
  updateStats();
  updateEmptyState(currentFilter);
}
