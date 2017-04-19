(function() {
    'use strict';

    angular
        .module("GetLink")
        .controller("GetContentController", GetContentController);

    function GetContentController($http, $scope, $rootScope, $sce, $timeout, GetLinkSvc, CommonSvc, toastr) {
        var getContent = this;
        getContent.showHtml = false;
        getContent.publish_email = CommonSvc.publish_email;
        getContent.has_publish = false;
        getContent.form = {};

        $scope.$watch('getContent.view_data', function(value) {
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

        getContent.getContent = function(valid, url, selector, cb) {
            if (!valid) {
                toastr.error("Form không đủ dữ liệu", "Lỗi!");
                return;
            }
            getContent.has_publish = false;
            getContent.content_data = {};
            GetLinkSvc.getContent({
                    url: url
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.status) {
                            var html_tmp = document.createElement("div");
                            let select = $(html_tmp).html(resp.data.content);
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
                            $timeout(function() {
                                $("#content-result").find("div").on("click", function() {
                                    console.log("Clicked!", $(this).find("div"));
                                    let children = $(this).find("div");
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
                })
                .catch(function(err) {
                    console.log("Err", err);
                    toastr.error('Get image error!', 'Error!');
                });
        };

        getContent.getContentManyLink = function(list_url, cb) {
            // getContent.has_publish = false;
            getContent.select_publish_email = getContent.publish_email[0].value;
            GetLinkSvc.getContentManyLink({
                    list_url
                })
                .then(function(resp) {
                    if (resp.status == 200) {
                        if (resp.data.contents) {
                            getContent.imageManyLink = resp.data.contents.map(function(item) {
                                item.html = $sce.trustAsHtml(item.image);
                                return item;
                            });
                            $timeout(function() {
                                $(".image-many-link").find('img').bind('click', function() {
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
                })
                .catch(function(err) {
                    console.log("Err", err);
                    toastr.error('Get image error!', 'Error!');
                });
        };

        getContent.getHtmlImage = function(selector) {
            if (selector) {
                return $(selector).html();
            }
            return null;
        };

        getContent.publish = function(html, email, title) {
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
                    getContent.has_publish = true;
                })
                .catch(function() {
                    toastr.error('Publish error!', 'Error!');
                });
        };

        getContent.publishMany = function(list_contents, email) {
            list_contents = list_contents.map(function(item) {
                delete item.html;
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
                    // getContent.has_publish = true;
                })
                .catch(function() {
                    toastr.error('Publish error!', 'Error!');
                });
        };

        getContent.changeShowHtml = function() {
            getContent.showHtml = !getContent.showHtml;
        };

        $rootScope.$on("GET_IMAGE_FROM_LINK", function(e, data) {
            var { url, cb } = data;
            if (url) {
                getContent.getContent(url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        $rootScope.$on("GET_IMAGE_FROM_MANY_LINK", function(e, data) {
            var { list_url, cb } = data;
            if (list_url) {
                getContent.getContentManyLink(list_url, cb);
            } else {
                toastr.error('Không tìm thấy url!', 'Lỗi!');
            }
        });

        getContent.removeFromListLink = function(index) {
            getContent.imageManyLink.splice(index, 1);
            if (!getContent.imageManyLink.length) {
                $('.close-modal').click();
            }
        };
    }
})();