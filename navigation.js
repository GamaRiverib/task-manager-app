// @ts-check

export function updateURL(params) {
  const url = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
}

/**
 *
 * @param {import("./data").Project[]} projects
 * @param {import("./render").RenderFunctions} renderFunctions
 * @returns {void}
 */
export function handleNavigation(projects, renderFunctions) {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  const projectId = params.get("projectId");
  const taskId = params.get("taskId");

  if (page === "projectDetails" && projectId) {
    const project = projects.find((p) => p.id === parseInt(projectId, 10));
    if (project) {
      renderFunctions.renderProjectDetails(projects, project);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === "addProject") {
    renderFunctions.renderAddProjectForm(projects);
  } else if (page === "addCategory" && projectId) {
    const project = projects.find((p) => p.id === parseInt(projectId, 10));
    if (project) {
      renderFunctions.renderAddCategoryForm(projects, project);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === "addTask" && projectId) {
    const project = projects.find((p) => p.id === parseInt(projectId, 10));
    if (project) {
      renderFunctions.renderAddTaskForm(projects, project);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === "taskDetails" && projectId && taskId) {
    const project = projects.find((p) => p.id === parseInt(projectId, 10));
    if (project) {
      const task = project.categories
        .flatMap((category) => category.tasks)
        .find((t) => t.id === parseInt(taskId, 10));
      if (task) {
        renderFunctions.renderTaskDetails(projects, project, task);
      } else {
        renderFunctions.renderProjectDetails(projects, project);
      }
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else {
    renderFunctions.renderProjects(projects);
  }
}
