// @ts-check

import { projects } from "./data.js";
import { handleNavigation } from "./navigation.js";
import { renderFunctions } from "./render.js";

window.addEventListener("popstate", () => handleNavigation(projects || [], renderFunctions));
document.addEventListener("DOMContentLoaded", () =>
  handleNavigation(projects || [], renderFunctions)
);
