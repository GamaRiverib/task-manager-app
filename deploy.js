const fs = require("fs");
const path = require("path");

// Ruta de la carpeta `public`
const publicDir = path.join(__dirname, "public");

// Archivos y carpetas necesarios para el despliegue
const filesToCopy = [
  { src: "app.js", dest: "app.js" },
  { src: "firebase-config.js", dest: "firebase-config.js" },
  { src: "firestore-service.js", dest: "firestore-service.js" },
  { src: "icon-192x192.png", dest: "icon-192x192.png" },
  { src: "icon-512x512.png", dest: "icon-512x512.png" },
  { src: "index.html", dest: "index.html" },
  { src: "main.js", dest: "main.js" },
  { src: "manifest.json", dest: "manifest.json" },
  { src: "navigation.js", dest: "navigation.js" },
  { src: "render.js", dest: "render.js" },
  { src: "service-worker.js", dest: "service-worker.js" },
  { src: "styles.css", dest: "styles.css" },
  { src: "views", dest: "views" }, // Carpeta completa
];

// Función para borrar el contenido de la carpeta `public`
function clearPublicFolder() {
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
    console.log("Carpeta 'public' borrada.");
  }
  fs.mkdirSync(publicDir);
  console.log("Carpeta 'public' creada.");
}

// Función para copiar archivos y carpetas
function copyFiles() {
  filesToCopy.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(publicDir, dest);

    if (fs.existsSync(srcPath)) {
      if (fs.lstatSync(srcPath).isDirectory()) {
        // Copiar carpeta completa
        copyFolderRecursiveSync(srcPath, destPath);
        console.log(`Carpeta copiada: ${src} -> ${dest}`);
      } else {
        // Copiar archivo
        fs.copyFileSync(srcPath, destPath);
        console.log(`Archivo copiado: ${src} -> ${dest}`);
      }
    } else {
      console.warn(`Advertencia: ${src} no existe y no se copiará.`);
    }
  });
}

// Función para copiar carpetas recursivamente
function copyFolderRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Ejecutar el script
clearPublicFolder();
copyFiles();
console.log("Archivos copiados a la carpeta 'public'.");