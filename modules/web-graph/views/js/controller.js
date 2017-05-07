(function() {
    'use strict';

    angular.module("Graph")
        .controller("GraphController", GraphController);

    function GraphController($scope, $facebook, toastr, GraphSvc) {
        var graph = this;
        graph.loading = true;
        graph.groups = [];

        graph.getUserInfo = function() {
            graph.userInfo = null;
            $facebook.api("/me").then(function(response) {
                    graph.loading = false;
                    // console.log("resp", response);
                    graph.userInfo = response;
                    // graph.welcomeMsg = "Welcome " + response.name;
                    GraphSvc.getGroups({ fb_id: response.id })
                        .then(function(resp) {
                            graph.groups = resp.data;
                        });
                    GraphSvc.getFeeds({ fb_id: response.id })
                        .then(function(resp) {
                            graph.feeds = resp.data;
                        });
                })
                .catch(function(err) {
                    console.log("err", err);
                    graph.loading = false;
                    toastr.info("Hãy đăng nhập FB", "Thông báo");
                    // graph.welcomeMsg = "Please log in";
                });
        }

        graph.login = function() {
            $facebook.login().then(function(resp) {
                graph.getUserInfo();
                console.log("resp", resp);
            });
        };

        graph.logout = function() {
            $facebook.logout().then(function(resp) {
                graph.getUserInfo();
                console.log("resp", resp);
            });
        };

        graph.addGroup = function() {
            GraphSvc.addGroup({
                    fb_id: graph.userInfo.id,
                    group_id: graph.group_id,
                    group_name: graph.group_name
                })
                .then(function(resp) {
                    toastr.success("Thành công", "Thông báo");
                    graph.groups = resp.data;
                });
        };

        graph.publishing = function(is_valid, is_save) {
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
                $facebook.api("/" + graph.publish_data.group_id + "/feed",
                        "POST", data)
                    .then(function(response) {
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
                    })
                    .then(function(resp) {
                        toastr.success("Thành công", "Thông báo");
                        graph.feeds = resp.data;
                        publishFeed();
                    });
            } else {
                publishFeed();
            }
        };

        graph.groupInfo = function(group_id) {
            $facebook.api("/" + group_id)
                .then(function(response) {
                    console.log("resp", response);
                    if (response && !response.error) {
                        /* handle the result */
                        graph.group_name = response.name;
                    } else {
                        toastr.error("Xảy ra lỗi", "Lỗi!")
                    }
                });
        };

        graph.changeFeed = function(feed) {
            if (feed) {
                graph.publish_data.message = feed.message;
                graph.publish_data.link = feed.link;
            }
        };
    }
})();