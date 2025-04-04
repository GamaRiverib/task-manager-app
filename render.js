// @ts-check

import { updateURL } from "./navigation.js";
import { TaskStatus, TaskPriority } from "./data.js";

/**
 * @typedef {Function} RenderFunction
 * @param {import("./data.js").Project[]} projects - Lista de proyectos
 * @param {import("./data.js").Project} [project] - Proyecto actual
 * @param {import("./data.js").Task} [task] - Tarea actual
 */

/**
 * @typedef {Object} RenderFunctions
 * @property {RenderFunction} renderProjects - Función para renderizar la lista de proyectos
 * @property {RenderFunction} renderAddProjectForm - Función para renderizar el formulario de agregar proyecto
 * @property {RenderFunction} renderProjectDetails - Función para renderizar los detalles de un proyecto
 * @property {RenderFunction} renderAddCategoryForm - Función para renderizar el formulario de agregar categoría
 * @property {RenderFunction} renderAddTaskForm - Función para renderizar el formulario de agregar tarea
 * @property {RenderFunction} renderTaskDetails - Función para renderizar los detalles de una tarea
 *
 */

/**
 * Función para renderizar la lista de proyectos
 * @param {import("./data.js").Project[]} projects - Lista de proyectos a renderizar
 */
function renderProjects(projects) {
  updateURL({ page: null, projectId: null });

  const container = document.createElement("div");
  container.id = "projects-container";
  container.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Lista de Proyectos";
  container.appendChild(title);

  const addProjectElement = document.createElement("div");
  addProjectElement.className = "project add-project";
  addProjectElement.innerHTML = `<h2>+ Agregar Nuevo Proyecto</h2>`;
  addProjectElement.addEventListener("click", () => {
    updateURL({ page: "addProject" });
    renderAddProjectForm(projects);
  });
  container.appendChild(addProjectElement);

  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.className = "project";
    projectElement.innerHTML = `<h2>${project.name}</h2><p>${project.description}</p>`;
    projectElement.addEventListener("click", () => {
      updateURL({ page: "projectDetails", projectId: project.id });
      renderProjectDetails(projects, project);
    });
    container.appendChild(projectElement);
  });

  document.body.innerHTML = "";
  document.body.appendChild(container);
}

/**
 * Función para renderizar el formulario para agregar un nuevo proyecto
 * @param {import("./data.js").Project[]} projects
 */
function renderAddProjectForm(projects) {
  const container = document.createElement("div");
  container.className = "form-container";

  const title = document.createElement("h2");
  title.textContent = "Registrar Nuevo Proyecto";
  container.appendChild(title);

  const form = document.createElement("form");
  form.className = "form";

  // Campo de texto para el nombre del proyecto
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre del Proyecto (obligatorio):";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.required = true;
  form.appendChild(nameInput);

  // Campo de texto para la descripción del proyecto
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descripción:";
  form.appendChild(descriptionLabel);

  const descriptionInput = document.createElement("textarea");
  form.appendChild(descriptionInput);

  // Botón guardar
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
  saveButton.className = "form-button save-button";
  saveButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name) {
      alert('El campo "Nombre del Proyecto" es obligatorio.');
      return;
    }

    // Agregar el nuevo proyecto a la lista
    projects.push({
      id: projects.length + 1,
      name,
      description,
      categories: [],
    });

    // Regresar a la lista de proyectos
    renderProjects(projects);
  });
  form.appendChild(saveButton);

  // Botón cancelar
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => renderProjects(projects));
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para renderizar los detalles de un proyecto con las tareas agrupadas
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
 */
