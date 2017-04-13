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