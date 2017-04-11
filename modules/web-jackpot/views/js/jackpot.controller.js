(function() {
    'use strict';

    angular
        .module("Jackpot")
        .controller("JackpotController", JackpotController);

    function JackpotController($http, $sce) {
        var jackpot = this;
        jackpot.winnings = [];

        jackpot.getWinningPosition = function(position) {
            $http({
                    method: 'post',
                    url: "/api/jackpot/getWinningPosition",
                    data: {
                        position: position
                    }
                })
                .then(function(resp) {
                    // console.log("Resp", resp);
                    jackpot.winnings[position] = resp.data
                });
        };

        jackpot.getWinnings = function() {
            for (var i = 0; i < 6; i++) {
                jackpot.getWinningPosition(i);
            }
        };

        jackpot.addWinning = function() {
            $http({
                    method: 'post',
                    url: "/api/jackpot/addWinningApi",
                    data: {
                        number: jackpot.add_winning.number,
                        date: jackpot.add_winning.date
                    }
                })
                .then(function(resp) {
                    console.log("Resp", resp);
                });
        };
    }
})();