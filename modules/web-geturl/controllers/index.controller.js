'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const Winning = mongoose.model('Winning');

exports.index = {
    handler: function(request, reply) {
        // Wreck.get('http://thiendia.com/diendan/threads/loan-luan-devoted-with-sister-d2h.1003731/', (err, res, payload) => {
        //     if (err) {
        //         console.log("err", err);
        //     } else {
        //         console.log("p", payload.toString('utf8'));
        //     }
        // });
        return reply.view("web-geturl/views/index", { meta: { title: 'Index' }, active_menu: 'geturl' });
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

// exports.convertWinning = {
//     handler: function(request, reply) {
//         let winnings = require("./winning.json");
//         _.forEach(winnings, function(item) {
//             let date = new Date(item.date.replace(/(\d+)\/(\d+)\/(\d+)/g, function(str, s1, s2, s3) {
//                 return s2 + "/" + s1 + "/" + s3;
//             }));

//             let numbers = item.winning.split(",");
//             _.forEach(numbers, function(item, index) {
//                 let winning = new Winning({
//                     date: date,
//                     number: Number(item),
//                     position: index
//                 });
//                 winning.save();
//             });
//             // console.log("Date", date);
//         });
//         reply();
//     }
// };