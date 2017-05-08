(function() {
    'use strict';

    angular.module("Graph")
        .controller("GraphController", GraphController);

    function GraphController($scope, $facebook, toastr, GraphSvc) {
        var graph = this;
        graph.loading = true;
        graph.groups = [];
        graph.publish_data = {};
        graph.emoji = emoji.all;

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
                            toastr.error("Xuất bản thành công!", "Thành công!");
                        } else {
                            toastr.error("Có lỗi xảy ra", "Lỗi");
                        }
                    });
            }
            if (is_save) {
                _saveFeed(function() {
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

        graph.saveFeed = function() {
            _saveFeed();
        };

        function _saveFeed(cb) {
            GraphSvc.addFeed({
                    fb_id: graph.userInfo.id,
                    message: graph.publish_data.message,
                    link: graph.publish_data.link,
                    name: graph.publish_data.name,
                    feed_id: graph.publish_data.feed_id
                })
                .then(function(resp) {
                    toastr.success("Thành công", "Thông báo");
                    graph.feeds = resp.data;
                    // publishFeed();
                    if (cb) {
                        cb();
                    }
                });
        }

        graph.changeFeed = function(feed) {
            // console.log(feed);
            if (feed) {
                graph.publish_data.name = feed.name;
                graph.publish_data.message = feed.message;
                graph.publish_data.link = feed.link;
                graph.publish_data.feed_id = feed._id;
            }
        };

        graph.changeMessage = function(message) {
            console.log("message", message);
        };

        graph.emojiCode = function(text, last) {
            if (last) {
                function insertAtCaret(areaId, text) {
                    var txtarea = document.getElementById(areaId);
                    var scrollPos = txtarea.scrollTop;
                    var strPos = 0;
                    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                        "ff" : (document.selection ? "ie" : false));
                    var range;
                    if (br == "ie") {
                        txtarea.focus();
                        range = document.selection.createRange();
                        range.moveStart('character', -txtarea.value.length);
                        strPos = range.text.length;
                    } else if (br == "ff") {
                        strPos = txtarea.selectionStart;
                    }

                    var front = (txtarea.value).substring(0, strPos);
                    var back = (txtarea.value).substring(strPos, txtarea.value.length);
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
                }

                $(".emoji-item").draggable({
                    revert: true,
                    //revert: false,
                    helper: 'clone',
                    start: function(event, ui) {
                        $(this).fadeTo('fast', 0.5);
                        //$(this).css('cursor', 'text');
                        //$(this).hide();
                    },
                    stop: function(event, ui) {
                        $(this).fadeTo(0, 1);
                        //$(this).show("explode", { pieces: 16 }, 2000);
                    }
                });

                $(".publish-message").droppable({
                    hoverClass: 'active',
                    drop: function(event, ui) {
                        //this.value += $(ui.draggable).text();
                        //alert($("#droppable"));
                        insertAtCaret("message", $(ui.draggable).text());
                    },
                    over: function(event, ui) {
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

        graph.selectEmoji = function(short) {
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