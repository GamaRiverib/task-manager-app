// @ts-check

import { renderAddCategoryForm } from "./add-category-form.js";
import { renderAddTaskForm } from "./add-task-form.js";
import { renderProjects } from "./projects-list.js";
import { renderTaskDetails } from "./task-details.js";

/**
 * Función para agrupar las tareas por fecha
 * @param {import("../data.js").Project} project
 * @returns {{ today: import("../data.js").Task[], thisWeek: import("../data.js").Task[], thisMonth: import("../data.js").Task[], later: import("../data.js").Task[] }}
 */
function groupTasksByDate(project) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Primer día de la semana
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Último día de la semana
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes

  /**
   * @type {{
   * today: Array<import("../data.js").Task & { category: string }>,
   * thisWeek: Array<import("../data.js").Task & { category: string }>,
   * thisMonth: Array<import("../data.js").Task & { category: string }>,
   * later: Array<import("../data.js").Task & { category: string }>,
   * }}
   */
  const groupedTasks = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    later: [],
  };

  project.categories.forEach((category) => {
    category.tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      if (isSameDay(dueDate, today)) {
        groupedTasks.today.push({ ...task, category: category.name });
      } else if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
        groupedTasks.thisWeek.push({ ...task, category: category.name });
      } else if (dueDate >= startOfMonth && dueDate <= endOfMonth) {
        groupedTasks.thisMonth.push({ ...task, category: category.name });
      } else if (dueDate > endOfMonth) {
        groupedTasks.later.push({ ...task, category: category.name });
      }
    });
  });

  return groupedTasks;
}

/**
 * Función para verificar si dos fechas son el mismo día
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Función para renderizar una tabla de tareas
 * @param {HTMLElement} container
 * @param {string} title
 * @param {import("../data.js").Task[]} tasks
 * @param {import("../data.js").Project[]} projects
 * @param {import("../data.js").Project} project
 */
function renderTaskTable(container, title, tasks, projects, project) {
  if (tasks.length === 0) return; // No renderizar si no hay tareas

  const tableTitle = document.createElement("h3");
  tableTitle.textContent = title;
  container.appendChild(tableTitle);

  const table = document.createElement("table");
  table.className = "task-table";

  // Encabezados de la tabla
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Categoría</th>
      <th>Título</th>
      <th>Estatus</th>
      <th>Prioridad</th>
    </tr>
  `;
  table.appendChild(thead);

  // Cuerpo de la tabla
  const tbody = document.createElement("tbody");
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.category}</td>
      <td>${task.title}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
    `;
    row.addEventListener("click", () => renderTaskDetails(projects, project, task));
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  container.appendChild(table);
}

/**
 * Función para renderizar los detalles de un proyecto con las tareas agrupadas
 * @param {import("../data.js").Project[]} projects
 * @param {import("../data.js").Project} project
 */
export function renderProjectDetails(projects, project) {
  const container = document.createElement("div");
  container.id = "project-details-container";
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = project.name;
  container.appendChild(title);

  const actionButtonsContainer = document.createElement("div");
  actionButtonsContainer.className = "action-buttons";

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown";

  const dropdownButton = document.createElement("button");
  dropdownButton.textContent = "Acciones";
  dropdownButton.className = "dropdown-button";
  dropdownContainer.appendChild(dropdownButton);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu";

  const addCategoryOption = document.createElement("div");
  addCategoryOption.textContent = "Agregar Categoría";
  addCategoryOption.className = "dropdown-item";
  addCategoryOption.addEventListener("click", () => renderAddCategoryForm(projects, project));
  dropdownMenu.appendChild(addCategoryOption);

  const addTaskOption = document.createElement("div");
  addTaskOption.textContent = "Agregar Tarea";
  addTaskOption.className = "dropdown-item";
  addTaskOption.addEventListener("click", () => renderAddTaskForm(projects, project));
  dropdownMenu.appendChild(addTaskOption);

  dropdownContainer.appendChild(dropdownMenu);
  actionButtonsContainer.appendChild(dropdownContainer);

  container.appendChild(actionButtonsContainer);

  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    // @ts-ignore
    if (!dropdownContainer.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  const groupedTasks = groupTasksByDate(project);

  renderTaskTable(container, "Tareas que vencen hoy", groupedTasks.today, projects, project);
  renderTaskTable(
    container,
    "Tareas que vencen esta semana",
    groupedTasks.thisWeek,
    projects,
    project
  );
  renderTaskTable(
    container,
    "Tareas que vencen este mes",
    groupedTasks.thisMonth,
    projects,
    project
  );
  renderTaskTable(
    container,
    "Tareas con fechas posteriores",
    groupedTasks.later,
    projects,
    project
  );

  const backButton = document.createElement("button");
  backButton.textContent = "Regresar";
  backButton.className = "back-button";
  backButton.addEventListener("click", () => renderProjects(projects));
  container.appendChild(backButton);

  document.body.innerHTML = "";
  document.body.appendChild(container);
}
