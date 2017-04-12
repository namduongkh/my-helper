'use strict';

const Controller = require("./controllers/index.controller.js");
const path = require('path');

exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        config: Controller.index
    });

    server.route({
        method: 'POST',
        path: '/getImage',
        config: Controller.getImage
    });

    server.route({
        method: 'POST',
        path: '/api/publish',
        config: Controller.publish
    });

    next();
};

exports.register.attributes = {
    name: 'web-geturl',
}