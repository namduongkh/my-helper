'use strict';

exports.register = function(server, options, next) {

    next();
};

exports.register.attributes = {
    name: 'web-common',
}