(function() {
    'use strict';

    angular
        .module("app", ["Jackpot", "ngclipboard", "GetLink", "Common", "toastr", "angular-loading-bar",
            "Graph", "ngFacebook", 'ngSanitize'
        ])
        .config(function($interpolateProvider, $facebookProvider) {
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');

            $facebookProvider.setAppId(window.fb_app_id);
            $facebookProvider.setPermissions("email,publish_actions,user_managed_groups");
        })
        .run(function($window) {
            (function() {
                // If we've already installed the SDK, we're done
                if (document.getElementById('facebook-jssdk')) { return; }

                // Get the first script element, which we'll use to find the parent node
                var firstScriptElement = document.getElementsByTagName('script')[0];

                // Create a new script element and set its id
                var facebookJS = document.createElement('script');
                facebookJS.id = 'facebook-jssdk';

                // Set the new script's source to the source of the Facebook JS SDK
                facebookJS.src = '//connect.facebook.net/en_US/all.js';

                // Insert the Facebook JS SDK into the DOM
                firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
            }());
        });
})();