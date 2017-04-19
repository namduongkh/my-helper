'use strict';
const mongoose = require('mongoose');

var db = {
    uri: 'mongodb://localhost/db_helper',
    options: {
        user: '',
        pass: ''
    }
};

exports.register = function(server, options, next) {

    let config = server.configManager;

    mongoose.connect(db.uri);
    mongoose.Promise = require('bluebird');
    require('mongoose-pagination');
    console.log('Register Mongo');
    next();

};

exports.register.attributes = {
    name: 'app-mongo'
};