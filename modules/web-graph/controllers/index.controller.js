'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');

exports.testGraph = {
    handler: function(request, reply) {
        return reply.view("web-graph/views/graph", { meta: { title: 'Graph' } });
    }
};