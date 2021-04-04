
require('dotenv').config();
const config = require('./app/configs/configs')();
const express = require('express');
const joi = require('joi');
var passport = require('passport');

// Require DI
const serviceLocator = require('./app/configs/di');
const validator = require('./app/lib/validator');
const handler = require('./app/lib/error_handler');
const routes = require('./app/routes/routes');
const logger = serviceLocator.get('logger');

// Initialize and configure express server
const server = express({
  name: config.app.name,
  versions: ['1.0.0'],
  formatters: {
    'application/json': require('./app/lib/jsend')
  }
});

// Initialize the database
const Database = require('./app/configs/database');
new Database(null,null,null,config.mongo.connection_string);

// Set request handling and parsing
server.use(express.json());

server.use(passport.initialize());

// initialize validator for all requests
//server.use(validator.paramValidation(logger, joi));

// Setup Error Event Handling
handler.register(server);

// Setup route Handling
routes.register(server, serviceLocator);

// start server
server.listen(config.app.port, () => {
  console.log(`${config.app.name} Server is running on port -
    ${config.app.port}`);
});