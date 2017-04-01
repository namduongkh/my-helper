'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');
const Vision = require('vision');
const Glob = require("glob");

global.BASE_PATH = __dirname;

var assets = {
    js: [
        '/libs/angular/angular.min.js',
        '/js/app.js'
    ]
}

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({
    port: 3000,
    host: 'localhost'
});

server.register(Vision, (err) => {
    server.views({
        engines: {
            html: require('handlebars'),
        },
        helpersPath: global.BASE_PATH + '/helpers',
        context: { assets: assets },
        relativeTo: global.BASE_PATH + '/modules',
        // partialsPath: global.BASE_PATH + '/app/layouts/partials',
        layoutPath: global.BASE_PATH + '/layouts',
        layout: true,
        context: {
            assets: assets,
            meta: {
                title: 'Helper'
            }
        }
    });
});

// server.register(require(Path.resolve("./route.js")), {}, (err) => {
//     if (err) {
//         server.log(['error', 'server'], err);
//     }
// });

let modules = [];
let modulesName = Glob.sync(BASE_PATH + "/modules/*/index.js", {});
modulesName.forEach((item) => {
    modules.push(require(Path.resolve(`${item}`)));
});

server.register(modules, (err) => {
    if (err) {
        server.log(['error', 'server'], err);
    }
});

server.register([{
    register: require('./static.js')
}], (err) => {
    if (err) {
        server.log(['error', 'server'], err);
    }
});

server.register(require('inert'), (err) => {
    if (err) {
        server.log(['error', 'server'], err);
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});