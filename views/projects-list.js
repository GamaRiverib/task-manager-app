// @ts-check

import { updateURL } from "../navigation.js";
import { renderProjectDetails } from "./project-details.js";
import { renderAddProjectForm } from "./add-project-form.js";

/**
 * Función para renderizar la lista de proyectos
 * @param {import("../firestore-service.js").Project[]} projects - Lista de proyectos a renderizar
 */
export function renderProjects(projects) {
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