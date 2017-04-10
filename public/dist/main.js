(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module("app", ["GetUrl", "Jackpot", "ngclipboard"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });

})();
(function() {
    'use strict';

    angular
        .module("GetUrl", [])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
})();
(function() {
    'use strict';

    angular
        .module("Jackpot", [])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });
})();
(function() {
    'use strict';

    angular
        .module("GetUrl")
        .controller("GetUrlController", GetUrlController);

    function GetUrlController($http, $sce) {
        var getUrl = this;
        getUrl.showHtml = false;
        getUrl.getImage = function() {
            $http({
                    method: 'post',
                    url: "/getImage",
                    data: {
                        url: getUrl.url
                    }
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.content) {
                            getUrl.html = $sce.trustAsHtml(resp.data.content.image);
                            getUrl.title = $sce.trustAsHtml(resp.data.content.title);
                        }
                    }
                })
        };

        getUrl.changeShowHtml = function() {
            getUrl.showHtml = !getUrl.showHtml;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module("Jackpot")
        .controller("JackpotController", JackpotController);

    function JackpotController($http, $sce) {
        var jackpot = this;

        jackpot.getWinningPosition = function() {
            $http({
                    method: 'get',
                    url: "/api/jackpot/getWinningPosition"
                })
                .then(function(resp) {
                    console.log("Resp", resp);
                    jackpot.winnings = resp.data
                });
        };

        jackpot.getWinningPosition();
    }
})();
},{}]},{},[1])