'use strict';

const path = require('path');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: function(request, reply) {
            return reply.file(request.params.param);
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'app-static',
    dependencies: 'inert'
};