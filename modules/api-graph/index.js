'use strict';

const Controller = require("./controllers/graph.controller.js");
const path = require('path');

exports.register = function(server, options, next) {

    server.route({
        method: 'POST',
        path: '/api/graph/getGroups',
        config: Controller.getGroups
    });

    server.route({
        method: 'POST',
        path: '/api/graph/getFeeds',
        config: Controller.getFeeds
    });

    server.route({
        method: 'POST',
        path: '/api/graph/addGroup',
        config: Controller.addGroup
    });

    server.route({
        method: 'POST',
        path: '/api/graph/addFeed',
        config: Controller.addFeed
    });

    next();
};

exports.register.attributes = {
    name: 'api-graph',
}