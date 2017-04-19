'use strict';

const Good = require('good');
const Path = require('path');
const Vision = require('vision');
const Glob = require("glob");

var assets = {
    js: [
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
};

module.exports = function(server) {
    server.register([{
        register: Vision
    }, {
        register: require('inert')
    }, {
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
    }, {
        register: require('./static.js')
    }, {
        register: require('./mongo.js')
    }], (err) => {
        if (err) {
            server.log(['error', 'server'], err);
        }


        server.views({
            engines: {
                // html: require('handlebars'),
                html: require('./nunjucks-hapi'),
            },
            // helpersPath: global.BASE_PATH + '/helpers',
            relativeTo: global.BASE_PATH + '/app/modules',
            // partialsPath: global.BASE_PATH + '/layouts/partials',
            // layoutPath: global.BASE_PATH + '/layouts',
            // layout: true,
            context: {
                assets: assets,
                meta: {
                    title: 'Helper'
                }
            }
        });

        let models = Glob.sync(BASE_PATH + "/app/modules/*/model/*.js", {});
        models.forEach((item) => {
            // console.log("Model", item);
            require(Path.resolve(item));
        });

        server.connections.forEach(function(connectionSetting) {
            let labels = connectionSetting.settings.labels;
            labels.forEach(name => {
                let modules = [];
                let modulesName = Glob.sync(BASE_PATH + `/app/modules/${name}-*/index.js`, {});
                modulesName.forEach((item) => {
                    modules.push(require(Path.resolve(`${item}`)));
                });
                if (modules.length) {
                    server.register(modules, { select: [name] }, (err) => {
                        if (err) {
                            server.log(['error', 'server'], err);
                        }
                    });
                }
            });
        })
    });
};