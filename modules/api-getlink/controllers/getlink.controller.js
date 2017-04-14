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
    let string;
    url.replace(/http[s]*:\/\/([^\/]+)\//gi, function(str, s1) {
        string = JSON.stringify({
            url: str,
            host: s1
        });
    });

    try {
        return JSON.parse(string);
    } catch (e) {
        return string;
    }
}

var not_allow_link = [".css", ".jpeg", ".jpg", ".png", ".js", ".ico"];

function handleReg(text) {
    return text.split("").map(function(char) {
            try {
                new RegExp(char);
                return char;
            } catch (e) {
                return "\\" + char;
            }
        })
        .join("");
}

exports.getLink = {
    handler: function(request, reply) {
        let { url, not_allow } = request.payload;
        not_allow = not_allow ? not_allow.split(",").map(function(item) { return item.trim(); }) : [];
        let host = getHost(url).host;
        getHtml(url)
            .then(function(html) {
                let href = [];
                html.replace(/href="([^"]+)([^"\/])\/([^"\/]+)"/g, function(str, s1, s2, s3) {
                    let valid = true;
                    let not_allow_concat = not_allow_link.concat(not_allow);
                    for (var i in not_allow_concat) {
                        if (s3.search(handleReg(not_allow_concat[i])) > -1) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        let link = s1 + s2 + "/" + s3;
                        if (str.search(host) > -1 && href.indexOf(link) == -1) {
                            href.push(link);
                        }
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
                // console.log("Payload", payload.toString('utf8'));
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
                            img += "<img src=" + s1 + " alt='Hình ảnh'/>";
                        }
                        return str;
                    });
                // console.log("HTML", img);
                return reply({
                    status: true,
                    content: {
                        image: img,
                        title: _.upperFirst(title)
                    }
                });
            }
        });
    }
};