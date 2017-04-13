(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module("app", ["GetUrl", "Jackpot", "ngclipboard", "GetLink", "Common"])
        .config(function($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        });

})();
(function() {
    'use strict';

    angular
        .module("Common", [])
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
    angular
        .module("GetLink", [])
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

    angular.module("Common")
        .service("CommonSvc", CommonSvc);

    function CommonSvc() {
        return {
            publish_email: [
                { name: "Blog 18 tuổi", value: "openness.newthinkingnewlife.blog18@blogger.com" }
            ]
        };
    }
})();
(function() {
    'use strict';

    angular.module("GetLink")
        .controller("GetLinkController", GetLinkController);

    function GetLinkController($scope, $http, $sce, $timeout, CommonSvc) {
        var getLink = this;
        getLink.publish_email = CommonSvc.publish_email;

        $scope.$watch('getLink.view_data', function(value) {
            if (value) {
                value = JSON.parse(value);
                if (value.url) {
                    getLink.url = value.url;
                    getLink.getAllLink();
                }
            }
        });

        getLink.getAllLink = function() {
            $http({
                    method: 'post',
                    url: "/api/getlink/getAllLink",
                    data: {
                        url: getLink.url
                    }
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.status) {
                            getLink.allHref = resp.data.href;
                        }
                    }
                })
                .catch(function(err) {
                    console.log(err)
                });
        };

        getLink.getImage = function(url) {
            getLink.image_data = {};
            $http({
                    method: 'post',
                    url: "/getImage",
                    data: {
                        url: url
                    }
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.content) {
                            getLink.image_data = {
                                image: resp.data.content.image,
                                title: resp.data.content.title,
                                html: $sce.trustAsHtml(resp.data.content.image),
                                publish_email: getLink.publish_email[0].value
                            };
                            $timeout(function() {
                                $("#html-result").find('img').bind('click', function() {
                                    this.remove();
                                });
                            });
                        }
                    }
                });
        };

        getLink.publish = function(html, email, title) {
            $http({
                    method: 'post',
                    url: "/api/getlink/publish",
                    data: {
                        html: html,
                        email: email,
                        title: title
                    }
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        alert("Success!");
                        $('.close-modal').click();
                    }
                });
        };
    }
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


// $(document).ready(function() {
//     var iframeWindow = document.getElementById("iframe").contentWindow;

//     iframeWindow.addEventListener("load", function() {
//         var doc = iframe.contentDocument || iframe.contentWindow.document;
//         // var target = doc.getElementById("my-target-id");

//         // target.innerHTML = "Found it!";
//         console.log("Doc", doc);
//     });
// });
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