import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Custodia de Archivos BE',
      version: '0.6.0',
      description: 'REST API for Custodia de Archivos',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/specs/*.spec.yaml'],
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app, port) => {
  app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs/v1/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(
    `📚 Version 1 Docs are available at http://localhost:${port}/api-docs/v1\n`,
  );
};
