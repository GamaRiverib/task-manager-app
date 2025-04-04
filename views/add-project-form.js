// @ts-check

import { renderProjects } from "./projects-list.js";

/**
 * Función para renderizar el formulario para agregar un nuevo proyecto
 * @param {import("../data.js").Project[]} projects
 */
export function renderAddProjectForm(projects) {
  const container = document.createElement("div");
  container.className = "form-container";

  const title = document.createElement("h2");
  title.textContent = "Registrar Nuevo Proyecto";
  container.appendChild(title);

  const form = document.createElement("form");
  form.className = "form";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nombre (obligatorio):";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.required = true;
  form.appendChild(nameInput);

  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descripción:";
  form.appendChild(descriptionLabel);

  const descriptionInput = document.createElement("textarea");
  form.appendChild(descriptionInput);

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

    projects.push({
      id: projects.length + 1,
      name,
      description,
      categories: [],
    });

    renderProjects(projects);
  });
  form.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancelar";
  cancelButton.className = "form-button cancel-button";
  cancelButton.addEventListener("click", () => renderProjects(projects));
  form.appendChild(cancelButton);

  container.appendChild(form);

  document.body.innerHTML = "";
  document.body.appendChild(container);
}