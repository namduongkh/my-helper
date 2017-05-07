(function() {
    'use strict';

    angular.module("Graph")
        .service("GraphSvc", GraphSvc);

    function GraphSvc($http) {
        return {
            getGroups: function(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/getGroups",
                    data: data
                });
            },
            getFeeds: function(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/getFeeds",
                    data: data
                });
            },
            addGroup: function(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/addGroup",
                    data: data
                });
            },
            addFeed: function(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/addFeed",
                    data: data
                });
            },
        }
    }
})();