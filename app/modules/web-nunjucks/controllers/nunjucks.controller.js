'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
var nunjucks = require('nunjucks');

nunjucks.configure(__dirname);

exports.nunjucks1 = {
    handler: function(request, reply) {
        return reply.view("web-nunjucks/views/example.html", {
            name: "Phong Nguyễn",
            meta: { title: "Phong Nguyễn" }
        });
    }
};