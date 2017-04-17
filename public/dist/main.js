(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
    'use strict';

    angular.module("app", ["Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar"]).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
})();
(function () {
    'use strict';

    angular.module("Common", []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
})();
(function () {
    'use strict';

    angular.module("GetLink", []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
})();
(function () {
    'use strict';

    angular.module("Jackpot", []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
})();
(function () {
    'use strict';

    angular.module("Common").service("CommonSvc", CommonSvc);

    function CommonSvc() {
        return {
            publish_email: [{ name: "Blog 18", value: "openness.newthinkingnewlife.blog18@blogger.com" }]
        };
    }
})();
(function () {
    'use strict';

    angular.module("GetLink").controller("GetImageController", GetImageController);

    function GetImageController($http, $scope, $rootScope, $sce, $timeout, GetLinkSvc, CommonSvc, toastr) {
        var getImage = this;
        getImage.showHtml = false;
        getImage.publish_email = CommonSvc.publish_email;
        getImage.has_publish = false;

        $scope.$watch('getImage.view_data', function (value) {
            if (value) {
                // value = JSON.parse(value);
                if (value.url) {
                    getImage.url = value.url;
                    getImage.getImage(value.url);
                }
            }
        });

        getImage.getImage = function (url, cb) {
            getImage.has_publish = false;
            getImage.image_data = {};
            GetLinkSvc.getImage({
                url: url
            }).then(function (resp) {
                if (resp.status == 200) {
                    if (resp.data.content) {
                        getImage.image_data = {
                            title: resp.data.content.title,
                            html: $sce.trustAsHtml(resp.data.content.image),
                            publish_email: getImage.publish_email[0].value
                        };
                        $timeout(function () {
                            $("#html-result").find('img').bind('click', function () {
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
            }).catch(function (err) {
                console.log("Err", err);
                toastr.error('Get image error!', 'Error!');
            });
        };

        getImage.getImageManyLink = function (list_url, cb) {
            // getImage.has_publish = false;
            getImage.select_publish_email = getImage.publish_email[0].value;
            GetLinkSvc.getImageManyLink({
                list_url: list_url
            }).then(function (resp) {
                if (resp.status == 200) {
                    if (resp.data.contents) {
                        getImage.imageManyLink = resp.data.contents.map(function (item) {
                            item.html = $sce.trustAsHtml(item.image);
                            return item;
                        });
                        $timeout(function () {
                            $(".image-many-link").find('img').bind('click', function () {
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
            }).catch(function (err) {
                console.log("Err", err);
                toastr.error('Get image error!', 'Error!');
            });
        };

        getImage.getHtmlImage = function (selector) {
            if (selector) {
                return $(selector).html();
            }
            return null;
        };

        getImage.publish = function (html, email, title) {
            // console.log("Html", html);
            // return;
            GetLinkSvc.publish({
                html: html,
                email: email,
                title: title
            }).then(function (resp) {
                if (resp.status == 200) {
                    toastr.success('Publish success!', 'Success!');
                    $('.close-modal').click();
                }
                getImage.has_publish = true;
            }).catch(function () {
                toastr.error('Publish error!', 'Error!');
            });
        };

        getImage.publishMany = function (list_contents, email) {
            list_contents = list_contents.map(function (item) {
                delete item.html;
                return item;
            });
            GetLinkSvc.publishMany({
                contents: list_contents,
                email: email
            }).then(function (resp) {
                if (resp.status == 200) {
                    toastr.success("Đã xuất bản", 'Thành công!');
                    $('.close-modal').click();
                }
                // getImage.has_publish = true;
            }).catch(function () {
                toastr.error('Publish error!', 'Error!');
            });
        };

        getImage.changeShowHtml = function () {
            getImage.showHtml = !getImage.showHtml;
        };

        $rootScope.$on("GET_IMAGE_FROM_LINK", function (e, data) {
            var url = data.url,
                cb = data.cb;

            if (url) {
                getImage.getImage(url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        $rootScope.$on("GET_IMAGE_FROM_MANY_LINK", function (e, data) {
            var list_url = data.list_url,
                cb = data.cb;

            if (list_url) {
                getImage.getImageManyLink(list_url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        getImage.removeFromListLink = function (index) {
            getImage.imageManyLink.splice(index, 1);
            if (!getImage.imageManyLink.length) {
                $('.close-modal').click();
            }
        };
    }
})();
(function () {
    'use strict';

    angular.module("GetLink").controller("GetLinkController", GetLinkController);

    function GetLinkController($scope, $rootScope, $http, $sce, $timeout, CommonSvc, GetLinkSvc, toastr) {
        var getLink = this;
        getLink.publish_email = CommonSvc.publish_email;

        $scope.$watch('getLink.view_data', function (value) {
            if (value) {
                // value = JSON.parse(value);
                if (value.url) {
                    getLink.url = value.url;
                    getLink.getAllLink();
                }
            }
        });

        getLink.getAllLink = function () {
            GetLinkSvc.getAllLink({
                url: getLink.url,
                not_allow: getLink.not_allow
            }).then(function (resp) {
                if (resp.status == 200) {
                    if (resp.data.status) {
                        getLink.allHref = resp.data.href;
                        getLink.listLink = [];
                    }
                }
            }).catch(function (err) {
                console.log("Err", err);
                toastr.error('Get all link error!', 'Error!');
            });
        };

        // getLink.getImage = function(url) {
        //     getLink.image_data = {};
        //     GetLinkSvc.getImage({
        //             url: url
        //         })
        //         .then(function(resp) {
        //             if (resp.status == 200) {
        //                 if (resp.data.content) {
        //                     getLink.image_data = {
        //                         image: resp.data.content.image,
        //                         title: resp.data.content.title,
        //                         html: $sce.trustAsHtml(resp.data.content.image),
        //                         publish_email: getLink.publish_email[0].value
        //                     };
        //                     $timeout(function() {
        //                         $("#html-result").find('img').bind('click', function() {
        //                             this.remove();
        //                         });
        //                     });
        //                 }
        //             }
        //         })
        //         .catch(function() {
        //             toastr.error('Get image error!', 'Error!');
        //         });
        // };

        // getLink.publish = function(html, email, title) {
        //     GetLinkSvc.publish({
        //             html: html,
        //             email: email,
        //             title: title
        //         })
        //         .then(function(resp) {
        //             if (resp.status == 200) {
        //                 toastr.success('Publish success!', 'Success!');
        //                 $('.close-modal').click();
        //             }
        //         })
        //         .catch(function() {
        //             toastr.error('Publish error!', 'Error!');
        //         });
        // };

        getLink.openGetImage = function (url, cb) {
            $rootScope.$broadcast("GET_IMAGE_FROM_LINK", {
                url: url,
                cb: cb
            });
        };

        getLink.openGetImageModal = function () {
            $('#openGetImage').modal('show');
        };

        getLink.openGetImageManyLinkModal = function () {
            $('#openGetImageManyLink').modal('show');
        };

        getLink.getImageManyLink = function (list_url, cb) {
            $rootScope.$broadcast("GET_IMAGE_FROM_MANY_LINK", {
                list_url: list_url,
                cb: cb
            });
        };

        getLink.changeListLink = function (index, link) {
            if (getLink.selectLink[index]) {
                getLink.listLink.push(link);
            } else {
                getLink.listLink.splice(getLink.listLink.indexOf(link), 1);
            }
            // console.log("List", getLink.listLink);
        };

        getLink.checkAll = function () {
            getLink.listLink = [];
            getLink.selectLink = [];
            if (getLink.checkAllLink) {
                for (var i in getLink.allHref) {
                    // console.log(getLink.allHref[i]);
                    getLink.selectLink[i] = true;
                    getLink.changeListLink(i, getLink.allHref[i]);
                }
            }
        };
    }
})();
(function () {
    'use strict';

    angular.module("GetLink").service("GetLinkSvc", GetLinkSvc);

    function GetLinkSvc($http) {
        return {
            publish: function publish(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/publish",
                    data: data
                });
            },
            publishMany: function publishMany(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/publishMany",
                    data: data
                });
            },
            getImage: function getImage(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getImage",
                    data: data
                });
            },
            getImageManyLink: function getImageManyLink(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getImageManyLink",
                    data: data
                });
            },
            getAllLink: function getAllLink(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getAllLink",
                    data: data
                });
            }
        };
    }
})();
(function () {
    'use strict';

    angular.module("Jackpot").controller("JackpotController", JackpotController);

    function JackpotController($http, $sce) {
        var jackpot = this;
        jackpot.winnings = [];

        jackpot.getWinningPosition = function (position) {
            $http({
                method: 'post',
                url: "/api/jackpot/getWinningPosition",
                data: {
                    position: position
                }
            }).then(function (resp) {
                // console.log("Resp", resp);
                jackpot.winnings[position] = resp.data;
            });
        };

        jackpot.getWinnings = function () {
            for (var i = 0; i < 6; i++) {
                jackpot.getWinningPosition(i);
            }
        };

        jackpot.addWinning = function () {
            $http({
                method: 'post',
                url: "/api/jackpot/addWinningApi",
                data: {
                    number: jackpot.add_winning.number,
                    date: jackpot.add_winning.date
                }
            }).then(function (resp) {
                console.log("Resp", resp);
            });
        };
    }
})();
},{}]},{},[1])