(function() {
    'use strict';

    angular.module("GetLink")
        .controller("GetLinkController", GetLinkController);

    function GetLinkController($scope, $http, $sce, $timeout, CommonSvc, GetLinkSvc, toastr) {
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
            GetLinkSvc.getAllLink({
                    url: getLink.url,
                    not_allow: getLink.not_allow
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.status) {
                            getLink.allHref = resp.data.href;
                        }
                    }
                })
                .catch(function(err) {
                    console.log("Err", err);
                    toastr.error('Get all link error!', 'Error!');
                });
        };

        getLink.getImage = function(url) {
            getLink.image_data = {};
            GetLinkSvc.getImage({
                    url: url
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
                })
                .catch(function() {
                    toastr.error('Get image error!', 'Error!');
                });
        };

        getLink.publish = function(html, email, title) {
            GetLinkSvc.publish({
                    html: html,
                    email: email,
                    title: title
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        toastr.success('Publish success!', 'Success!');
                        $('.close-modal').click();
                    }
                })
                .catch(function() {
                    toastr.error('Publish error!', 'Error!');
                });
        };
    }
})();