function renderProjectDetails(projects, project) {
  const container = document.createElement("div");
  container.id = "project-details-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = `Proyecto: ${project.name}`;
  container.appendChild(title);

  // Contenedor para los botones de acción
  const actionButtonsContainer = document.createElement("div");
  actionButtonsContainer.className = "action-buttons";

  // Botón dropdown
  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "dropdown";

  const dropdownButton = document.createElement("button");
  dropdownButton.textContent = "Acciones";
  dropdownButton.className = "dropdown-button";
  dropdownContainer.appendChild(dropdownButton);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu";

  // Opción para agregar una nueva categoría
  const addCategoryOption = document.createElement("div");
  addCategoryOption.textContent = "Agregar Categoría";
  addCategoryOption.className = "dropdown-item";
  addCategoryOption.addEventListener("click", () => renderAddCategoryForm(projects, project));
  dropdownMenu.appendChild(addCategoryOption);

  // Opción para agregar una nueva tarea
  const addTaskOption = document.createElement("div");
  addTaskOption.textContent = "Agregar Tarea";
  addTaskOption.className = "dropdown-item";
  addTaskOption.addEventListener("click", () => renderAddTaskForm(projects, project));
  dropdownMenu.appendChild(addTaskOption);

  dropdownContainer.appendChild(dropdownMenu);
  actionButtonsContainer.appendChild(dropdownContainer);

  container.appendChild(actionButtonsContainer);

  // Alternar visibilidad del menú al hacer clic en el botón
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Cerrar el menú si se hace clic fuera del dropdown
  document.addEventListener("click", (event) => {
    // @ts-ignore
    if (!dropdownContainer.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Obtener las tareas agrupadas por fecha
  const groupedTasks = groupTasksByDate(project);

  // Renderizar las tablas para cada grupo de tareas
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

  // Botón para regresar a la lista de proyectos
  const backButton = document.createElement("button");
  backButton.textContent = "Regresar";
  backButton.className = "back-button";
  backButton.addEventListener("click", () => renderProjects(projects));
  container.appendChild(backButton);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para agrupar las tareas por fecha
 * @param {import("./data.js").Project} project
 * @returns {{ today: import("./data.js").Task[], thisWeek: import("./data.js").Task[], thisMonth: import("./data.js").Task[], later: import("./data.js").Task[] }}
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
   * today: Array<import("./data.js").Task & { category: string }>,
   * thisWeek: Array<import("./data.js").Task & { category: string }>,
   * thisMonth: Array<import("./data.js").Task & { category: string }>,
   * later: Array<import("./data.js").Task & { category: string }>,
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
 * @param {import("./data.js").Task[]} tasks
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
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
 * Función para renderizar el formulario para agregar una nueva categoría
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
 */
function renderAddCategoryForm(projects, project) {
  const container = document.createElement("div");
  container.className = "form-container";

  const title = document.createElement("h2");
  title.textContent = "Registrar Nueva Categoría";
  container.appendChild(title);

  const form = document.createElement("form");
  form.className = "form";

  // Campo de texto para el nombre de la categoría
  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Nombre de la Categoría (obligatorio):";
  form.appendChild(categoryLabel);

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.required = true;
  form.appendChild(categoryInput);

  // Botón guardar
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
  saveButton.className = "form-button save-button";
  saveButton.addEventListener("click", () => {
    const categoryName = categoryInput.value.trim();

    if (!categoryName) {
      alert('El campo "Nombre de la Categoría" es obligatorio.');
      return;
    }

    // Agregar la nueva categoría al proyecto
    project.categories.push({
      name: categoryName,
      tasks: [],
    });

    // Regresar a los detalles del proyecto
    renderProjectDetails(projects, project);
  });
  form.appendChild(saveButton);

  // Botón cancelar
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => renderProjectDetails(projects, project));
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para renderizar el formulario para agregar una nueva tarea
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
 */
function renderAddTaskForm(projects, project) {
  const container = document.createElement("div");
  container.className = "form-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = "Agregar Nueva Tarea";
  container.appendChild(title);

  const form = document.createElement("form");
  form.className = "form";

  // Campos para los atributos de la tarea
  const fields = [
    {
      label: "Seleccionar Categoría (obligatorio):",
      id: "task-category",
      type: "select",
      options: Object.values(project.categories.map((cat) => cat.name)),
    },
    { label: "Título (obligatorio):", id: "task-title", type: "text", required: true },
    { label: "Descripción:", id: "task-description", type: "textarea" },
    { label: "Responsable:", id: "task-assignee", type: "text" },
    { label: "Fecha de Vencimiento:", id: "task-dueDate", type: "date" },
    {
      label: "Prioridad:",
      id: "task-priority",
      type: "select",
      options: Object.values(TaskPriority), // Opciones del enumerador TaskPriority
    },
    { label: "Notas:", id: "task-notes", type: "textarea" },
  ];

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    form.appendChild(label);

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
    } else if (field.type === "select") {
      input = document.createElement("select");
      (field.options || []).forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type;
    }

    input.id = field.id;
    if (field.required) input.required = true;
    form.appendChild(input);
  });

  // Botón para guardar la tarea
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
  saveButton.className = "form-button save-button";
  saveButton.addEventListener("click", () => {
    const categoryElement = document.getElementById("task-category");
    const categoryName = categoryElement instanceof HTMLSelectElement ? categoryElement.value : "";
    const titleElement = document.getElementById("task-title");
    const title = titleElement instanceof HTMLInputElement ? titleElement.value.trim() : "";
    const descriptionElement = document.getElementById("task-description");
    const description =
      descriptionElement instanceof HTMLTextAreaElement ? descriptionElement.value.trim() : "";
    const assigneeElement = document.getElementById("task-assignee");
    const assignee =
      assigneeElement instanceof HTMLInputElement ? assigneeElement.value.trim() : "";
    const dueDateElement = document.getElementById("task-dueDate");
    const dueDate = dueDateElement instanceof HTMLInputElement ? dueDateElement.value.trim() : "";
    const priorityElement = document.getElementById("task-priority");
    const priority = priorityElement instanceof HTMLSelectElement ? priorityElement.value : "";
    const notesElement = document.getElementById("task-notes");
    const notes = notesElement instanceof HTMLTextAreaElement ? notesElement.value.trim() : "";

    if (!title) {
      alert('El campo "Título" es obligatorio.');
      return;
    }

    // Buscar la categoría seleccionada y agregar la tarea
    const category = project.categories.find((cat) => cat.name === categoryName);
    if (category) {
      category.tasks.push({
        id: Date.now(), // Generar un ID único
        title,
        description,
        assignee,
        dueDate,
        status: TaskStatus.PENDING, // Asignar el estado por defecto
        priority,
        category: categoryName,
        tags: [],
        createdAt: new Date().toISOString().split("T")[0],
        completedAt: null,
        comments: [],
        subtasks: [],
        progress: 0,
        attachments: [],
        notes,
      });
    }

    // Regresar a la lista de categorías y tareas
    renderProjectDetails(projects, project);
  });
  form.appendChild(saveButton);

  // Botón para cancelar y regresar a la lista de categorías y tareas
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => renderProjectDetails(projects, project));
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para renderizar los detalles de una tarea
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
 * @param {import("./data.js").Task} task
 */
function renderTaskDetails(projects, project, task) {
  const container = document.createElement("div");
  container.id = "task-details-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = `Tarea: ${task.title}`;
  container.appendChild(title);

  const details = document.createElement("div");
  details.innerHTML = `
    <p><strong>Descripción:</strong> ${task.description}</p>
    <p><strong>Responsable:</strong> ${task.assignee}</p>
    <p><strong>Fecha de vencimiento:</strong> ${task.dueDate}</p>
    <p><strong>Estado:</strong> ${task.status}</p>
    <p><strong>Prioridad:</strong> ${task.priority}</p>
    <p><strong>Progreso:</strong> ${task.progress}%</p>
    <p><strong>Notas:</strong> ${task.notes}</p>
    <p><strong>Etiquetas:</strong> ${task.tags.join(", ")}</p>
    <p><strong>Comentarios:</strong> ${task.comments.join("; ")}</p>
    <h3>Subtareas:</h3>
    <ul>
      ${task.subtasks
        .map(
          (subtask) => `
        <li>
          <strong>${subtask.title}</strong>: ${subtask.description} - ${
            subtask.completed ? "Terminado" : "Pendiente"
          }
        </li>
      `
        )
        .join("")}
    </ul>
  `;
  container.appendChild(details);

  // Botón para cerrar y regresar a la lista de categorías y tareas
  const closeButton = document.createElement("button");
  closeButton.textContent = "Cerrar";
  closeButton.addEventListener("click", () => renderProjectDetails(projects, project));
  container.appendChild(closeButton);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * @type {RenderFunctions}
 */
const renderFunctions = {
  renderProjects,
  renderAddProjectForm,
  renderProjectDetails,
  renderAddCategoryForm,
  renderAddTaskForm,
  renderTaskDetails,
};

export { renderFunctions };
