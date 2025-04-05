// @ts-check

import { updateProject } from "../firestore-service.js";
import { renderProjectDetails } from "./project-details.js";

/**
 * Función para renderizar el formulario para agregar una nueva categoría
 * @param {import("../firestore-service.js").Project[]} projects
 * @param {import("../firestore-service.js").Project} project
 */
export function renderAddCategoryForm(projects, project) {
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
  saveButton.addEventListener("click", async () => {
    const categoryName = categoryInput.value.trim();

    if (!categoryName) {
      alert('El campo "Nombre de la Categoría" es obligatorio.');
      return;
    }

    // Agregar la nueva categoría al proyecto
    project.categories.push({
      name: categoryName,
    });

    await updateProject(project);

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