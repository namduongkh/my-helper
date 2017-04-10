'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const winningSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    position: {
        type: Number
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Winning', winningSchema);