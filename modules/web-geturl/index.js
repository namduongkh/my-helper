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
        method: 'GET',
        path: '/test-iframe',
        config: Controller.testIframe
    });

    server.route({
        method: 'POST',
        path: '/api/publish',
        config: Controller.publish
    });

    server.route({
        method: 'GET',
        path: '/get-link',
        config: Controller.getLink
    });

    next();
};

exports.register.attributes = {
    name: 'web-geturl',
}