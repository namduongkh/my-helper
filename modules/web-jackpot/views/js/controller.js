(function() {
    'use strict';

    angular
        .module("Jackpot")
        .controller("JackpotController", JackpotController);

    function JackpotController($http, $sce) {
        var jackpot = this;

        jackpot.getWinningPosition = function() {
            $http({
                    method: 'get',
                    url: "/api/jackpot/getWinningPosition"
                })
                .then(function(resp) {
                    console.log("Resp", resp);
                    jackpot.winnings = resp.data
                });
        };

        jackpot.getWinningPosition();
    }
})();