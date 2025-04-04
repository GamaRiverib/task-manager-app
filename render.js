// @ts-check

import { renderProjects } from "./views/projects-list.js";
import { renderAddProjectForm } from "./views/add-project-form.js";
import { renderProjectDetails } from "./views/project-details.js";
import { renderAddCategoryForm } from "./views/add-category-form.js";
import { renderAddTaskForm } from "./views/add-task-form.js";
import { renderTaskDetails } from "./views/task-details.js";

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
 * @type {RenderFunctions}
 */
export const renderFunctions = {
  renderProjects,
  renderAddProjectForm,
  renderProjectDetails,
  renderAddCategoryForm,
  renderAddTaskForm,
  renderTaskDetails,
};
