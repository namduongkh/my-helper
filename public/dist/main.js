(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
    'use strict';

    angular.module("app", ["Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar", "Graph", "ngFacebook"]).config(function ($interpolateProvider, $facebookProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');

        $facebookProvider.setAppId('297670284021666');
        $facebookProvider.setPermissions("email,publish_actions,user_managed_groups");
    }).run(function ($window) {
        (function () {
            // If we've already installed the SDK, we're done
            if (document.getElementById('facebook-jssdk')) {
                return;
            }

            // Get the first script element, which we'll use to find the parent node
            var firstScriptElement = document.getElementsByTagName('script')[0];

            // Create a new script element and set its id
            var facebookJS = document.createElement('script');
            facebookJS.id = 'facebook-jssdk';

            // Set the new script's source to the source of the Facebook JS SDK
            facebookJS.src = '//connect.facebook.net/en_US/all.js';

            // Insert the Facebook JS SDK into the DOM
            firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
        })();
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

    angular.module("Graph", []).config(function ($interpolateProvider) {
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

    angular.module("GetLink").controller("GetContentController", GetContentController);

    function GetContentController($http, $scope, $rootScope, $sce, $timeout, GetLinkSvc, CommonSvc, toastr) {
        var getContent = this;
        getContent.showHtml = false;
        getContent.publish_email = CommonSvc.publish_email;
        getContent.has_publish = false;
        getContent.form = {};

        $scope.$watch('getContent.view_data', function (value) {
            if (value) {
                // value = JSON.parse(value);
                if (value.selector) {
                    getContent.form.selector = value.selector;
                }
                if (value.url) {
                    getContent.form.url = value.url;
                    getContent.getContent(true, value.url, value.selector);
                }
            }
        });

        getContent.getContent = function (valid, url, selector, cb) {
            if (!valid) {
                toastr.error("Form không đủ dữ liệu", "Lỗi!");
                return;
            }
            getContent.has_publish = false;
            getContent.content_data = {};
            GetLinkSvc.getContent({
                url: url
            }).then(function (resp) {
                if (resp.status == 200) {
                    if (resp.data.status) {
                        var html_tmp = document.createElement("div");
                        var select = $(html_tmp).html(resp.data.content);
                        // console.log("Select", select.find(selector));
                        if (selector) {
                            select = select.find(selector);
                        }
                        // console.log("Select", select, select.innerHTML);
                        getContent.content_data = {
                            title: resp.data.title,
                            html: $sce.trustAsHtml(select.html()),
                            publish_email: getContent.publish_email[0].value
                        };
                        $timeout(function () {
                            $("#content-result").find("div").on("click", function () {
                                console.log("Clicked!", $(this).find("div"));
                                var children = $(this).find("div");
                                if (!children.length) {
                                    this.remove();
                                }
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

        getContent.getContentManyLink = function (list_url, cb) {
            // getContent.has_publish = false;
            getContent.select_publish_email = getContent.publish_email[0].value;
            GetLinkSvc.getContentManyLink({
                list_url: list_url
            }).then(function (resp) {
                if (resp.status == 200) {
                    if (resp.data.contents) {
                        getContent.imageManyLink = resp.data.contents.map(function (item) {
                            item.html = $sce.trustAsHtml(item.image);
                            return item;
                        });
                        $timeout(function () {
                            $(".image-many-link").find('img').bind('click', function () {
                                this.remove();
                                // for (var i in getContent.imageManyLink) {
                                //     if (!getContent.imageManyLink[i].html) {
                                //         getContent.imageManyLink.splice(i, 1);
                                //         break;
                                //     }
                                // }
                            });
                        });
                        // console.log(getContent.imageManyLink);
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

        getContent.getHtmlImage = function (selector) {
            if (selector) {
                return $(selector).html();
            }
            return null;
        };

        getContent.publish = function (html, email, title) {
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
                getContent.has_publish = true;
            }).catch(function () {
                toastr.error('Publish error!', 'Error!');
            });
        };

        getContent.publishMany = function (list_contents, email) {
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
                // getContent.has_publish = true;
            }).catch(function () {
                toastr.error('Publish error!', 'Error!');
            });
        };

        getContent.changeShowHtml = function () {
            getContent.showHtml = !getContent.showHtml;
        };

        $rootScope.$on("GET_IMAGE_FROM_LINK", function (e, data) {
            var url = data.url,
                cb = data.cb;

            if (url) {
                getContent.getContent(url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        $rootScope.$on("GET_IMAGE_FROM_MANY_LINK", function (e, data) {
            var list_url = data.list_url,
                cb = data.cb;

            if (list_url) {
                getContent.getContentManyLink(list_url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        getContent.removeFromListLink = function (index) {
            getContent.imageManyLink.splice(index, 1);
            if (!getContent.imageManyLink.length) {
                $('.close-modal').click();
            }
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
                return "<!--more-->" + $(selector).html();
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
                    if (resp.data.status) {
                        toastr.success('Publish success!', 'Success!');
                        $('.close-modal').click();
                    } else {
                        toastr.error('Publish error!', 'Error!');
                    }
                }
                getImage.has_publish = true;
            }).catch(function () {
                toastr.error('Publish error!', 'Error!');
            });
        };

        getImage.publishMany = function (list_contents, email) {
            list_contents = list_contents.map(function (item) {
                item.image = "<!--more-->" + item.html.$$unwrapTrustedValue();
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
            getContent: function getContent(data) {
                return $http({
                    method: 'post',
                    url: "/api/getlink/getContent",
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

    angular.module("Graph").controller("GraphController", GraphController);

    function GraphController($scope, $facebook, toastr, GraphSvc) {
        var graph = this;
        graph.loading = true;
        graph.groups = [];

        graph.getUserInfo = function () {
            graph.userInfo = null;
            $facebook.api("/me").then(function (response) {
                graph.loading = false;
                // console.log("resp", response);
                graph.userInfo = response;
                // graph.welcomeMsg = "Welcome " + response.name;
                GraphSvc.getGroups({ fb_id: response.id }).then(function (resp) {
                    graph.groups = resp.data;
                });
                GraphSvc.getFeeds({ fb_id: response.id }).then(function (resp) {
                    graph.feeds = resp.data;
                });
            }).catch(function (err) {
                console.log("err", err);
                graph.loading = false;
                toastr.info("Hãy đăng nhập FB", "Thông báo");
                // graph.welcomeMsg = "Please log in";
            });
        };

        graph.login = function () {
            $facebook.login().then(function (resp) {
                graph.getUserInfo();
                console.log("resp", resp);
            });
        };

        graph.logout = function () {
            $facebook.logout().then(function (resp) {
                graph.getUserInfo();
                console.log("resp", resp);
            });
        };

        graph.addGroup = function () {
            GraphSvc.addGroup({
                fb_id: graph.userInfo.id,
                group_id: graph.group_id,
                group_name: graph.group_name
            }).then(function (resp) {
                toastr.success("Thành công", "Thông báo");
                graph.groups = resp.data;
            });
        };

        graph.publishing = function (is_valid, is_save) {
            // console.log(is_valid);
            // return;
            if (!is_valid) {
                toastr.error("Form lỗi", "Lỗi");
                return;
            }

            function publishFeed() {
                // return;
                var data = {
                    "message": graph.publish_data.message
                };
                if (graph.publish_data.link) {
                    data.link = graph.publish_data.link;
                }
                $facebook.api("/" + graph.publish_data.group_id + "/feed", "POST", data).then(function (response) {
                    console.log("resp", response);
                    if (response && !response.error) {
                        /* handle the result */
                    }
                });
            }
            if (is_save) {
                GraphSvc.addFeed({
                    fb_id: graph.userInfo.id,
                    message: graph.publish_data.message,
                    link: graph.publish_data.link
                }).then(function (resp) {
                    toastr.success("Thành công", "Thông báo");
                    graph.feeds = resp.data;
                    publishFeed();
                });
            } else {
                publishFeed();
            }
        };

        graph.groupInfo = function (group_id) {
            $facebook.api("/" + group_id).then(function (response) {
                console.log("resp", response);
                if (response && !response.error) {
                    /* handle the result */
                    graph.group_name = response.name;
                } else {
                    toastr.error("Xảy ra lỗi", "Lỗi!");
                }
            });
        };

        graph.changeFeed = function (feed) {
            if (feed) {
                graph.publish_data.message = feed.message;
                graph.publish_data.link = feed.link;
            }
        };
    }
})();
(function () {
    'use strict';

    angular.module("Graph").service("GraphSvc", GraphSvc);

    function GraphSvc($http) {
        return {
            getGroups: function getGroups(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/getGroups",
                    data: data
                });
            },
            getFeeds: function getFeeds(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/getFeeds",
                    data: data
                });
            },
            addGroup: function addGroup(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/addGroup",
                    data: data
                });
            },
            addFeed: function addFeed(data) {
                return $http({
                    method: "post",
                    url: "/api/graph/addFeed",
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