# Project Task Manager

**Project Task Manager** es una aplicación web diseñada para gestionar proyectos y tareas de manera eficiente. Permite a los usuarios autenticarse, crear proyectos, agregar tareas, subtareas y realizar un seguimiento del progreso de cada tarea. La aplicación está integrada con Firebase para manejar la autenticación, la base de datos y el hosting.

---

## **Características principales**

- **Autenticación de usuarios**: Inicio de sesión con correo electrónico y contraseña utilizando Firebase Authentication.
- **Gestión de proyectos**: Crear, editar y eliminar proyectos.
- **Gestión de tareas**: Agregar, editar y eliminar tareas dentro de proyectos.
- **Subtareas**: Crear subtareas asociadas a una tarea y realizar un seguimiento de su progreso.
- **Progreso de tareas**: Actualización automática del progreso basado en el estado de las subtareas.
- **Breadcrumbs**: Navegación jerárquica para facilitar la experiencia del usuario.
- **Despliegue en Firebase Hosting**: La aplicación está optimizada para ser desplegada en Firebase Hosting.

---

## **Estructura del proyecto**

### **Carpetas principales**

- **`views/`**: Contiene las vistas principales de la aplicación, como detalles de proyectos y tareas.
- **`styles.css`**: Archivo de estilos para la interfaz de usuario.
- **`firebase-config.js`**: Configuración de Firebase para la autenticación y Firestore.
- **`firestore-service.js`**: Funciones para interactuar con Firestore (CRUD de proyectos, tareas y subtareas).
- **`public/`**: Carpeta utilizada para el despliegue en Firebase Hosting.

---

## **Especificaciones técnicas**

### **Tecnologías utilizadas**

- **Frontend**:
  - HTML5, CSS3 y JavaScript (ES6+).
  - Diseño responsivo para adaptarse a diferentes dispositivos.
  - Navegación dinámica utilizando JavaScript.

- **Backend**:
  - Firebase Authentication: Manejo de usuarios autenticados.
  - Firebase Firestore: Base de datos NoSQL para almacenar proyectos, tareas y subtareas.
  - Firebase Hosting: Despliegue de la aplicación.

### **Estructura de Firestore**

```
users (colección)
└── userId (documento)
      └── projects (colección)
          └── projectId (documento)
              └── tasks (subcolección)
                  └── taskId (documento)
                      └── subtasks (campo array)
```

### **Reglas de seguridad de Firestore**

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso solo a los datos del usuario autenticado
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Subcolección de proyectos
      match /projects/{projectId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        // Subcolección de tareas dentro de un proyecto
        match /tasks/{taskId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}
```

---

## **Instalación y configuración**

### **Requisitos previos**

- Node.js instalado en tu sistema.
- Cuenta de Firebase y un proyecto configurado.

### **Pasos para configurar el proyecto**

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-repositorio/project-task-manager.git
   cd project-task-manager
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Firebase**:
   - Crea un archivo `firebase-config.js` en la raíz del proyecto con la configuración de Firebase:
     ```javascript
     import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
     import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
     import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

     const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     export const auth = getAuth(app);
     ```

4. **Iniciar Firebase Emulators (opcional)**:
   ```bash
   firebase emulators:start
   ```

5. **Desplegar en Firebase Hosting**:
   - Limpia la carpeta `public` y copia los archivos necesarios:
     ```bash
     node deploy.js
     ```
   - Despliega la aplicación:
     ```bash
     firebase deploy
     ```

---

## **Uso de la aplicación**

1. **Inicio de sesión**:
   - Los usuarios deben autenticarse con su correo electrónico y contraseña.

2. **Gestión de proyectos**:
   - Crear nuevos proyectos desde la vista principal.
   - Navegar a los detalles de un proyecto para ver las tareas asociadas.

3. **Gestión de tareas**:
   - Agregar tareas a un proyecto.
   - Editar tareas existentes y realizar un seguimiento de su progreso.

4. **Subtareas**:
   - Agregar subtareas a una tarea.
   - Marcar subtareas como completadas para actualizar automáticamente el progreso de la tarea.

---

## **Estilo y diseño**

- **Responsivo**: La aplicación está diseñada para adaptarse a diferentes tamaños de pantalla.
- **Breadcrumbs**: Navegación jerárquica para facilitar la experiencia del usuario.
- **Tabs**: Organización de la información de las tareas en pestañas (General, Seguimiento, Subtareas).

---

## **Contribuciones**

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agregar nueva funcionalidad'`).
4. Haz un push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## **Licencia**

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
```

---

### **Descripción del contenido**

- **Introducción**: Explica el propósito del proyecto y sus características principales.
- **Estructura del proyecto**: Describe las carpetas principales y su contenido.
- **Especificaciones técnicas**: Detalla las tecnologías utilizadas, la estructura de Firestore y las reglas de seguridad.
- **Instalación y configuración**: Proporciona instrucciones claras para configurar y desplegar el proyecto.
- **Uso de la aplicación**: Explica cómo interactuar con las funcionalidades principales.
- **Contribuciones**: Invita a otros desarrolladores a colaborar en el proyecto.
- **Licencia**: Indica la licencia bajo la cual se distribuye el proyecto.---

### **Descripción del contenido**

- **Introducción**: Explica el propósito del proyecto y sus características principales.
- **Estructura del proyecto**: Describe las carpetas principales y su contenido.
- **Especificaciones técnicas**: Detalla las tecnologías utilizadas, la estructura de Firestore y las reglas de seguridad.
- **Instalación y configuración**: Proporciona instrucciones claras para configurar y desplegar el proyecto.
- **Uso de la aplicación**: Explica cómo interactuar con las funcionalidades principales.
- **Contribuciones**: Invita a otros desarrolladores a colaborar en el proyecto.
- **Licencia**: Indica la licencia bajo la cual se distribuye el proyecto.