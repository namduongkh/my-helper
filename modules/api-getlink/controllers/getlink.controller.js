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
        user: 'openness.sender.email@gmail.com',
        pass: 'phongnguyen.94'
    }
});

function getHtml(url) {
    return new Promise(function(rs, rj) {
        Wreck.get(url, (err, res, payload) => {
            if (err) {
                rj(err);
            } else {
                let html = payload.toString('utf8')
                    .replace(/\n/g, "")
                    // .replace(/\s/g, " ")
                    .replace(/>[\s]*</g, "><");
                // console.log("Html", html);
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

var not_allow_link = [".css", ".jpeg", ".jpg", ".png", ".js", ".ico", ".xml", ".php"];

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
            from: 'openness.sender.email@gmail.com', // sender address
            to: email, // list of receivers
            subject: title, // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return reply({ status: false });
            } else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                return reply({ status: true });
            }
        });

    }
};

exports.publishMany = {
    handler: function(request, reply) {
        let { contents, email } = request.payload;
        // console.log("html", html);
        // setup email data with unicode symbols

        let parallel = [];
        _.map(contents, function(item) {
            parallel.push(function(cb) {
                let { image, title } = item;
                let mailOptions = {
                    from: 'namduong.kh94@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: title, // Subject line
                    html: image // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    }
                    cb(null, "Success!");
                });
            });
        });

        async.series(parallel, function(err, results) {
            return reply("Sent!");
        });
    }
};

function _getImage(url) {
    return new Promise(function(rs, rj) {
        getHtml(url)
            .then(function(html) {
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
                if (!img) {
                    return rj();
                }
                return rs({
                    image: img,
                    title: _.upperFirst(title.replace("Truyện Hentai Mau 9x", ""))
                });
            })
            .catch(function(err) {
                console.log("err", err);
                return rj(err);
            });
    });
}

exports.getImage = {
    handler: function(request, reply) {
        _getImage(request.payload.url)
            .then(function(result) {
                return reply({
                    status: true,
                    content: result
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

exports.getContent = {
    handler: function(request, reply) {
        getHtml(request.payload.url)
            .then(function(html) {
                let content = "";
                let title;
                html
                    .replace(/<script((?!<script).)*<\/script>/g, function(str) {
                        return "";
                    })
                    .replace(/onclick="[^"]+"/g, "")
                    .replace(/<title>([^"]+)<\/title>/g, function(str, s1) {
                        title = s1;
                        return str;
                    })
                    .replace(/<body.*>([^]+)<\/body>/g, function(str, s1) {
                        content = s1;
                        return str;
                    });
                // console.log("HTML", img);
                if (!content) {
                    return reply({
                        status: false
                    });
                }
                return reply({
                    status: true,
                    title: _.upperFirst(title),
                    content: content
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

exports.getImageManyLink = {
    handler: function(request, reply) {
        let { list_url } = request.payload;
        if (list_url && list_url.length) {
            let parallel = [];
            _.map(list_url, function(url) {
                parallel.push(function(next) {
                    _getImage(url)
                        .then(function(result) {
                            next(null, result);
                        })
                        .catch(function(err) {
                            console.log("err", err);
                            next(err);
                        });
                });
            });
            async.parallel(parallel, function(err, results) {
                results = _.filter(results, function(item) {
                    if (item) {
                        return item;
                    }
                });
                return reply({
                    status: true,
                    contents: results
                });
            });
        } else {
            return reply({
                status: false
            });
        }
    }
};