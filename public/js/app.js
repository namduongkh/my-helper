(function() {
    'use strict';

    angular
        .module("app", ["GetUrl", "ngclipboard"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });

})();