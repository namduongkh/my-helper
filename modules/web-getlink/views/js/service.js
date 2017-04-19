(function() {
    'use strict';

    angular.module("GetLink")
        .service("GetLinkSvc", GetLinkSvc);

    function GetLinkSvc($http) {
        return {
            publish: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/publish",
                    data: data
                });
            },
            publishMany: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/publishMany",
                    data: data
                });
            },
            getImage: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getImage",
                    data: data
                });
            },
            getContent: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getContent",
                    data: data
                });
            },
            getImageManyLink: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getImageManyLink",
                    data: data
                });
            },
            getAllLink: function(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getAllLink",
                    data: data
                });
            }
        }
    }
})();