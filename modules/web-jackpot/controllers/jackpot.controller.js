'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const Winning = mongoose.model('Winning');
var json2xls = require('json2xls');

exports.convertWinning = {
    handler: function(request, reply) {
        let winnings = require("./winning.json");
        _.forEach(winnings, function(item) {
            let date = new Date(item.date.replace(/(\d+)\/(\d+)\/(\d+)/g, function(str, s1, s2, s3) {
                return s2 + "/" + s1 + "/" + s3;
            }));

            let numbers = item.winning.split(",");
            _.forEach(numbers, function(item, index) {
                let winning = new Winning({
                    date: date,
                    number: Number(item),
                    position: index
                });
                winning.save();
            });
            // console.log("Date", date);
        });
        reply();
    }
};

exports.jackpot = {
    handler: function(request, reply) {
        return reply.view("web-jackpot/views/index", { meta: { title: 'Jackpot' }, active_menu: 'jackpot' });
    }
};

exports.addWinning = {
    handler: function(request, reply) {
        return reply.view("web-jackpot/views/add-winning", { meta: { title: 'Thêm winning' }, active_menu: 'add-winning' });
    }
};

exports.addWinningApi = {
    handler: function(request, reply) {
        let { number, date } = request.payload;
        let numbers = number.split(" ");
        numbers.map(function(item, key) {
            let options = {
                number: item,
                date: new Date(date),
                position: key
            };
            Winning.findOne(options).then(function(winning) {
                if (winning) {
                    console.log("Remove");
                    winning.remove();
                }
                new Winning(options).save().then(function() {});
            });
        });
        return reply("Success");
    }
};

exports.getWinningPosition = {
    handler: function(request, reply) {
        Winning.find({
                position: request.payload.position
            })
            .sort("date")
            .lean()
            .then(function(numbers) {
                numbers = _.uniqWith(_.map(numbers, function(item, key) {
                    item.number = Number(item.number);
                    if (key > 0) {
                        item.diff = Number(item.number) - Number(numbers[key - 1].number);
                    } else {
                        item.diff = 0;
                    }
                    return item;
                }), function(a, b) {
                    if (new Date(a.date).toDateString() == new Date(b.date).toDateString()) {
                        return a;
                    }
                });
                return reply(numbers);
            })
            .catch(function(err) {
                console.log("Err", err);
                return reply("Error");
            });
    }
};

exports.getWinningDiff = {
    handler: function(request, reply) {
        Winning.find({
                position: request.query.position
            })
            .sort("date")
            .lean()
            .then(function(numbers) {
                numbers = _.uniqWith(_.map(numbers, function(item, key) {
                    item.number = Number(item.number);
                    if (key > 0) {
                        item.diff = Number(item.number) - Number(numbers[key - 1].number);
                    } else {
                        item.diff = 0;
                    }
                    return item;
                }), function(a, b) {
                    if (new Date(a.date).toDateString() == new Date(b.date).toDateString()) {
                        return a;
                    }
                });

                var xls = json2xls(numbers);
                fs.writeFileSync('public/data.xlsx', xls, 'binary');
                return reply.file('data.xlsx');
            })
            .catch(function(err) {
                console.log("Err", err);
                return reply("Error");
            });
    }
};