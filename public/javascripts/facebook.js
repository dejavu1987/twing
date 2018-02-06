/*
var facebook = function () {
};
(function ($) {
    $(function () {
        window.fbAsyncInit = function () {
            console.log("Connecting to FB!");
            FB.init({
                xfbml: true,
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                appId: 527804323931798,
                frictionlessRequests: true
            });
            FB.getLoginStatus(function (response) {
                var loginStatus = response;
                if (response.status === 'connected') {
                    console.log("Logged in to FB!");
                    console.log(response);

                    var page_id = 524826927563869;
                    var user_id = response.authResponse.userID;
                    var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + "and uid=" + user_id;
                    FB.Data.query(fql_query).wait(function (rows) {
                        if (rows.length == 1 && rows[0].uid == user_id) {
                            $('<p>&copy; http://twing.jit.su 2013</p>').appendTo('#footer');
                        } else {
                            $.tmpl('likePage', {}).appendTo('#footer');
                        }
                    });


                    FBGetMe();
                    /!*console.log("Getting Twing player frens!");
                    FB.api('/me/friends?fields=installed', function (response) {
                        console.log('Got twing player frens!');
                        friends = response.data;
                        appFriends = friends.filter(function (a) {
                            return a.installed
                        }).map(function (b) {
                            return b.id;
                        });

                        socket.emit('get appFriends', appFriends);

                        if (appFriends.length > 50) {
                            sendMassGiftTo = appFriends.sort(function (a, b) {
                                return Math.random() - 0.5
                            });
                        } else {
                            sendMassGiftTo = appFriends;
                        }
                        var massGiftUsersHTML = "";
                        sendMassGiftTo.forEach(function (fbId) {
                            massGiftUsersHTML += '<div class="mass-user-thumb"><img src="https://graph.facebook.com/' + fbId + '/picture" /></div>'
                        });
                        $('.stage').append('<div class="overlay send-mass-gifts-overlay"><a href="#" class="cross close"><i class="icon-remove"></i></a><div class="overlay-wrapper"><h3>Gift your friends some coins.</h3>\n\
                <div class="desc clearfix">Send some coins to your friends who are in need of it. You may get some in return. :)     <br/> ' + massGiftUsersHTML + '  \n\
                </div><a href="#" class="send-mass-gifts button">Send Coins</a></div></div>');
                    });*!/

                } else {
                    console.log("FB not logged in!");
                    // not_authorized
                    if (document.referrer) {
                        // In the facebook iframe, redirect wont work.
                        if (document.referrer.match(/apps.facebook.com/)) {
                            console.log("FB App canvas detected!");
                            FBLogin();
                        } else {
                            console.log("No FB App canvas detected, redirecting to FB login page!");
                            window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
                        }
                    } else {
                        console.log("No FB App canvas detected, redirecting to FB login page!");
                        window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
                    }

                }
            });

            function FBGetMe() {
                FB.api('/me', function (response) {
                    var fbMe = {};
                    if (response.id) {
                        console.log("Got user info!");
                        fbMe = response;
                        console.log(response);
                    } else {
                        console.warn("Could not connect to graph server");
                        fbMe.id = loginStatus.userID;
                    }
                    $(document).trigger('facebookInitialized', fbMe);
                });
            }

            function FBLogin() {
                console.log("Attempting login FB!");
                FB.login(function (response) {
                    if (response.authResponse) {
                        console.log("Login success!");


                    } else {
                        console.log("Redirecting to FB page!");
                        window.location = "https://www.facebook.com/twingjitsu";
                    }
                }, {
                    scope: 'publish_actions,publish_stream'
                });
            }

        };
    });

})(jQuery);
*/
