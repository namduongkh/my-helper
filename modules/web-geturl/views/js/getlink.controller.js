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