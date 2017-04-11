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
        path: '/add-winning',
        config: Controller.addWinning
    });

    server.route({
        method: 'post',
        path: '/api/jackpot/getWinningPosition',
        config: Controller.getWinningPosition
    });

    server.route({
        method: 'post',
        path: '/api/jackpot/addWinningApi',
        config: Controller.addWinningApi
    });

    server.route({
        method: 'get',
        path: '/api/jackpot/getWinningDiff',
        config: Controller.getWinningDiff
    });

    next();
};

exports.register.attributes = {
    name: 'web-jackpot',
}