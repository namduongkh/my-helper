'use strict';

const Controller = require("./controllers/index.controller.js");
const path = require('path');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/test-graph',
        config: Controller.testGraph
    });
    next();
};

exports.register.attributes = {
    name: 'web-graph',
}