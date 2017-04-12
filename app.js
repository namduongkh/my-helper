'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');
const Vision = require('vision');
const Glob = require("glob");

global.BASE_PATH = __dirname;

var assets = {
    js: [
        '/libs/jquery/dist/jquery.min.js',
        '/libs/angular/angular.min.js',
        '/template/js/jquery.js',
        '/template/js/bootstrap.min.js',
        // '/template/js/plugins/morris/raphael.min.js',
        // '/template/js/plugins/morris/morris.min.js',
        // '/template/js/plugins/morris/morris-data.js',
        '/libs/clipboard/dist/clipboard.min.js',
        '/libs/ngclipboard/dist/ngclipboard.min.js',
        '/dist/main.js',
    ],
    css: [
        '/dist/main.css',
        '/template/css/bootstrap.min.css',
        '/template/css/sb-admin.css',
        // '/template/css/plugins/morris.css',
        '/template/font-awesome/css/font-awesome.min.css',
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
        partialsPath: global.BASE_PATH + '/layouts/partials',
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

server.register([{
    register: require('./static.js')
}, {
    register: require('./mongo.js')
}], (err) => {
    if (err) {
        server.log(['error', 'server'], err);
    }
});

// server.register(require(Path.resolve("./route.js")), {}, (err) => {
//     if (err) {
//         server.log(['error', 'server'], err);
//     }
// });


let models = Glob.sync(BASE_PATH + "/modules/*/model/*.js", {});
models.forEach((item) => {
    // console.log("Model", item);
    require(Path.resolve(item));
});

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