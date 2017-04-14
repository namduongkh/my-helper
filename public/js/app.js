(function() {
    'use strict';

    angular
        .module("app", ["GetUrl", "Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });

})();