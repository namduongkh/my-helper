'use strict';

const Controller = require("./controllers/jackpot.controller.js");
const path = require('path');

exports.register = function(server, options, next) {

    server.route({
        method: 'GET',
        path: '/jackpot',
        config: Controller.jackpot
    });

    server.route({
        method: 'GET',
        path: '/convertWinning',
        config: Controller.convertWinning
    });

    server.route({
        method: 'GET',
        path: '/api/jackpot/getWinningPosition',
        config: Controller.getWinningPosition
    });

    next();
};

exports.register.attributes = {
    name: 'web-jackpot',
}