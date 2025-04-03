// @ts-check

/**
 * @typedef {Object} Task
 * @property {number} id - ID de la tarea
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
 * @property {string[]} subtasks - Subtareas asociadas a la tarea
 * @property {number} progress - Progreso de la tarea (0-100%)
 * @property {string[]} attachments - Archivos adjuntos a la tarea
 * @property {string} notes - Notas adicionales sobre la tarea
 */

/**
 * @typedef {Object} Category
 * @property {string} name - Nombre de la categoría
 * @property {Task[]} tasks - Lista de tareas asociadas a la categoría
 */

/**
 * @typedef {Object} Project
 * @property {number} id - ID del proyecto
 * @property {string} name - Nombre del proyecto
 * @property {string} description - Descripción del proyecto
 * @property {Category[]} categories - Lista de categorías asociadas al proyecto
 */

export // Datos de muestra
const projects = [
  {
    id: 1,
    name: "Proyecto A",
    description: "Descripción del Proyecto A",
    categories: [
      {
        name: "Categoría 1",
        tasks: [
          {
            id: 101,
            title: "Tarea 1.1",
            description: "Descripción de la tarea 1.1",
            assignee: "Juan Pérez",
            dueDate: "2025-04-10",
            status: "Pendiente",
            priority: "Alta",
            category: "Categoría 1",
            tags: ["importante", "urgente"],
            createdAt: "2025-04-01",
            completedAt: null,
            comments: ["Revisar antes del viernes", "Confirmar con el cliente"],
            subtasks: ["Subtarea 1.1.1", "Subtarea 1.1.2"],
            progress: 0,
            attachments: ["archivo1.pdf", "imagen1.png"],
            notes: "Esta tarea es prioritaria.",
          },
          {
            id: 102,
            title: "Tarea 1.2",
            description: "Descripción de la tarea 1.2",
            assignee: "Ana López",
            dueDate: "2025-04-12",
            status: "En progreso",
            priority: "Media",
            category: "Categoría 1",
            tags: ["revisión"],
            createdAt: "2025-04-02",
            completedAt: null,
            comments: ["Pendiente de aprobación"],
            subtasks: ["Subtarea 1.2.1"],
            progress: 50,
            attachments: [],
            notes: "Revisar avances con el equipo.",
          },
        ],
      },
      {
        name: "Categoría 2",
        tasks: [
          {
            id: 103,
            title: "Tarea 2.1",
            description: "Descripción de la tarea 2.1",
            assignee: "Carlos Gómez",
            dueDate: "2025-04-15",
            status: "Completada",
            priority: "Baja",
            category: "Categoría 2",
            tags: ["finalizado"],
            createdAt: "2025-03-28",
            completedAt: "2025-04-03",
            comments: ["Buen trabajo"],
            subtasks: [],
            progress: 100,
            attachments: ["reporte-final.pdf"],
            notes: "Tarea completada sin problemas.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Proyecto B",
    description: "Descripción del Proyecto B",
    categories: [
      {
        name: "Categoría 1",
        tasks: [
          {
            id: 201,
            title: "Tarea 1.1",
            description: "Descripción de la tarea 1.1 en Proyecto B",
            assignee: "Luis Martínez",
            dueDate: "2025-04-20",
            status: "Pendiente",
            priority: "Alta",
            category: "Categoría 1",
            tags: ["urgente"],
            createdAt: "2025-04-03",
            completedAt: null,
            comments: [],
            subtasks: [],
            progress: 0,
            attachments: [],
            notes: "Requiere atención inmediata.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Proyecto C",
    description: "Descripción del Proyecto C",
    categories: [],
  },
];
