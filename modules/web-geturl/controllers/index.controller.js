'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');

exports.index = {
    handler: function(request, reply) {
        // Wreck.get('http://thiendia.com/diendan/threads/loan-luan-devoted-with-sister-d2h.1003731/', (err, res, payload) => {
        //     if (err) {
        //         console.log("err", err);
        //     } else {
        //         console.log("p", payload.toString('utf8'));
        //     }
        // });
        return reply.view("web-geturl/views/index", { meta: { title: 'Index' } });
    }
};

exports.getImage = {
    handler: function(request, reply) {
        Wreck.get(request.payload.url, (err, res, payload) => {
            if (err) {
                console.log("err", err);
                return reply({
                    status: false,
                    msg: "Error!"
                });
            } else {
                // console.log("p", payload.toString('utf8'));
                let html = payload.toString('utf8');
                let img = "";
                let title;
                html.replace(/<title>([^"]+)<\/title>/g, function(str, s1) {
                        title = s1;
                        return str;
                    })
                    .replace(/<img[^>]*src="([^"]+)"[^>]*>/g, function(str, s1) {
                        if ((s1.search('.jpg') > -1 ||
                                s1.search('.png') > -1 ||
                                s1.search('.jpeg') > -1) &&
                            s1.search('http') > -1) {
                            img += str;
                        }
                        return str;
                    });
                // console.log("HTML", img);
                return reply({
                    status: true,
                    content: {
                        image: img,
                        title: title
                    }
                });
            }
        });
    }
};