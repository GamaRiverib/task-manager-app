// @ts-check

import { renderProjectDetails } from "./project-details.js";

/**
 * Función para renderizar los detalles de una tarea
 * @param {import("../data.js").Project[]} projects
 * @param {import("../data.js").Project} project
 * @param {import("../data.js").Task} task
 */
export function renderTaskDetails(projects, project, task) {
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
