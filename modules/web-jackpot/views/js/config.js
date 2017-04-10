(function() {
    'use strict';

    angular
        .module("Jackpot", [])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
})();