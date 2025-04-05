// @ts-check

export const PAGE_ID = {
  PROJECT_DETAILS: "projectDetails",
  ADD_PROJECT: "addProject",
  ADD_CATEGORY: "addCategory",
  ADD_TASK: "addTask",
  TASK_DETAILS: "taskDetails",
};

/**
 * @param {*} params 
 */
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
 * @param {import("./firestore-service").Project[]} projects
 * @param {import("./render").RenderFunctions} renderFunctions
 * @returns {void}
 */
export function handleNavigation(projects, renderFunctions) {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  const projectId = params.get("projectId");
  const taskId = params.get("taskId");
  if (page === PAGE_ID.PROJECT_DETAILS && projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      renderFunctions.renderProjectDetails(projects, project);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === PAGE_ID.ADD_PROJECT) {
    renderFunctions.renderAddProjectForm(projects);
  } else if (page === PAGE_ID.ADD_CATEGORY && projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      renderFunctions.renderAddCategoryForm(projects, project);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === PAGE_ID.ADD_TASK && projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      renderFunctions.renderAddTaskForm(projects, project, []);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else if (page === PAGE_ID.TASK_DETAILS && projectId && taskId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      renderFunctions.renderTaskDetails(projects, project, [], taskId);
    } else {
      renderFunctions.renderProjects(projects);
    }
  } else {
    renderFunctions.renderProjects(projects);
  }
}
