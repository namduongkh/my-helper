(function() {
    'use strict';

    angular.module("Common")
        .service("CommonSvc", CommonSvc);

    function CommonSvc() {
        return {
            publish_email: [
                { name: "Blog 18 tuổi", value: "openness.newthinkingnewlife.blog18@blogger.com" }
            ]
        };
    }
})();