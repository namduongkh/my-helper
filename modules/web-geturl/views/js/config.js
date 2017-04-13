(function() {
    'use strict';

    angular
        .module("GetUrl", [])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
    angular
        .module("GetLink", [])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
})();