import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "../firebase-config.js";

/**
 * Renderizar la pantalla de inicio de sesión
 */
export function renderLogin() {
  const container = document.createElement("div");
  container.className = "login-container";

  const form = document.createElement("form");
  form.className = "form login-form";

  const title = document.createElement("h2");
  title.textContent = "Iniciar Sesión";
  form.appendChild(title);

  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Correo Electrónico:";
  form.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Ingresa tu correo";
  emailInput.required = true;
  form.appendChild(emailInput);

  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Contraseña:";
  form.appendChild(passwordLabel);

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Ingresa tu contraseña";
  passwordInput.required = true;
  form.appendChild(passwordInput);

  const loginButton = document.createElement("button");
  loginButton.type = "submit";
  loginButton.textContent = "Iniciar Sesión";
  loginButton.className = "form-button login-button";
  form.appendChild(loginButton);

  const errorMessage = document.createElement("p");
  errorMessage.className = "error-message";
  errorMessage.style.display = "none";
  form.appendChild(errorMessage);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload(); // Recargar la página después de iniciar sesión
    } catch (error) {
      errorMessage.textContent = "Error al iniciar sesión: " + error.message;
      errorMessage.style.display = "block";
    }
  });

  container.appendChild(form);
  document.body.innerHTML = ""; // Limpiar el contenido previo
  document.body.appendChild(container);
}