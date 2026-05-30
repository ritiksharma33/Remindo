const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Remindo AI API",
      version: "1.0.0",
      description: "AI-powered memory and learning backend"
    },

    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  

  apis: [
    "./src/routes/*.js"
  ]
};


const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;