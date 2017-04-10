(function() {
    'use strict';

    angular
        .module("app", ["GetUrl", "Jackpot", "ngclipboard"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });

})();