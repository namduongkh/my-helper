'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const Winning = mongoose.model('Winning');

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

exports.getWinningPosition = {
    handler: function(request, reply) {
        Winning.find({
                position: 0
            })
            .sort("date")
            .lean()
            .then(function(numbers) {
                numbers = _.map(numbers, function(item, key) {
                    if (key > 0) {
                        item.diff = item.number - numbers[key - 1].number;
                    } else {
                        item.diff = 0;
                    }
                    return item;
                });
                return reply(numbers);
            })
            .catch(function(err) {
                console.log("Err", err);
                return reply("Error");
            });
    }
};