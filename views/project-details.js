// @ts-check

import { getTasks, TaskStatus } from "../firestore-service.js";
import { updateURL } from "../navigation.js";
import { renderAddCategoryForm } from "./add-category-form.js";
import { renderAddTaskForm } from "./add-task-form.js";
import { renderProjects } from "./projects-list.js";
import { renderTaskDetails } from "./task-details.js";

/**
 * Función para agrupar las tareas por fecha
 * @param {import("../firestore-service.js").Project} project
 * @param {import("../firestore-service.js").TaskDto[]} tasks
 * @returns {{ today: import("../firestore-service.js").TaskDto[], thisWeek: import("../firestore-service.js").TaskDto[], thisMonth: import("../firestore-service.js").TaskDto[], later: import("../firestore-service.js").TaskDto[] }}
 */
function groupTasksByDate(project, tasks) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Primer día de la semana
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Último día de la semana
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes

  /**
   * @type {import("../firestore-service.js").TaskDto[]}
   */
  const filteredTasks = tasks.filter(
    (task) => task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED
  );

  /**
   * @type {{
   * today: Array<import("../firestore-service.js").TaskDto>,
   * thisWeek: Array<import("../firestore-service.js").TaskDto>,
   * thisMonth: Array<import("../firestore-service.js").TaskDto>,
   * later: Array<import("../firestore-service.js").TaskDto>,
   * }}
   */
  const groupedTasks = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    later: [],
  };

  filteredTasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    if (isSameDay(dueDate, today)) {
      groupedTasks.today.push({ ...task });
    } else if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
      groupedTasks.thisWeek.push({ ...task });
    } else if (dueDate >= startOfMonth && dueDate <= endOfMonth) {
      groupedTasks.thisMonth.push({ ...task });
    } else if (dueDate > endOfMonth) {
      groupedTasks.later.push({ ...task });
    }
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
 * @param {import("../firestore-service.js").TaskDto[]} tasks
 * @param {import("../firestore-service.js").Project[]} projects
 * @param {import("../firestore-service.js").Project} project
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
      <td>${task.title}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
    `;
    row.addEventListener("click", () => {
      updateURL({ page: "taskDetails", projectId: project.id, taskId: task.id });
      renderTaskDetails(projects, project, tasks, task.id);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  container.appendChild(table);
}

/**
 * Función para renderizar los detalles de un proyecto con las tareas agrupadas
 * @param {import("../firestore-service.js").Project[]} projects
 * @param {import("../firestore-service.js").Project} project
 */
export async function renderProjectDetails(projects, project) {
  const tasks = await getTasks(project.id);

  const container = document.createElement("div");
  container.className = "container";
  container.id = "project-details-container";
  container.innerHTML = "";

  // Crear el breadcrumb
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "breadcrumb";

  const projectsLink = document.createElement("span");
  projectsLink.textContent = "Proyectos";
  projectsLink.className = "breadcrumb-item";
  projectsLink.addEventListener("click", () => renderProjects(projects));
  breadcrumb.appendChild(projectsLink);

  const separator = document.createElement("span");
  separator.textContent = " > ";
  breadcrumb.appendChild(separator);

  const projectName = document.createElement("span");
  projectName.textContent = project.name;
  projectName.className = "breadcrumb-item active";
  breadcrumb.appendChild(projectName);

  container.appendChild(breadcrumb);

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
  addCategoryOption.addEventListener("click", () => {
    updateURL({ page: "addCategory", projectId: project.id });
    renderAddCategoryForm(projects, project);
  });
  dropdownMenu.appendChild(addCategoryOption);

  const addTaskOption = document.createElement("div");
  addTaskOption.textContent = "Agregar Tarea";
  addTaskOption.className = "dropdown-item";
  addTaskOption.addEventListener("click", () => {
    updateURL({ page: "addTask", projectId: project.id });
    renderAddTaskForm(projects, project, tasks);
  });
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

  if (tasks.length === 0) {
    const noTasksMessage = document.createElement("p");
    noTasksMessage.className = "no-tasks-message";
    noTasksMessage.textContent = "Este proyecto no tiene tareas. ";

    const addTaskLink = document.createElement("a");
    addTaskLink.href = "#";
    addTaskLink.textContent = "Haz clic aquí para agregar una tarea.";
    addTaskLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateURL({ page: "addTask", projectId: project.id });
      renderAddTaskForm(projects, project, tasks);
    });

    noTasksMessage.appendChild(addTaskLink);
    container.appendChild(noTasksMessage);
  } else {
    const groupedTasks = groupTasksByDate(project, tasks);

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
  }

  document.body.innerHTML = "";
  document.body.appendChild(container);
}
