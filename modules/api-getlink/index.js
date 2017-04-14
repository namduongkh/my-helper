'use strict';

const Controller = require("./controllers/getlink.controller.js");
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


    server.route({
        method: 'POST',
        path: '/api/getlink/getImage',
        config: Controller.getImage
    });

    next();
};

exports.register.attributes = {
    name: 'api-getlink',
}