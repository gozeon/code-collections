import express from 'express';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to dynamically import all route files
const loadRoutes = async (dir) => {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      await loadRoutes(fullPath);
    } else if (file.endsWith('.mjs')) {
      const routeUrl = pathToFileURL(fullPath).href;
      const { default: route } = await import(routeUrl);
      route(app);
    }
  }
};

// Load routes from the 'routes' directory
await loadRoutes(join(__dirname, 'routes'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});