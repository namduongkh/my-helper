(function() {
    'use strict';

    angular
        .module("GetLink")
        .controller("GetImageController", GetImageController);

    function GetImageController($http, $scope, $rootScope, $sce, $timeout, GetLinkSvc, CommonSvc, toastr) {
        var getImage = this;
        getImage.showHtml = false;
        getImage.publish_email = CommonSvc.publish_email;
        getImage.has_publish = false;

        $scope.$watch('getImage.view_data', function(value) {
            if (value) {
                // value = JSON.parse(value);
                if (value.url) {
                    getImage.url = value.url;
                    getImage.getImage(value.url);
                }
            }
        });

        getImage.getImage = function(url, cb) {
            getImage.has_publish = false;
            getImage.image_data = {};
            GetLinkSvc.getImage({
                    url: url
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.content) {
                            getImage.image_data = {
                                title: resp.data.content.title,
                                html: $sce.trustAsHtml(resp.data.content.image),
                                publish_email: getImage.publish_email[0].value
                            };
                            $timeout(function() {
                                $("#html-result").find('img').bind('click', function() {
                                    this.remove();
                                });
                            });
                            if (cb) {
                                cb();
                            }
                        } else {
                            toastr.error('Không lấy được dữ liệu hình ảnh!', 'Lỗi!');
                        }
                    } else {
                        toastr.error('Không lấy được dữ liệu hình ảnh!', 'Lỗi!');
                    }
                })
                .catch(function(err) {
                    console.log("Err", err);
                    toastr.error('Get image error!', 'Error!');
                });
        };

        getImage.getImageManyLink = function(list_url, cb) {
            // getImage.has_publish = false;
            getImage.select_publish_email = getImage.publish_email[0].value;
            GetLinkSvc.getImageManyLink({
                    list_url
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.contents) {
                            getImage.imageManyLink = resp.data.contents.map(function(item) {
                                item.html = $sce.trustAsHtml(item.image);
                                return item;
                            });
                            $timeout(function() {
                                $(".image-many-link").find('img').bind('click', function() {
                                    this.remove();
                                    // for (var i in getImage.imageManyLink) {
                                    //     if (!getImage.imageManyLink[i].html) {
                                    //         getImage.imageManyLink.splice(i, 1);
                                    //         break;
                                    //     }
                                    // }
                                });
                            });
                            // console.log(getImage.imageManyLink);
                            if (cb) {
                                cb();
                            }
                        } else {
                            toastr.error('Không lấy được dữ liệu hình ảnh!', 'Lỗi!');
                        }
                    } else {
                        toastr.error('Không lấy được dữ liệu hình ảnh!', 'Lỗi!');
                    }
                })
                .catch(function(err) {
                    console.log("Err", err);
                    toastr.error('Get image error!', 'Error!');
                });
        };

        getImage.getHtmlImage = function(selector) {
            if (selector) {
                return "<!--more-->" + $(selector).html();
            }
            return null;
        };

        getImage.publish = function(html, email, title) {
            // console.log("Html", html);
            // return;
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
                    getImage.has_publish = true;
                })
                .catch(function() {
                    toastr.error('Publish error!', 'Error!');
                });
        };

        getImage.publishMany = function(list_contents, email) {
            list_contents = list_contents.map(function(item) {
                item.image = "<!--more-->" + item.html.$$unwrapTrustedValue();
                return item;
            })
            GetLinkSvc.publishMany({
                    contents: list_contents,
                    email: email,
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        toastr.success("Đã xuất bản", 'Thành công!');
                        $('.close-modal').click();
                    }
                    // getImage.has_publish = true;
                })
                .catch(function() {
                    toastr.error('Publish error!', 'Error!');
                });
        };

        getImage.changeShowHtml = function() {
            getImage.showHtml = !getImage.showHtml;
        };

        $rootScope.$on("GET_IMAGE_FROM_LINK", function(e, data) {
            var { url, cb } = data;
            if (url) {
                getImage.getImage(url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        $rootScope.$on("GET_IMAGE_FROM_MANY_LINK", function(e, data) {
            var { list_url, cb } = data;
            if (list_url) {
                getImage.getImageManyLink(list_url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        getImage.removeFromListLink = function(index) {
            getImage.imageManyLink.splice(index, 1);
            if (!getImage.imageManyLink.length) {
                $('.close-modal').click();
            }
        };
    }
})();