const todoInput = document.querySelector(".todo-input");
const todoForm = document.getElementById("todo-form");
const todoList = document.querySelector(".todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.getElementById("empty-state");
const todoCountEl = document.getElementById("todo-count");
const appFooter = document.getElementById("app-footer");

let currentFilter = "all";

document.addEventListener("DOMContentLoaded", getTodos);
todoForm.addEventListener("submit", addTodo);
todoList.addEventListener("click", handleTodoAction);
filterButtons.forEach((btn) => btn.addEventListener("click", handleFilter));

function addTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  createTodoElement(text);
  saveLocalTodos(text);
  todoInput.value = "";
  todoInput.focus();

  if (currentFilter !== "all") {
    currentFilter = "all";
    filterButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.filter === "all")
    );
  }

  applyFilter();
  updateStats();
}

function createTodoElement(text) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  completedButton.type = "button";
  todoDiv.appendChild(completedButton);

  const newTodo = document.createElement("li");
  newTodo.innerText = text;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  trashButton.type = "button";
  todoDiv.appendChild(trashButton);

  todoList.appendChild(todoDiv);
  return todoDiv;
}

function handleTodoAction(e) {
  const trashBtn = e.target.closest(".trash-btn");
  const completeBtn = e.target.closest(".complete-btn");

  if (trashBtn) {
    const todo = trashBtn.parentElement;
    todo.classList.add("todo-exit");
    todo.addEventListener("animationend", () => {
      removeLocalTodos(todo);
      todo.remove();
      updateStats();
    });
  }

  if (completeBtn) {
    const todo = completeBtn.parentElement;
    todo.classList.toggle("completed");
    applyFilter();
    updateStats();
  }
}

function handleFilter(e) {
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  e.currentTarget.classList.add("active");
  currentFilter = e.currentTarget.dataset.filter;
  applyFilter();
}

function applyFilter() {
  const todos = todoList.querySelectorAll(".todo");
  todos.forEach((todo) => {
    const isCompleted = todo.classList.contains("completed");
    switch (currentFilter) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        todo.style.display = isCompleted ? "flex" : "none";
        break;
      case "uncompleted":
        todo.style.display = !isCompleted ? "flex" : "none";
        break;
    }
  });
  updateStats();
}

function updateStats() {
  const todos = todoList.querySelectorAll(".todo");
  const total = todos.length;
  const completed = todoList.querySelectorAll(".todo.completed").length;
  const active = total - completed;

  emptyState.style.display = total === 0 ? "flex" : "none";
  appFooter.style.display = total === 0 ? "none" : "block";

  if (total > 0) {
    todoCountEl.textContent = `${active} active \u00b7 ${completed} completed`;
  }
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoText = todo.querySelector(".todo-item").innerText;
  todos.splice(todos.indexOf(todoText), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach((todo) => createTodoElement(todo));
  updateStats();
}
