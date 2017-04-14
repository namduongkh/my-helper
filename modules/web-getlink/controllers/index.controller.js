'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const Winning = mongoose.model('Winning');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'namduong.kh94@gmail.com',
        pass: 'phongnguyen.94'
    }
});

exports.publish = {
    handler: function(request, reply) {
        let { html, title } = request.payload;
        // console.log("html", html);
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'namduong.kh94@gmail.com', // sender address
            // to: 'openness.newthinkingnewlife@gmail.com', // list of receivers
            to: 'openness.newthinkingnewlife.blog18@blogger.com', // list of receivers
            subject: title, // Subject line
            // text: html, // plain text body
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });

        return reply("Send!");
    }
};

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