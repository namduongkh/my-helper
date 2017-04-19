'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const Winning = mongoose.model('Winning');

exports.index = {
    handler: function(request, reply) {
        return reply.view("web-getlink/views/index", { meta: { title: 'Index' } });
    }
};

exports.getImage = {
    handler: function(request, reply) {
        return reply.view("web-getlink/views/get-image", {
            meta: { title: 'Get image from link' },
            active_menu: 'getimage',
            view_data: Object.assign({}, request.query)
        });
    }
};

exports.testIframe = {
    handler: function(request, reply) {
        return reply.view("web-getlink/views/test-iframe", { meta: { title: 'Test iframe' }, active_menu: 'testiframe' });
    }
};

exports.getLink = {
    handler: function(request, reply) {
        return reply.view("web-getlink/views/get-link", {
            meta: { title: 'Get link' },
            active_menu: 'getlink',
            view_data: Object.assign({}, request.query)
        });
    }
};

exports.getContent = {
    handler: function(request, reply) {
        return reply.view("web-getlink/views/get-content", {
            meta: { title: 'Get content' },
            active_menu: 'getcontent',
            view_data: Object.assign({}, request.query)
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