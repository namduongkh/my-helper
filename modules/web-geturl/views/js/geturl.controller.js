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