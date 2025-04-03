// @ts-check

import { updateURL } from "./navigation.js";

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
  container.id = "add-project-form-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = "Agregar Nuevo Proyecto";
  container.appendChild(title);

  const form = document.createElement("form");
  form.id = "add-project-form";

  // Campo de texto para el nombre del proyecto
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre (obligatorio):";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "project-name";
  nameInput.required = true;
  form.appendChild(nameInput);

  // Campo de texto para la descripción del proyecto
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descripción:";
  form.appendChild(descriptionLabel);

  const descriptionInput = document.createElement("textarea");
  descriptionInput.id = "project-description";
  form.appendChild(descriptionInput);

  // Botón para guardar el proyecto
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
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

  // Botón para cancelar y regresar a la lista de proyectos
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.addEventListener("click", () => renderProjects(projects));
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para renderizar los detalles de un proyecto
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

  // Botón para agregar una nueva categoría
  const addCategoryButton = document.createElement("button");
  addCategoryButton.textContent = "Agregar Categoría";
  addCategoryButton.addEventListener("click", () => renderAddCategoryForm(projects, project));
  container.appendChild(addCategoryButton);

  // Botón para agregar una nueva tarea
  const addTaskButton = document.createElement("button");
  addTaskButton.textContent = "Agregar Tarea";
  addTaskButton.addEventListener("click", () => renderAddTaskForm(projects, project));
  container.appendChild(addTaskButton);

  if (project.categories.length > 0) {
    project.categories.forEach((category) => {
      const categoryElement = document.createElement("div");
      categoryElement.className = "category";

      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = category.name;
      categoryElement.appendChild(categoryTitle);

      const taskList = document.createElement("ul");
      category.tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
          <strong>${task.title}</strong> - ${task.status} - Prioridad: ${task.priority}
        `;

        // Agregar evento de clic para mostrar detalles de la tarea
        taskItem.addEventListener("click", () => renderTaskDetails(projects, project, task));
        taskList.appendChild(taskItem);
      });

      categoryElement.appendChild(taskList);
      container.appendChild(categoryElement);
    });
  } else {
    const noCategoriesMessage = document.createElement("p");
    noCategoriesMessage.textContent = "No hay categorías disponibles para este proyecto.";
    container.appendChild(noCategoriesMessage);
  }

  // Botón para regresar a la lista de proyectos
  const backButton = document.createElement("button");
  backButton.textContent = "Regresar";
  backButton.addEventListener("click", () => renderProjects(projects));
  container.appendChild(backButton);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}

/**
 * Función para renderizar el formulario para agregar una nueva categoría
 * @param {import("./data.js").Project[]} projects
 * @param {import("./data.js").Project} project
 */
function renderAddCategoryForm(projects, project) {
  const container = document.createElement("div");
  container.id = "add-category-form-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = "Agregar Nueva Categoría";
  container.appendChild(title);

  const form = document.createElement("form");
  form.id = "add-category-form";

  // Campo de texto para el nombre de la categoría
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre de la Categoría (obligatorio):";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "category-name";
  nameInput.required = true;
  form.appendChild(nameInput);

  // Botón para guardar la categoría
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
  saveButton.addEventListener("click", () => {
    const name = nameInput.value.trim();

    if (!name) {
      alert('El campo "Nombre de la Categoría" es obligatorio.');
      return;
    }

    // Agregar la nueva categoría al proyecto
    project.categories.push({
      name,
      tasks: [],
    });

    // Regresar a la lista de categorías y tareas
    renderProjectDetails(projects, project);
  });
  form.appendChild(saveButton);

  // Botón para cancelar y regresar a la lista de categorías y tareas
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
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
  container.id = "add-task-form-container";
  container.innerHTML = ""; // Limpiar contenido previo

  const title = document.createElement("h2");
  title.textContent = "Agregar Nueva Tarea";
  container.appendChild(title);

  const form = document.createElement("form");
  form.id = "add-task-form";

  // Campo para seleccionar la categoría
  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Seleccionar Categoría (obligatorio):";
  form.appendChild(categoryLabel);

  const categorySelect = document.createElement("select");
  categorySelect.id = "task-category";
  categorySelect.required = true;

  // Agregar opciones al select con las categorías del proyecto
  project.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  form.appendChild(categorySelect);

  // Campos para los atributos de la tarea
  const fields = [
    { label: "Título (obligatorio):", id: "task-title", type: "text", required: true },
    { label: "Descripción:", id: "task-description", type: "textarea" },
    { label: "Responsable:", id: "task-assignee", type: "text" },
    { label: "Fecha de Vencimiento:", id: "task-dueDate", type: "date" },
    { label: "Estado:", id: "task-status", type: "text" },
    { label: "Prioridad:", id: "task-priority", type: "text" },
    { label: "Notas:", id: "task-notes", type: "textarea" },
  ];

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    form.appendChild(label);

    const input =
      field.type === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");
    if (field.type !== "textarea") {
      if (input instanceof HTMLInputElement) {
        input.type = field.type;
      }
    }
    input.id = field.id;
    if (field.required) input.required = true;
    form.appendChild(input);
  });

  // Botón para guardar la tarea
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Guardar";
  saveButton.addEventListener("click", () => {
    const categoryName = categorySelect.value;
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
    const statusElement = document.getElementById("task-status");
    const status = statusElement instanceof HTMLInputElement ? statusElement.value.trim() : "";
    const priorityElement = document.getElementById("task-priority");
    const priority =
      priorityElement instanceof HTMLInputElement ? priorityElement.value.trim() : "";
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
        status,
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
