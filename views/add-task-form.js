// @ts-check

import { createTask, TaskPriority, TaskStatus } from "../firestore-service.js";
import { PAGE_ID, updateURL } from "../navigation.js";
import { renderProjectDetails } from "./project-details.js";

/**
 * Función para renderizar el formulario para agregar una nueva tarea
 * @param {import("../firestore-service.js").Project[]} projects
 * @param {import("../firestore-service.js").Project} project
 * @param {(import("../firestore-service.js").Task | import("../firestore-service.js").TaskDto)[]} tasks
 */
export function renderAddTaskForm(projects, project, tasks) {
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
  saveButton.addEventListener("click", async () => {
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

    const task = await createTask(project.id, {
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

    tasks.push(task); // Agregar la tarea a la lista de tareas del proyecto

    // Regresar a la lista de categorías y tareas
    updateURL({ page: PAGE_ID.PROJECT_DETAILS, projectId: project.id });
    renderProjectDetails(projects, project);
  });
  form.appendChild(saveButton);

  // Botón para cancelar y regresar a la lista de categorías y tareas
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => {
    updateURL({ page: PAGE_ID.PROJECT_DETAILS, projectId: project.id });
    renderProjectDetails(projects, project);
  });
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);
}