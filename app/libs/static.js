'use strict';

const path = require('path');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'app-static',
    dependencies: 'inert'
};