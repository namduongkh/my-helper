'use strict';
var _ = require('lodash');
var async = require('async');
const Wreck = require('wreck');
var fs = require('fs');
const mongoose = require('mongoose');
const UserFacebook = mongoose.model('UserFacebook');

exports.getGroups = {
    handler: function(request, reply) {
        let { fb_id } = request.payload;
        UserFacebook.findOne({
                fb_id: fb_id
            })
            .lean()
            .then(function(user) {
                return reply(user.groups);
            })
            .catch(function() {
                return reply([]);
            });
    }
};

exports.getFeeds = {
    handler: function(request, reply) {
        let { fb_id } = request.payload;
        UserFacebook.findOne({
                fb_id: fb_id
            })
            .lean()
            .then(function(user) {
                return reply(user.feeds);
            })
            .catch(function() {
                return reply([]);
            });
    }
};

exports.addGroup = {
    handler: function(request, reply) {
        let { fb_id, group_id, group_name } = request.payload;
        UserFacebook.findOne({
                fb_id: fb_id
            })
            .select("groups")
            .then(function(user) {
                if (!user) {
                    user = new UserFacebook({
                        fb_id: fb_id
                    });
                }
                if (!user.groups) {
                    user.groups = [];
                }
                user.groups.push({
                    id: group_id,
                    name: group_name
                });
                return user.save();
            })
            .then(function(user) {
                return reply(user.groups);
            })
            .catch(function(err) {
                console.log("err", err);
                return reply(false);
            });
    }
};

exports.addFeed = {
    handler: function(request, reply) {
        let { fb_id, message, link, name, feed_id } = request.payload;
        UserFacebook.findOne({
                fb_id: fb_id,
            })
            .select("feeds")
            .then(function(user) {
                if (!user) {
                    user = new UserFacebook({
                        fb_id: fb_id
                    });
                }
                if (!user.feeds) {
                    user.feeds = [];
                } else {
                    for (var i in user.feeds) {
                        var item = user.feeds[i];
                        if (item._id.toString() == feed_id) {
                            item.name = name;
                            item.message = message;
                            item.link = link;
                            // return reply(user.feeds);
                            return user.save();
                        }
                    }
                }
                user.feeds.push({
                    name: name,
                    message: message,
                    link: link
                });
                return user.save();
            })
            .then(function(user) {
                return reply(user.feeds);
            })
            .catch(function(err) {
                console.log("err", err);
                return reply(false);
            });
    }
};