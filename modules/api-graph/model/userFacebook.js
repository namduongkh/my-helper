'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const winningSchema = new Schema({
    fb_id: {
        type: String,
        required: true
    },
    groups: [{
        id: {
            type: String
        },
        name: {
            type: String
        }
    }],
    feeds: [{
        message: {
            type: String
        },
        link: {
            type: String
        }
    }],
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('UserFacebook', winningSchema);