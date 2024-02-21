import { envs } from './helpers/envs.js';
import { app } from './app.js';
import { swaggerDocs as V1SwaggerDocs } from './helpers/swagger.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Initiating server...');

// Server configurations
const { PORT } = envs;

// Server loop
app.listen(PORT, () => {
  console.log(`✅ Server up and running -> Port ${PORT}\n`);

  V1SwaggerDocs(app, PORT);
});
