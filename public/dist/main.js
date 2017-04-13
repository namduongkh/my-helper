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

    function GetUrlController($http, $sce, $timeout) {
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
                            getUrl.content = {
                                html: resp.data.content.image,
                                title: resp.data.content.title
                            };
                            getUrl.html = $sce.trustAsHtml(resp.data.content.image);
                            getUrl.title = $sce.trustAsHtml(resp.data.content.title);
                            $timeout(function() {
                                $("#html-result").find('img').bind('click', function() {
                                    this.remove();
                                });
                            });
                        }
                    }
                })
        };

        getUrl.changeShowHtml = function() {
            getUrl.showHtml = !getUrl.showHtml;
        };

        getUrl.publish = function() {
            $http({
                    method: 'post',
                    url: "/api/publish",
                    data: getUrl.content
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        alert(resp.data);
                    }
                });
        };
    }
})();


$(document).ready(function() {
    var iframeWindow = document.getElementById("iframe").contentWindow;

    iframeWindow.addEventListener("load", function() {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        // var target = doc.getElementById("my-target-id");

        // target.innerHTML = "Found it!";
        console.log("Doc", doc);
    });
});
(function() {
    'use strict';

    angular
        .module("Jackpot")
        .controller("JackpotController", JackpotController);

    function JackpotController($http, $sce) {
        var jackpot = this;
        jackpot.winnings = [];

        jackpot.getWinningPosition = function(position) {
            $http({
                    method: 'post',
                    url: "/api/jackpot/getWinningPosition",
                    data: {
                        position: position
                    }
                })
                .then(function(resp) {
                    // console.log("Resp", resp);
                    jackpot.winnings[position] = resp.data
                });
        };

        jackpot.getWinnings = function() {
            for (var i = 0; i < 6; i++) {
                jackpot.getWinningPosition(i);
            }
        };

        jackpot.addWinning = function() {
            $http({
                    method: 'post',
                    url: "/api/jackpot/addWinningApi",
                    data: {
                        number: jackpot.add_winning.number,
                        date: jackpot.add_winning.date
                    }
                })
                .then(function(resp) {
                    console.log("Resp", resp);
                });
        };
    }
})();
},{}]},{},[1])