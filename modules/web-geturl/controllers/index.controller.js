'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');

exports.index = {
    handler: function(request, reply) {
        Wreck.get('http://thiendia.com/diendan/threads/loan-luan-devoted-with-sister-d2h.1003731/', (err, res, payload) => {
            if (err) {
                console.log("err", err);
            } else {
                console.log("p", payload.toString('utf8'));
            }
        });
        return reply.view("web-geturl/views/index", { meta: { title: 'Index' } });
    }
};