// @ts-check

import { renderProjectDetails } from "./project-details.js";
import { TaskStatus, TaskPriority } from "../firestore-service.js";
import { updateURL } from "../navigation.js";
import { getTask, updateTask } from "../firestore-service.js";

/**
 * Función para renderizar y editar los detalles de una tarea
 * @param {import("../firestore-service.js").Project[]} projects
 * @param {import("../firestore-service.js").Project} project
 * @param {string} taskId
 */
export async function renderTaskDetails(projects, project, taskId) {
  /**
   * @type {import("../firestore-service.js").Task | null}
   */
  const task = await getTask(project.id, taskId);
  if (!task) {
    // TODO: Mostrar un mensaje de error o redirigir a la lista de tareas
    console.error("Tarea no encontrada:", taskId);
    return;
  }
  const container = document.createElement("div");
  container.className = "form-container";
  container.id = "task-details-container";
  container.innerHTML = ""; // Limpiar contenido previo

  // Crear el breadcrumb
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "breadcrumb";

  const projectLink = document.createElement("span");
  projectLink.textContent = project.name;
  projectLink.className = "breadcrumb-item";
  projectLink.addEventListener("click", () => renderProjectDetails(projects, project));
  breadcrumb.appendChild(projectLink);

  const separator1 = document.createElement("span");
  separator1.textContent = " > ";
  breadcrumb.appendChild(separator1);

  const categoryName = task.category || "Sin Categoría";
  const categoryLink = document.createElement("span");
  categoryLink.textContent = categoryName;
  categoryLink.className = "breadcrumb-item";
  breadcrumb.appendChild(categoryLink);

  const separator2 = document.createElement("span");
  separator2.textContent = " > ";
  breadcrumb.appendChild(separator2);

  const taskTitle = document.createElement("span");
  taskTitle.textContent = task.title;
  taskTitle.className = "breadcrumb-item active";
  breadcrumb.appendChild(taskTitle);

  container.appendChild(breadcrumb);

  // Crear las pestañas (TABs)
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "tabs-container";

  const tabs = document.createElement("ul");
  tabs.className = "tabs";

  const generalTab = document.createElement("li");
  generalTab.textContent = "Información General";
  generalTab.className = "tab general";
  generalTab.addEventListener("click", () => {
    updateURL({ page: "taskDetails", projectId: project.id, taskId: task.id, tab: "general" });
    switchTab("general");
  });
  tabs.appendChild(generalTab);

  const trackingTab = document.createElement("li");
  trackingTab.textContent = "Seguimiento";
  trackingTab.className = "tab tracking";
  trackingTab.addEventListener("click", () => {
    updateURL({ page: "taskDetails", projectId: project.id, taskId: task.id, tab: "tracking" });
    switchTab("tracking");
  });
  tabs.appendChild(trackingTab);

  const subtasksTab = document.createElement("li");
  subtasksTab.textContent = "Subtareas";
  subtasksTab.className = "tab subtasks";
  subtasksTab.addEventListener("click", () => {
    updateURL({ page: "taskDetails", projectId: project.id, taskId: task.id, tab: "subtasks" });
    switchTab("subtasks");
  });
  tabs.appendChild(subtasksTab);

  tabsContainer.appendChild(tabs);
  container.appendChild(tabsContainer);

  const form = document.createElement("form");
  form.className = "form";

  container.appendChild(form);

  // Crear los contenedores de las secciones
  const generalSection = document.createElement("div");
  generalSection.id = "general";
  generalSection.className = "tab-content";

  const trackingSection = document.createElement("div");
  trackingSection.id = "tracking";
  trackingSection.className = "tab-content";

  const subtasksSection = document.createElement("div");
  subtasksSection.id = "subtasks";
  subtasksSection.className = "tab-content";

  // Campos para Información General
  const generalFields = [
    // { label: "ID:", id: "task-id", type: "text", value: task.id, readonly: true },
    {
      label: "Categoría:",
      id: "task-category",
      type: "select",
      value: task.category || "",
      options: Object.values(project.categories.map((cat) => cat.name)),
    },
    {
      label: "Título (obligatorio):",
      id: "task-title",
      type: "text",
      value: task.title,
      required: true,
    },
    {
      label: "Descripción:",
      id: "task-description",
      type: "textarea",
      value: task.description || "",
    },
    { label: "Responsable:", id: "task-assignee", type: "text", value: task.assignee || "" },
    {
      label: "Fecha de Creación:",
      id: "task-createdAt",
      type: "text",
      value: task.createdAt,
      readonly: true,
    },
    { label: "Fecha de Vencimiento:", id: "task-dueDate", type: "date", value: task.dueDate || "" },
  ];

  generalFields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    generalSection.appendChild(label);

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.value = String(field.value);
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
      input.value = String(field.value);
    }

    input.id = field.id;
    // @ts-ignore
    if (field.readonly) input.readOnly = true;
    if (field.required) input.required = true;
    generalSection.appendChild(input);
  });

  // Campos para Seguimiento
  const trackingFields = [
    {
      label: "Estado:",
      id: "task-status",
      type: "select",
      value: task.status,
      options: Object.values(TaskStatus),
    },
    {
      label: "Prioridad:",
      id: "task-priority",
      type: "select",
      value: task.priority,
      options: Object.values(TaskPriority),
    },
    {
      label: "Progreso",
      id: "task-progress",
      type: "range", // Cambiar el tipo a "range" para usar un slider
      value: task.progress || 0,
      min: 0, // Valor mínimo del slider
      max: 100, // Valor máximo del slider
      step: 1, // Incremento del slider
    },
    {
      label: "Etiquetas (separadas por comas):",
      id: "task-tags",
      type: "text",
      value: task.tags.join(", ") || "",
    },
    {
      label: "Comentarios (separados por punto y coma):",
      id: "task-comments",
      type: "text",
      value: task.comments.join("; ") || "",
    },
    { label: "Notas:", id: "task-notes", type: "textarea", value: task.notes || "" },
  ];

  trackingFields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    trackingSection.appendChild(label);

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.value = String(field.value);
    } else if (field.type === "select") {
      input = document.createElement("select");
      (field.options || []).forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === field.value) {
          option.selected = true;
        }
        input.appendChild(option);
      });
    } else if (field.type === "range") {
      input = document.createElement("input");
      input.type = "range";
      input.value = String(field.value);
      input.min = String(field.min || "0");
      input.max = String(field.max || "100");
      input.step = String(field.step || "1");

      input.addEventListener("input", (event) => {
        // @ts-ignore
        const sliderValue = event.target.value;
        label.textContent = `${field.label} (${sliderValue}%):`;
        task.progress = parseInt(sliderValue, 10); // Actualizar el progreso en el objeto `task`
      });

      label.textContent = `${field.label} (${task.progress}%):`;

      // trackingSection.appendChild(progressValue);
    } else {
      input = document.createElement("input");
      input.type = field.type;
      input.value = String(field.value);
    }

    input.id = field.id;
    label.htmlFor = field.id;
    if (field.required) input.required = true;
    trackingSection.appendChild(input);
  });

  // Crear formulario para agregar nuevas subtareas
  const addSubtaskForm = document.createElement("div");
  addSubtaskForm.className = "form add-subtask-form";

  subtasksSection.appendChild(addSubtaskForm);

  // Crear título para la lista de subtareas
  const subtasksTitle = document.createElement("h3");
  subtasksTitle.textContent = "Lista de Subtareas";
  subtasksTitle.className = "subtasks-title";

  // Agregar el título al contenedor de subtareas
  subtasksSection.appendChild(subtasksTitle);

  // Lista de subtareas
  const subtasksList = document.createElement("ul");
  subtasksList.className = "subtasks-list";

  // Mensaje si no hay subtareas
  const noSubtasksMessage = document.createElement("p");
  noSubtasksMessage.className = "no-subtasks-message";

  // Verificar si hay subtareas
  task.subtasks.forEach((subtask, index) => {
    const listItem = document.createElement("li");
    listItem.className = "subtask-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = subtask.completed;

    // Actualizar el estado de la subtarea al cambiar la casilla
    checkbox.addEventListener("change", async (event) => {
      // @ts-ignore
      const isChecked = event.target?.checked ?? false;
      task.subtasks[index].completed = isChecked;

      // Recalcular el progreso de la tarea
      updateTaskProgress(task);

      try {
        await updateTask(project.id, task); // Guardar el progreso actualizado en Firestore
      } catch (error) {
        console.error("Error al actualizar el progreso de la tarea:", error);
      }
    });

    const title = document.createElement("span");
    title.textContent = subtask.title;
    title.title = subtask.description || "Sin descripción"; // Mostrar la descripción como tooltip

    listItem.appendChild(checkbox);
    listItem.appendChild(title);
    subtasksList.appendChild(listItem);
  });

  // Agregar la lista al contenedor de subtareas
  subtasksSection.appendChild(subtasksList);

  const subtaskInput = document.createElement("input");
  subtaskInput.type = "text";
  subtaskInput.placeholder = "Nueva subtarea...";
  subtaskInput.className = "subtask-input";

  const addSubtaskButton = document.createElement("button");
  addSubtaskButton.type = "button";
  addSubtaskButton.textContent = "Agregar";
  addSubtaskButton.className = "form-button add-button";

  // Evento para agregar una nueva subtarea
  addSubtaskButton.addEventListener("click", async () => {
    const newSubtaskTitle = subtaskInput.value.trim();
    if (newSubtaskTitle === "") {
      alert("El título de la subtarea no puede estar vacío.");
      return;
    }

    // Crear nueva subtarea
    const newSubtask = {
      title: newSubtaskTitle,
      description: "", // Descripción vacía por defecto
      completed: false,
    };

    // Agregar la nueva subtarea al objeto `task`
    task.subtasks.push(newSubtask);

    try {
      await updateTask(project.id, task); // Actualizar subtareas en Firestore
      const listItem = document.createElement("li");
      listItem.className = "subtask-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = newSubtask.completed;

      checkbox.addEventListener("change", async (event) => {
        // @ts-ignore
        const isChecked = event.target.checked;
        newSubtask.completed = isChecked;

        // Recalcular el progreso de la tarea
        updateTaskProgress(task);

        try {
          await updateTask(project.id, task); // Guardar el progreso actualizado en Firestore
        } catch (error) {
          console.error("Error al actualizar el progreso de la tarea:", error);
        }
      });

      const title = document.createElement("span");
      title.textContent = newSubtask.title;
      title.title = newSubtask.description || "Sin descripción";

      listItem.appendChild(checkbox);
      listItem.appendChild(title);
      subtasksList.appendChild(listItem);

      noSubtasksMessage.textContent = "";
      subtaskInput.value = "";
    } catch (error) {
      console.error("Error al agregar la subtarea:", error);
      alert("Hubo un error al agregar la subtarea.");
    }
  });

  // Función para recalcular el progreso de la tarea
  function updateTaskProgress(task) {
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    task.progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    // Actualizar el valor del slider de progreso en la interfaz
    const fieldInfo = trackingFields.find((field) => field.id === "task-progress");
    const progressInput = document.getElementById("task-progress");
    const progressLabel = document.querySelector("label[for='task-progress']");
    if (progressInput) {
      // @ts-ignore
      progressInput.value = task.progress;
    }
    if (progressLabel) {
      progressLabel.textContent = `${fieldInfo?.label} (${task.progress}%):`;
    }
  }

  // Agregar el formulario y la lista al contenedor de subtareas
  addSubtaskForm.appendChild(subtaskInput);
  addSubtaskForm.appendChild(addSubtaskButton);
  subtasksSection.appendChild(subtasksTitle);
  subtasksSection.appendChild(subtasksList);

  if (task.subtasks.length === 0) {
    noSubtasksMessage.textContent = "No hay subtareas. Agrega una nueva subtarea para comenzar.";
    subtasksSection.appendChild(noSubtasksMessage);
  }

  form.appendChild(generalSection);
  form.appendChild(trackingSection);
  form.appendChild(subtasksSection);

  // Botón para guardar los cambios
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Actualizar";
  saveButton.className = "form-button save-button";
  saveButton.addEventListener("click", async () => {
    try {
      await updateTask(project.id, task); // Guardar los cambios en Firestore
      alert("Tarea actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      alert("Hubo un error al actualizar la tarea.");
    }
  });
  form.appendChild(saveButton);

  // Botón para cancelar
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => renderProjectDetails(projects, project));
  form.appendChild(cancelButton);

  document.body.innerHTML = ""; // Limpiar el contenido de la página
  document.body.appendChild(container);

  // Leer el parámetro `tab` de la URL y activar la pestaña correspondiente
  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") || "general"; // Por defecto, activar la pestaña "general"
  switchTab(activeTab);

  /**
   * Función para alternar entre pestañas
   * @param {string} tabId
   */
  function switchTab(tabId) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    const tabElement = document.querySelector(`.tab.${tabId}`);
    if (tabElement) {
      tabElement.classList.add("active");
    }
    const tabContent = document.querySelector(`#${tabId}`);
    if (tabContent) {
      tabContent.classList.add("active");
    }
  }
}
