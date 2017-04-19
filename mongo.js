'use strict';
const mongoose = require('mongoose');

var db = {
    uri: 'mongodb://localhost/db_helper',
    options: {
        user: '',
        pass: ''
    }
};
// var db = {
//     uri: 'mongodb://root:1@ds043952.mlab.com:43952/task-list',
//     options: {
//         user: 'root',
//         pass: '1'
//     }
// };

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