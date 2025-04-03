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

  if (page === "projectDetails" && projectId) {
    const project = projects.find((p) => p.id === parseInt(projectId, 10));
    if (project) {
      renderFunctions.renderProjectDetails(projects, project, renderFunctions);
    } else {
      renderFunctions.renderProjects(projects, renderFunctions);
    }
  } else if (page === "addProject") {
    renderFunctions.renderAddProjectForm(projects, renderFunctions);
  } else {
    renderFunctions.renderProjects(projects, renderFunctions);
  }
}
