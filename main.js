import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getProjects } from "./firestore-service.js";
import { handleNavigation } from "./navigation.js";
import { renderFunctions } from "./render.js";
import { renderLogin } from "./views/login.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario autenticado, renderizar la vista principal
    getProjects()
  .then((projects) => {
    window.addEventListener("popstate", () => handleNavigation(projects || [], renderFunctions));
    document.addEventListener("DOMContentLoaded", () =>
      handleNavigation(projects || [], renderFunctions)
    );
    handleNavigation(projects || [], renderFunctions);
  })
  .catch((error) => {
    console.error("Error fetching projects:", error);
  });
  } else {
    // Usuario no autenticado, mostrar la pantalla de inicio de sesión
    renderLogin();
  }
});


