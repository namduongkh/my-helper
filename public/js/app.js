(function() {
    'use strict';

    var app = angular.module("app", []);
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
    app.controller("MyCtrl", MyCtrl);

    function MyCtrl($http, $sce, $timeout) {
        var ctrl = this;
        ctrl.command_text_focus = true;
        ctrl.outputs = [{ status: true, data: "Simple SSH" }, { status: true, data: "Host: 117.3.65.102" }];
        ctrl.command_text_all;

        ctrl.style = function(input) {
            input = input.replace(/\n/g, "<br>");
            return $sce.trustAsHtml(input);
        };

        ctrl.command = function(e, command_text) {
            if (e.keyCode === 13 && command_text && command_text.trim() && !ctrl.disabled) {
                // ctrl.disabled = true;
                ctrl.outputs.push({
                    status: true,
                    data: command_text,
                    class: 'cmd-text'
                });
                ctrl.command_text_focus = false;
                $http({
                        method: 'post',
                        data: {
                            command_text: command_text
                        },
                        url: "/command"
                    })
                    .then(function(resp) {
                        if (resp.status == 200) {
                            // console.log("Data", resp.data);
                            resp.data.data.replace(/\n/g, "\n");
                            ctrl.outputs.push(resp.data);
                            if (ctrl.outputs.length > 100) {
                                ctrl.outputs.shift();
                            }
                            ctrl.command_text = "";
                            ctrl.disabled = false;
                            ctrl.command_text_focus = true;
                            $timeout(function() {
                                var objDiv = document.getElementById("terminal");
                                objDiv.scrollTop = objDiv.scrollHeight;
                            });
                        }
                        // console.log("Resp", resp);
                    })
                    .catch(function(err) {
                        console.log("err", err);
                        ctrl.disabled = false;
                    });
            }
        };
    }
})();