// ------------------------------
// STORAGE HANDLERS
// ------------------------------
const getTasksFromStorage = () => {
  try {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// ------------------------------
// TASK HELPERS
// ------------------------------
const generateTaskId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

const buildTaskObject = (description, label) => ({
  id: generateTaskId(),
  description,
  label,
  date: new Date().toLocaleDateString("pt-BR"),
  checked: false,
});

const toggleTaskStatus = (tasks, taskId) =>
  tasks.map((task) =>
    task.id === taskId ? { ...task, checked: !task.checked } : task
  );

const addTaskToStorage = (task) => {
  const tasks = [...getTasksFromStorage(), task];
  saveTasksToStorage(tasks);
  return tasks;
};

// ------------------------------
// DOM RENDERERS
// ------------------------------
const renderTaskProgress = (tasks) => {
  const progressEl = document.getElementById("tasks-progress");
  if (!progressEl) return;
  const doneCount = tasks.filter((task) => task.checked).length;
  const total = tasks.length;
  const plural = total === 1 ? "tarefa" : "tarefas";
  const donePlural = doneCount === 1 ? "tarefa concluída" : "tarefas concluídas";
  progressEl.textContent = `${total} ${plural}, ${doneCount} ${donePlural}`;
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.className = `task ${task.checked ? "done" : ""}`;
  li.id = String(task.id);

  const taskContent = document.createElement("div");

  const titleEl = document.createElement("div");
  titleEl.className = "title";
  titleEl.textContent = task.description;

  const metaEl = document.createElement("div");
  metaEl.className = "meta";

  if (task.label) {
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = task.label;
    metaEl.appendChild(tagEl);
  }

  const dateEl = document.createElement("span");
  dateEl.textContent = `Criado em: ${task.date}`;
  metaEl.appendChild(dateEl);

  taskContent.appendChild(titleEl);
  taskContent.appendChild(metaEl);

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "concluir";
  toggleBtn.textContent = task.checked ? "✔" : "Concluir";
  toggleBtn.onclick = () => handleToggleTask(task.id);

  li.appendChild(taskContent);
  li.appendChild(toggleBtn);

  return li;
};

const renderTasks = (tasks) => {
  const listEl = document.getElementById("todo-list");
  if (!listEl) return;
  listEl.innerHTML = "";
  tasks.forEach((task) => listEl.appendChild(createTaskElement(task)));
  renderTaskProgress(tasks);
};

// ------------------------------
// EVENT HANDLERS
// ------------------------------
const handleToggleTask = (taskId) => {
  const tasks = getTasksFromStorage();
  const updatedTasks = toggleTaskStatus(tasks, taskId);
  saveTasksToStorage(updatedTasks);
  renderTasks(updatedTasks);
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const descriptionInput = document.getElementById("description");
  const labelInput = document.getElementById("label");
  if (!descriptionInput) return;

  const description = descriptionInput.value.trim();
  const label = labelInput ? labelInput.value.trim() : "";
  if (!description) return;

  const newTask = buildTaskObject(description, label);
  const tasks = addTaskToStorage(newTask);
  renderTasks(tasks);

  event.target.reset();
};

const handleRemoveCompleted = () => {
  const tasks = getTasksFromStorage();
  const filtered = tasks.filter((task) => !task.checked);
  saveTasksToStorage(filtered);
  renderTasks(filtered);
};

// ------------------------------
// INIT
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const formEl = document.getElementById("create-todo-form");
  const removeBtn = document.getElementById("remove-completed");

  if (formEl) formEl.addEventListener("submit", handleFormSubmit);
  if (removeBtn) removeBtn.addEventListener("click", handleRemoveCompleted);

  renderTasks(getTasksFromStorage());
});
