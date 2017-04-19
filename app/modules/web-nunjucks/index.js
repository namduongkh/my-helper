'use strict';

const Controller = require("./controllers/nunjucks.controller.js");

exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        config: Controller.nunjucks1
    });

    server.route({
        method: 'GET',
        path: '/web/index',
        config: Controller.nunjucks1
    });

    next();
};

exports.register.attributes = {
    name: 'web-nunjucks',
}