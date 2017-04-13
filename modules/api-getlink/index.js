'use strict';

const Controller = require("./controllers/index.controller.js");
const path = require('path');

exports.register = function(server, options, next) {

    server.route({
        method: 'POST',
        path: '/api/getlink/getAllLink',
        config: Controller.getLink
    });

    server.route({
        method: 'POST',
        path: '/api/getlink/publish',
        config: Controller.publish
    });

    next();
};

exports.register.attributes = {
    name: 'api-getlink',
}