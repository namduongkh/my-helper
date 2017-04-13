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

function getHtml(url) {
    return new Promise(function(rs, rj) {
        Wreck.get(url, (err, res, payload) => {
            if (err) {
                rj(err);
            } else {
                let html = payload.toString('utf8').replace(/\n/g, "");
                rs(html);
            }
        });
    });
}

function getHost(url) {
    return url.replace(/http[s]*:\/\/.+\//gi, function(str) {
        return str;
    });
}

exports.getLink = {
    handler: function(request, reply) {
        let { url } = request.payload;
        let host = getHost(url);
        getHtml(url)
            .then(function(html) {
                let href = [];
                html.replace(/href="([^"]+)\/([^".]+)"/g, function(str, s1, s2) {
                    let link = s1 + "/" + s2
                    if (str.search(host) > -1 && href.indexOf(link) == -1) {
                        href.push(link);
                    }
                });
                return reply({
                    status: true,
                    href: href
                });
            })
            .catch(function(err) {
                console.log("err", err);
                return reply({
                    status: false
                });
            });
    }
};

exports.publish = {
    handler: function(request, reply) {
        let { html, title, email } = request.payload;
        // console.log("html", html);
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'namduong.kh94@gmail.com', // sender address
            to: email, // list of receivers
            subject: title, // Subject line
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