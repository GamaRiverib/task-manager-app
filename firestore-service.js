import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

/**
 * @typedef {Object} Subtask
 * @property {string} title - Título de la subtarea
 * @property {string} description - Descripción de la subtarea
 * @property {boolean} completed - Estado de la subtarea (true si está terminada, false si no)
 */

/**
 * @typedef {Object} TaskDto
 * @property {string} id - ID de la tarea
 * @property {string} title - Título de la tarea
 * @property {string} dueDate - Fecha de vencimiento de la tarea (formato YYYY-MM-DD)
 * @property {string} status - Estado de la tarea (Pendiente, En progreso, Completada)
 * @property {string} priority - Prioridad de la tarea (Alta, Media, Baja)
 */

/**
 * @typedef {Object} Task
 * @property {string} id - ID de la tarea
 * @property {string} title - Título de la tarea
 * @property {string} description - Descripción de la tarea
 * @property {string} assignee - Persona asignada a la tarea
 * @property {string} dueDate - Fecha de vencimiento de la tarea (formato YYYY-MM-DD)
 * @property {string} status - Estado de la tarea (Pendiente, En progreso, Completada)
 * @property {string} priority - Prioridad de la tarea (Alta, Media, Baja)
 * @property {string} category - Categoría de la tarea
 * @property {string[]} tags - Etiquetas asociadas a la tarea
 * @property {string} createdAt - Fecha de creación de la tarea (formato YYYY-MM-DD)
 * @property {string|null} completedAt - Fecha de finalización de la tarea (formato YYYY-MM-DD) o null si no está completada
 * @property {string[]} comments - Comentarios asociados a la tarea
 * @property {Subtask[]} subtasks - Lista de subtareas asociadas a la tarea
 * @property {number} progress - Progreso de la tarea (0-100%)
 * @property {string[]} attachments - Archivos adjuntos a la tarea
 * @property {string} notes - Notas adicionales sobre la tarea
 */

/**
 * @typedef {Object} Category
 * @property {string} name - Nombre de la categoría
 */

/**
 * @typedef {Object} Project
 * @property {string} id - ID del proyecto
 * @property {string} name - Nombre del proyecto
 * @property {string} description - Descripción del proyecto
 * @property {Category[]} categories - Lista de categorías asociadas al proyecto
 */

/**
 * Enumerador para los estatus de las tareas
 */
export const TaskStatus = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Proceso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  DELAYED: "Retrasada",
  ON_HOLD: "En Espera",
  TO_SCHEDULE: "A Programar",
  IN_VALIDATION: "En Validación",
  APPROVED: "Aprobada",
  FUTURE_TASK: "Tarea Futura",
};

/**
 * Enumerador para las prioridades de las tareas
 */
export const TaskPriority = {
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
};

/**
 * Obtener proyectos del usuario autenticado
 * @returns {Promise<Project[]>} Lista de proyectos
 */
export async function getProjects() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const projectsCollection = collection(db, `users/${user.uid}/projects`);
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Crear un nuevo proyecto
 * @param {Omit<Project, "id">} projectData
 * @returns {Promise<Project>} Proyecto guardado
 * @throws {Error} Si ocurre un error al guardar el proyecto
 */
export async function createProject(projectData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const projectsCollection = collection(db, `users/${user.uid}/projects`);
  const docRef = await addDoc(projectsCollection, projectData);
  return { id: docRef.id, ...projectData };
}

/**
 * Actualizar un proyecto existente
 * @param {Project} projectData
 */
export async function updateProject(projectData) {
  const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectData.id);
  await updateDoc(projectDoc, projectData);
}

/**
 * Obtener tareas de un proyecto
 * @param {string} projectId
 * @returns {Promise<TaskDto[]>} Lista de tareas del proyecto
 */
export async function getTasks(projectId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const tasksCollection = collection(db, `users/${user.uid}/projects/${projectId}/tasks`);
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Obtener una tarea específica
 * @param {string} projectId
 * @param {string} taskId
 * @returns {Promise<Task|null>} Tarea encontrada o null si no existe
 */
export async function getTask(projectId, taskId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const taskDoc = doc(db, `users/${user.uid}/projects/${projectId}/tasks`, taskId);
  const snapshot = await getDoc(taskDoc);
  return snapshot.exists()
    ? {
        id: snapshot.id,
        title: snapshot.data().title || "",
        description: snapshot.data().description || "",
        assignee: snapshot.data().assignee || "",
        dueDate: snapshot.data().dueDate || "",
        status: snapshot.data().status || TaskStatus.PENDING,
        priority: snapshot.data().priority || TaskPriority.MEDIUM,
        category: snapshot.data().category || "",
        tags: snapshot.data().tags || [],
        createdAt: snapshot.data().createdAt || "",
        completedAt: snapshot.data().completedAt || null,
        comments: snapshot.data().comments || [],
        subtasks: snapshot.data().subtasks || [],
        progress: snapshot.data().progress || 0,
        attachments: snapshot.data().attachments || [],
        notes: snapshot.data().notes || "",
      }
    : null;
}

/**
 * Crear una nueva tarea
 * @param {string} projectId
 * @param {Omit<Task, "id">} taskData
 * @returns {Promise<Task>} Tarea guardada
 * @throws {Error} Si ocurre un error al guardar la tarea
 */
export async function createTask(projectId, taskData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const tasksCollection = collection(db, `users/${user.uid}/projects/${projectId}/tasks`);
  const docRef = await addDoc(tasksCollection, taskData);
  return { id: docRef.id, ...taskData };
}

/**
 * Actualizar una tarea existente
 * @param {string} projectId
 * @param {Task} taskData
 */
export async function updateTask(projectId, taskData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const taskDoc = doc(db, `users/${user.uid}/projects/${projectId}/tasks`, taskData.id);
  await updateDoc(taskDoc, taskData);
}

/**
 * Eliminar una tarea
 * @param {string} projectId
 * @param {string} taskId
 */
export async function deleteTask(projectId, taskId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const taskDoc = doc(db, `users/${user.uid}/projects/${projectId}/tasks`, taskId);
  await deleteDoc(taskDoc);
}
