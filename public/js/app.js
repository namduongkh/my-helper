(function() {
    'use strict';

    angular
        .module("app", ["Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
})();