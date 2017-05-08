(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
    'use strict';

    angular.module("app", ["Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar", "Graph", "ngFacebook", 'ngSanitize']).config(function ($interpolateProvider, $facebookProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');

        $facebookProvider.setAppId(window.fb_app_id);
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
        graph.publish_data = {};
        graph.emoji = emoji.all;

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
                        toastr.error("Xuất bản thành công!", "Thành công!");
                    } else {
                        toastr.error("Có lỗi xảy ra", "Lỗi");
                    }
                });
            }
            if (is_save) {
                _saveFeed(function () {
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

        graph.saveFeed = function () {
            _saveFeed();
        };

        function _saveFeed(cb) {
            GraphSvc.addFeed({
                fb_id: graph.userInfo.id,
                message: graph.publish_data.message,
                link: graph.publish_data.link,
                name: graph.publish_data.name,
                feed_id: graph.publish_data.feed_id
            }).then(function (resp) {
                toastr.success("Thành công", "Thông báo");
                graph.feeds = resp.data;
                // publishFeed();
                if (cb) {
                    cb();
                }
            });
        }

        graph.changeFeed = function (feed) {
            // console.log(feed);
            if (feed) {
                graph.publish_data.name = feed.name;
                graph.publish_data.message = feed.message;
                graph.publish_data.link = feed.link;
                graph.publish_data.feed_id = feed._id;
            }
        };

        graph.changeMessage = function (message) {
            console.log("message", message);
        };

        graph.emojiCode = function (text, last) {
            if (last) {
                var insertAtCaret = function insertAtCaret(areaId, text) {
                    var txtarea = document.getElementById(areaId);
                    var scrollPos = txtarea.scrollTop;
                    var strPos = 0;
                    var br = txtarea.selectionStart || txtarea.selectionStart == '0' ? "ff" : document.selection ? "ie" : false;
                    var range;
                    if (br == "ie") {
                        txtarea.focus();
                        range = document.selection.createRange();
                        range.moveStart('character', -txtarea.value.length);
                        strPos = range.text.length;
                    } else if (br == "ff") {
                        strPos = txtarea.selectionStart;
                    }

                    var front = txtarea.value.substring(0, strPos);
                    var back = txtarea.value.substring(strPos, txtarea.value.length);
                    txtarea.value = front + text + back;
                    strPos = strPos + text.length;
                    if (br == "ie") {
                        txtarea.focus();
                        range = document.selection.createRange();
                        range.moveStart('character', -txtarea.value.length);
                        range.moveStart('character', strPos);
                        range.moveEnd('character', 0);
                        range.select();
                    } else if (br == "ff") {
                        txtarea.selectionStart = strPos;
                        txtarea.selectionEnd = strPos;
                        txtarea.focus();
                    }
                    txtarea.scrollTop = scrollPos;
                };

                $(".emoji-item").draggable({
                    revert: true,
                    //revert: false,
                    helper: 'clone',
                    start: function start(event, ui) {
                        $(this).fadeTo('fast', 0.5);
                        //$(this).css('cursor', 'text');
                        //$(this).hide();
                    },
                    stop: function stop(event, ui) {
                        $(this).fadeTo(0, 1);
                        //$(this).show("explode", { pieces: 16 }, 2000);
                    }
                });

                $(".publish-message").droppable({
                    hoverClass: 'active',
                    drop: function drop(event, ui) {
                        //this.value += $(ui.draggable).text();
                        //alert($("#droppable"));
                        insertAtCaret("message", $(ui.draggable).text());
                    },
                    over: function over(event, ui) {
                        //$(this).css('cursor', 'text');
                    }
                });
            }
            text = ":" + text + ":";
            var short = emojione.shortnameToUnicode(text);
            if (short !== text) {
                return short;
            }
            return null;
        };

        graph.selectEmoji = function (short) {
            if (!graph.publish_data) {
                graph.publish_data = {};
            }
            if (!graph.publish_data.message) {
                graph.publish_data.message = "";
            }
            graph.publish_data.message += short;
        };
    }
})();
var emoji = function () {
    'use strict';

    return {
        all: ["grinning", "grimacing", "grin", "joy", "smiley", "smile", "sweat_smile", "laughing", "innocent", "wink", "blush", "slight_smile", "upside_down", "relaxed", "yum", "relieved", "heart_eyes", "kissing_heart", "kissing", "kissing_smiling_eyes", "kissing_closed_eyes", "stuck_out_tongue_winking_eye", "stuck_out_tongue_closed_eyes", "stuck_out_tongue", "money_mouth", "nerd", "sunglasses", "hugging", "smirk", "no_mouth", "neutral_face", "expressionless", "unamused", "rolling_eyes", "thinking", "flushed", "disappointed", "worried", "angry", "rage", "pensive", "confused", "slight_frown", "frowning2", "persevere", "confounded", "tired_face", "weary", "triumph", "open_mouth", "scream", "fearful", "cold_sweat", "hushed", "frowning", "anguished", "cry", "disappointed_relieved", "sleepy", "sweat", "sob", "dizzy_face", "astonished", "zipper_mouth", "mask", "thermometer_face", "head_bandage", "sleeping", "zzz", "poop", "smiling_imp", "imp", "japanese_ogre", "japanese_goblin", "skull", "ghost", "alien", "robot", "smiley_cat", "smile_cat", "joy_cat", "heart_eyes_cat", "smirk_cat", "kissing_cat", "scream_cat", "crying_cat_face", "pouting_cat", "raised_hands", "clap", "wave", "thumbsup", "thumbsdown", "punch", "fist", "v", "ok_hand", "raised_hand", "open_hands", "muscle", "pray", "point_up", "point_up_2", "point_down", "point_left", "point_right", "middle_finger", "hand_splayed", "metal", "vulcan", "writing_hand", "nail_care", "lips", "tongue", "ear", "nose", "eye", "eyes", "dog", "cat", "mouse", "hamster", "rabbit", "bear", "panda_face", "koala", "tiger", "lion_face", "cow", "pig", "pig_nose", "frog", "octopus", "monkey_face", "see_no_evil", "hear_no_evil", "speak_no_evil", "monkey", "chicken", "penguin", "bird", "baby_chick", "hatching_chick", "hatched_chick", "wolf", "boar", "horse", "unicorn", "bee", "bug", "snail", "beetle", "ant", "spider", "scorpion", "crab", "snake", "turtle", "tropical_fish", "fish", "blowfish", "dolphin", "whale", "whale2", "crocodile", "leopard", "tiger2", "water_buffalo", "ox", "cow2", "dromedary_camel", "camel", "elephant", "goat", "ram", "sheep", "racehorse", "pig2", "rat", "mouse2", "rooster", "turkey", "dove", "dog2", "poodle", "cat2", "rabbit2", "chipmunk", "feet", "dragon", "dragon_face", "cactus", "bust_in_silhouette", "busts_in_silhouette", "speaking_head", "baby", "boy", "girl", "man", "woman", "person_with_blond_hair", "older_man", "older_woman", "man_with_gua_pi_mao", "man_with_turban", "cop", "construction_worker", "guardsman", "spy", "santa", "angel", "princess", "bride_with_veil", "walking", "runner", "dancer", "dancers", "couple", "two_men_holding_hands", "two_women_holding_hands", "bow", "information_desk_person", "no_good", "ok_woman", "raising_hand", "person_with_pouting_face", "person_frowning", "haircut", "massage", "couple_with_heart", "couple_ww", "couple_mm", "couplekiss", "kiss_ww", "kiss_mm", "family", "family_mwg", "family_mwgb", "family_mwbb", "family_mwgg", "family_wwb", "family_wwg", "family_wwgb", "family_wwbb", "family_wwgg", "family_mmb", "family_mmg", "family_mmgb", "family_mmbb", "family_mmgg", "womans_clothes", "shirt", "jeans", "necktie", "dress", "bikini", "kimono", "lipstick", "kiss", "footprints", "high_heel", "sandal", "boot", "mans_shoe", "athletic_shoe", "womans_hat", "tophat", "helmet_with_cross", "mortar_board", "crown", "school_satchel", "pouch", "purse", "handbag", "briefcase", "eyeglasses", "dark_sunglasses", "ring", "closed_umbrella", "dog", "cat", "mouse", "hamster", "rabbit", "bear", "panda_face", "koala", "tiger", "lion_face", "cow", "pig", "pig_nose", "frog", "octopus", "monkey_face", "see_no_evil", "hear_no_evil", "speak_no_evil", "monkey", "chicken", "penguin", "bird", "baby_chick", "hatching_chick", "hatched_chick", "wolf", "boar", "horse", "unicorn", "bee", "bug", "snail", "beetle", "ant", "spider", "scorpion", "crab", "snake", "turtle", "tropical_fish", "fish", "blowfish", "dolphin", "whale", "whale2", "crocodile", "leopard", "tiger2", "water_buffalo", "ox", "cow2", "dromedary_camel", "camel", "elephant", "goat", "ram", "sheep", "racehorse", "pig2", "rat", "mouse2", "rooster", "turkey", "dove", "dog2", "poodle", "cat2", "rabbit2", "chipmunk", "feet", "dragon", "dragon_face", "cactus", "christmas_tree", "evergreen_tree", "deciduous_tree", "palm_tree", "seedling", "herb", "shamrock", "four_leaf_clover", "bamboo", "tanabata_tree", "leaves", "fallen_leaf", "maple_leaf", "ear_of_rice", "hibiscus", "sunflower", "rose", "tulip", "blossom", "cherry_blossom", "bouquet", "mushroom", "chestnut", "jack_o_lantern", "shell", "spider_web", "earth_americas", "earth_africa", "earth_asia", "full_moon", "waning_gibbous_moon", "last_quarter_moon", "waning_crescent_moon", "new_moon", "waxing_crescent_moon", "first_quarter_moon", "waxing_gibbous_moon", "new_moon_with_face", "full_moon_with_face", "first_quarter_moon_with_face", "last_quarter_moon_with_face", "sun_with_face", "crescent_moon", "star", "star2", "dizzy", "sparkles", "comet", "sunny", "white_sun_small_cloud", "partly_sunny", "white_sun_cloud", "white_sun_rain_cloud", "cloud", "cloud_rain", "thunder_cloud_rain", "cloud_lightning", "zap", "fire", "boom", "snowflake", "cloud_snow", "snowman2", "snowman", "wind_blowing_face", "dash", "cloud_tornado", "fog", "umbrella2", "umbrella", "droplet", "sweat_drops", "ocean", "green_apple", "apple", "pear", "tangerine", "lemon", "banana", "watermelon", "grapes", "strawberry", "melon", "cherries", "peach", "pineapple", "tomato", "eggplant", "hot_pepper", "corn", "sweet_potato", "honey_pot", "bread", "cheese", "poultry_leg", "meat_on_bone", "fried_shrimp", "egg", "hamburger", "fries", "hotdog", "pizza", "spaghetti", "taco", "burrito", "ramen", "stew", "fish_cake", "sushi", "bento", "curry", "rice_ball", "rice", "rice_cracker", "oden", "dango", "shaved_ice", "ice_cream", "icecream", "cake", "birthday", "custard", "candy", "lollipop", "chocolate_bar", "popcorn", "doughnut", "cookie", "beer", "beers", "wine_glass", "cocktail", "tropical_drink", "champagne", "sake", "tea", "coffee", "baby_bottle", "fork_and_knife", "fork_knife_plate", "soccer", "basketball", "football", "baseball", "tennis", "volleyball", "rugby_football", "8ball", "golf", "golfer", "ping_pong", "badminton", "hockey", "field_hockey", "cricket", "ski", "skier", "snowboarder", "ice_skate", "bow_and_arrow", "fishing_pole_and_fish", "rowboat", "swimmer", "surfer", "bath", "basketball_player", "lifter", "bicyclist", "mountain_bicyclist", "horse_racing", "levitate", "trophy", "running_shirt_with_sash", "medal", "military_medal", "reminder_ribbon", "rosette", "ticket", "tickets", "performing_arts", "art", "circus_tent", "microphone", "headphones", "musical_score", "musical_keyboard", "saxophone", "trumpet", "guitar", "violin", "clapper", "video_game", "space_invader", "dart", "game_die", "slot_machine", "bowling", "red_car", "taxi", "blue_car", "bus", "trolleybus", "race_car", "police_car", "ambulance", "fire_engine", "minibus", "truck", "articulated_lorry", "tractor", "motorcycle", "bike", "rotating_light", "oncoming_police_car", "oncoming_bus", "oncoming_automobile", "oncoming_taxi", "aerial_tramway", "mountain_cableway", "suspension_railway", "railway_car", "train", "monorail", "bullettrain_side", "bullettrain_front", "light_rail", "mountain_railway", "steam_locomotive", "train2", "metro", "tram", "station", "helicopter", "airplane_small", "airplane", "airplane_departure", "airplane_arriving", "sailboat", "motorboat", "speedboat", "ferry", "cruise_ship", "rocket", "satellite_orbital", "seat", "anchor", "construction", "fuelpump", "busstop", "vertical_traffic_light", "traffic_light", "checkered_flag", "ship", "ferris_wheel", "roller_coaster", "carousel_horse", "construction_site", "foggy", "tokyo_tower", "factory", "fountain", "rice_scene", "mountain", "mountain_snow", "mount_fuji", "volcano", "japan", "camping", "tent", "park", "motorway", "railway_track", "sunrise", "sunrise_over_mountains", "desert", "beach", "island", "city_sunset", "city_dusk", "cityscape", "night_with_stars", "bridge_at_night", "milky_way", "stars", "sparkler", "fireworks", "rainbow", "homes", "european_castle", "japanese_castle", "stadium", "statue_of_liberty", "house", "house_with_garden", "house_abandoned", "office", "department_store", "post_office", "european_post_office", "hospital", "bank", "hotel", "convenience_store", "school", "love_hotel", "wedding", "classical_building", "church", "mosque", "synagogue", "kaaba", "shinto_shrine", "watch", "iphone", "calling", "computer", "keyboard", "desktop", "printer", "mouse_three_button", "trackball", "joystick", "compression", "minidisc", "floppy_disk", "cd", "dvd", "vhs", "camera", "camera_with_flash", "video_camera", "movie_camera", "projector", "film_frames", "telephone_receiver", "telephone", "pager", "fax", "tv", "radio", "microphone2", "level_slider", "control_knobs", "stopwatch", "timer", "alarm_clock", "clock", "hourglass_flowing_sand", "hourglass", "satellite", "battery", "electric_plug", "bulb", "flashlight", "candle", "wastebasket", "oil", "money_with_wings", "dollar", "yen", "euro", "pound", "moneybag", "credit_card", "gem", "scales", "wrench", "hammer", "hammer_pick", "tools", "pick", "nut_and_bolt", "gear", "chains", "gun", "bomb", "knife", "dagger", "crossed_swords", "shield", "smoking", "skull_crossbones", "coffin", "urn", "amphora", "crystal_ball", "prayer_beads", "barber", "alembic", "telescope", "microscope", "hole", "pill", "syringe", "thermometer", "label", "bookmark", "toilet", "shower", "bathtub", "key", "key2", "couch", "sleeping_accommodation", "bed", "door", "bellhop", "frame_photo", "map", "beach_umbrella", "moyai", "shopping_bags", "balloon", "flags", "ribbon", "gift", "confetti_ball", "tada", "dolls", "wind_chime", "crossed_flags", "izakaya_lantern", "envelope", "envelope_with_arrow", "incoming_envelope", "e-mail", "love_letter", "postbox", "mailbox_closed", "mailbox", "mailbox_with_mail", "mailbox_with_no_mail", "package", "postal_horn", "inbox_tray", "outbox_tray", "scroll", "page_with_curl", "bookmark_tabs", "bar_chart", "chart_with_upwards_trend", "chart_with_downwards_trend", "page_facing_up", "date", "calendar", "calendar_spiral", "card_index", "card_box", "ballot_box", "file_cabinet", "clipboard", "notepad_spiral", "file_folder", "open_file_folder", "dividers", "newspaper2", "newspaper", "notebook", "closed_book", "green_book", "blue_book", "orange_book", "notebook_with_decorative_cover", "ledger", "books", "book", "link", "paperclip", "paperclips", "scissors", "triangular_ruler", "straight_ruler", "pushpin", "round_pushpin", "triangular_flag_on_post", "flag_white", "flag_black", "closed_lock_with_key", "lock", "unlock", "lock_with_ink_pen", "pen_ballpoint", "pen_fountain", "black_nib", "pencil", "pencil2", "crayon", "paintbrush", "mag", "mag_right", "heart", "yellow_heart", "green_heart", "blue_heart", "purple_heart", "broken_heart", "heart_exclamation", "two_hearts", "revolving_hearts", "heartbeat", "heartpulse", "sparkling_heart", "cupid", "gift_heart", "heart_decoration", "peace", "cross", "star_and_crescent", "om_symbol", "wheel_of_dharma", "star_of_david", "six_pointed_star", "menorah", "yin_yang", "orthodox_cross", "place_of_worship", "ophiuchus", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpius", "sagittarius", "capricorn", "aquarius", "pisces", "id", "atom", "u7a7a", "u5272", "radioactive", "biohazard", "mobile_phone_off", "vibration_mode", "u6709", "u7121", "u7533", "u55b6", "u6708", "eight_pointed_black_star", "vs", "accept", "white_flower", "ideograph_advantage", "secret", "congratulations", "u5408", "u6e80", "u7981", "a", "b", "ab", "cl", "o2", "sos", "no_entry", "name_badge", "no_entry_sign", "x", "o", "anger", "hotsprings", "no_pedestrians", "do_not_litter", "no_bicycles", "non-potable_water", "underage", "no_mobile_phones", "exclamation", "grey_exclamation", "question", "grey_question", "bangbang", "interrobang", "100", "low_brightness", "high_brightness", "trident", "fleur-de-lis", "part_alternation_mark", "warning", "children_crossing", "beginner", "recycle", "u6307", "chart", "sparkle", "eight_spoked_asterisk", "negative_squared_cross_mark", "white_check_mark", "diamond_shape_with_a_dot_inside", "cyclone", "loop", "globe_with_meridians", "m", "atm", "sa", "passport_control", "customs", "baggage_claim", "left_luggage", "wheelchair", "no_smoking", "wc", "parking", "potable_water", "mens", "womens", "baby_symbol", "restroom", "put_litter_in_its_place", "cinema", "signal_strength", "koko", "ng", "ok", "up", "cool", "new", "free", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "1234", "arrow_forward", "pause_button", "play_pause", "stop_button", "record_button", "track_next", "track_previous", "fast_forward", "rewind", "twisted_rightwards_arrows", "repeat", "repeat_one", "arrow_backward", "arrow_up_small", "arrow_down_small", "arrow_double_up", "arrow_double_down", "arrow_right", "arrow_left", "arrow_up", "arrow_down", "arrow_upper_right", "arrow_lower_right", "arrow_lower_left", "arrow_upper_left", "arrow_up_down", "left_right_arrow", "arrows_counterclockwise", "arrow_right_hook", "leftwards_arrow_with_hook", "arrow_heading_up", "arrow_heading_down", "hash", "asterisk", "information_source", "abc", "abcd", "capital_abcd", "symbols", "musical_note", "notes", "wavy_dash", "curly_loop", "heavy_check_mark", "arrows_clockwise", "heavy_plus_sign", "heavy_minus_sign", "heavy_division_sign", "heavy_multiplication_x", "heavy_dollar_sign", "currency_exchange", "copyright", "registered", "tm", "end", "back", "on", "top", "soon", "ballot_box_with_check", "radio_button", "white_circle", "black_circle", "red_circle", "large_blue_circle", "small_orange_diamond", "small_blue_diamond", "large_orange_diamond", "large_blue_diamond", "small_red_triangle", "black_small_square", "white_small_square", "black_large_square", "white_large_square", "small_red_triangle_down", "black_medium_square", "white_medium_square", "black_medium_small_square", "white_medium_small_square", "black_square_button", "white_square_button", "speaker", "sound", "loud_sound", "mute", "mega", "loudspeaker", "bell", "no_bell", "black_joker", "mahjong", "spades", "clubs", "hearts", "diamonds", "flower_playing_cards", "thought_balloon", "anger_right", "speech_balloon", "clock1", "clock2", "clock3", "clock4", "clock5", "clock6", "clock7", "clock8", "clock9", "clock10", "clock11", "clock12", "clock130", "clock230", "clock330", "clock430", "clock530", "clock630", "clock730", "clock830", "clock930", "clock1030", "clock1130", "clock1230", "eye_in_speech_bubble", "ac", "af", "al", "dz", "ad", "ao", "ai", "ag", "ar", "am", "aw", "au", "at", "az", "bs", "bh", "bd", "bb", "by", "be", "bz", "bj", "bm", "bt", "bo", "ba", "bw", "br", "bn", "bg", "bf", "bi", "cv", "kh", "cm", "ca", "ky", "cf", "td", "flag_cl", "cn", "co", "km", "cg", "flag_cd", "cr", "hr", "cu", "cy", "cz", "dk", "dj", "dm", "do", "ec", "eg", "sv", "gq", "er", "ee", "et", "fk", "fo", "fj", "fi", "fr", "pf", "ga", "gm", "ge", "de", "gh", "gi", "gr", "gl", "gd", "gu", "gt", "gn", "gw", "gy", "ht", "hn", "hk", "hu", "is", "in", "flag_id", "ir", "iq", "ie", "il", "it", "ci", "jm", "jp", "je", "jo", "kz", "ke", "ki", "xk", "kw", "kg", "la", "lv", "lb", "ls", "lr", "ly", "li", "lt", "lu", "mo", "mk", "mg", "mw", "my", "mv", "ml", "mt", "mh", "mr", "mu", "mx", "fm", "md", "mc", "mn", "me", "ms", "ma", "mz", "mm", "na", "nr", "np", "nl", "nc", "nz", "ni", "ne", "flag_ng", "nu", "kp", "no", "om", "pk", "pw", "ps", "pa", "pg", "py", "pe", "ph", "pl", "pt", "pr", "qa", "ro", "ru", "rw", "sh", "kn", "lc", "vc", "ws", "sm", "st", "flag_sa", "sn", "rs", "sc", "sl", "sg", "sk", "si", "sb", "so", "za", "kr", "es", "lk", "sd", "sr", "sz", "se", "ch", "sy", "tw", "tj", "tz", "th", "tl", "tg", "to", "tt", "tn", "tr", "flag_tm", "flag_tm", "ug", "ua", "ae", "gb", "us", "vi", "uy", "uz", "vu", "va", "ve", "vn", "wf", "eh", "ye", "zm", "zw", "re", "ax", "ta", "io", "bq", "cx", "cc", "gg", "im", "yt", "nf", "pn", "bl", "pm", "gs", "tk", "bv", "hm", "sj", "um", "ic", "ea", "cp", "dg", "as", "aq", "vg", "ck", "cw", "eu", "gf", "tf", "gp", "mq", "mp", "sx", "ss", "tc"]
    };
}();
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