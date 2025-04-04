// @ts-check

/**
 * @typedef {Object} Subtask
 * @property {string} title - Título de la subtarea
 * @property {string} description - Descripción de la subtarea
 * @property {boolean} completed - Estado de la subtarea (true si está terminada, false si no)
 */

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
 * @property {Subtask[]} subtasks - Lista de subtareas asociadas a la tarea
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

export const projects = [
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
            status: TaskStatus.PENDING, // Usar el enumerador
            priority: TaskPriority.HIGH, // Usar el nuevo enumerador
            category: "Categoría 1",
            tags: ["importante", "urgente"],
            createdAt: "2025-04-01",
            completedAt: null,
            comments: ["Revisar antes del viernes", "Confirmar con el cliente"],
            subtasks: [
              { title: "Subtarea 1.1.1", description: "Descripción de la subtarea 1.1.1", completed: false },
              { title: "Subtarea 1.1.2", description: "Descripción de la subtarea 1.1.2", completed: false },
            ],
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
            status: TaskStatus.IN_PROGRESS, // Usar el enumerador
            priority: TaskPriority.MEDIUM, // Usar el nuevo enumerador
            category: "Categoría 1",
            tags: ["revisión"],
            createdAt: "2025-04-02",
            completedAt: null,
            comments: ["Pendiente de aprobación"],
            subtasks: [
              { title: "Subtarea 1.2.1", description: "Descripción de la subtarea 1.2.1", completed: false },
            ],
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
            status: TaskStatus.COMPLETED, // Usar el enumerador
            priority: TaskPriority.LOW, // Usar el nuevo enumerador
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
            status: TaskStatus.TO_SCHEDULE, // Usar el enumerador
            priority: TaskPriority.HIGH, // Usar el nuevo enumerador
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
