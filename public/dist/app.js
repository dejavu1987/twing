/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/javascripts/dlog.js":
/*!************************************!*\
  !*** ./public/javascripts/dlog.js ***!
  \************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function dlog(obj) {
  var objString = JSON.stringify(obj);
  var $dlogList = $('.dlog-list');
  var liclass = arguments[1] ? arguments[1] : 'notice';
  $dlogList.append("<li class=\"".concat(liclass, "\">").concat(objString, "</li>")); //          $('.dlog-wrapper').effect("shake", { direction: 'up', times:2, distance:2 },100);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dlog);

/***/ }),

/***/ "./public/javascripts/facebook.js":
/*!****************************************!*\
  !*** ./public/javascripts/facebook.js ***!
  \****************************************/
/*! namespace exports */
/*! export FBLogin [provided] [no usage info] [missing usage info prevents renaming] */
/*! export loginWithFacebook [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FBLogin": () => /* binding */ FBLogin,
/* harmony export */   "loginWithFacebook": () => /* binding */ loginWithFacebook
/* harmony export */ });
var FBLogin = function FBLogin() {
  console.log('Attempting login FB!');
  FB.login(function (response) {
    if (response.authResponse) {
      console.log('Login success!');
      FB.api('/me', function (response) {
        console.log('Got user FB info!');
        me.fbMe = response; //          console.log(myFB);

        socket = io.connect();
        socketEvents();
      });
    } else {
      console.log('Redirecting to FB page!');
      window.location = 'https://www.facebook.com/twingjitsu';
    }
  }, {
    scope: 'public_profile,email'
  });
};
function loginWithFacebook() {
  if (document.referrer) {
    // In the facebook iframe, redirect wont work.
    if (document.referrer.match(/apps.facebook.com/)) {
      console.log('FB App canvas detected!');
      FBLogin();
    } else {
      console.log('No FB App canvas detected, redirecting to FB login page!');
      FBLogin(); // window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
    }
  } else {
    console.log('No FB App canvas detected, redirecting to FB login page!');
    FBLogin(); // window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
  }
}

/***/ }),

/***/ "./public/javascripts/index.js":
/*!*************************************!*\
  !*** ./public/javascripts/index.js ***!
  \*************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dlog_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dlog.js */ "./public/javascripts/dlog.js");
/* harmony import */ var _facebook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./facebook.js */ "./public/javascripts/facebook.js");
/* harmony import */ var _sounds_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sounds.js */ "./public/javascripts/sounds.js");
/* harmony import */ var _twing_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./twing.js */ "./public/javascripts/twing.js");
;



var twing = new _twing_js__WEBPACK_IMPORTED_MODULE_3__.default();
var me = {}; // var currentUrl = `${window.location.protocol}//${window.location.host}/${window.location.pathname}`;

var friends = [];
var appFriends = [];
var sendMassGiftTo = [];
var socketEventsBinded = false;
var isiPad = navigator.userAgent.match(/iPad/i) != null; // var page_id = 524826927563869;

var app_id = 527804323931798;
$(function () {
  alert('In $ callback');
  var draggingBlock = false;
  var socket;

  window.fbAsyncInit = function () {
    console.log('Initializing to FB!');
    FB.init({
      xfbml: true,
      status: true,
      // check login status
      cookie: true,
      // enable cookies to allow the server to access the session
      appId: app_id,
      frictionlessRequests: true
    });
    console.log('Getting login status!');
    FB.getLoginStatus(function (response) {
      var loginStatus = response;

      if (response.status === 'connected') {
        console.log('Logged in to FB!');
        console.log(response); // var user_id = response.authResponse.userID;
        // var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + "and uid=" + user_id;
        // FB.Data.query(fql_query).wait(function (rows) {
        //     if (rows.length == 1 && rows[0].uid == user_id) {
        //     } else {
        //     }
        // });

        $('<p>&copy; https://apps.facebook.com/twingjitsu 2013</p>').appendTo('#footer');
        $.tmpl('likePage', {}).appendTo('#footer');
        FB.api('/me', function (meRes) {
          if (meRes.id) {
            console.log('Got user info!');
            me.fbMe = meRes;
            socket = io.connect();
            socketEvents();
            console.log(meRes);
          } else {
            console.warn('Could not connect to graph server');
            me.fbMe = {};
            me.fbMe.id = loginStatus.userID;
            socket = io.connect();
            socketEvents();
          }
        });
        console.log('Getting Twing player frens!');
        FB.api('/me/friends?fields=installed', function (response) {
          console.log('Got twing player frens!');
          friends = response.data;
          appFriends = friends.filter(function (a) {
            return a.installed;
          }).map(function (b) {
            return b.id;
          });
          socket.emit('get appFriends', appFriends);

          if (appFriends.length > 50) {
            sendMassGiftTo = appFriends.sort(function (a, b) {
              return Math.random() - 0.5;
            });
          } else {
            sendMassGiftTo = appFriends;
          }

          var massGiftUsersHTML = '';
          sendMassGiftTo.forEach(function (fbId) {
            massGiftUsersHTML += "<div class=\"mass-user-thumb\"><img src=\"https://graph.facebook.com/".concat(fbId, "/picture\" /></div>");
          });
          $('.stage').append("<div class=\"overlay send-mass-gifts-overlay\">\n            <a href=\"#\" class=\"cross close\"><i class=\"icon-remove\"></i></a>\n            <div class=\"overlay-wrapper\">\n            <h3>Gift your friends some coins.</h3>\n                <div class=\"desc clearfix\">Send some coins to your friends who are in need of it. You may get some in return. :)\n                <br/> ".concat(massGiftUsersHTML, "  \n                </div>\n                <a href=\"#\" class=\"send-mass-gifts button\">Send Coins</a>\n              </div>\n            </div>"));
        });
      } else {
        console.log('FB not logged in!');
        showLoginOptionsAndLogin();
      }
    });
  };

  function showLoginOptionsAndLogin() {
    // if (confirm('Do you want to login with facebook?')) {
    //   loginWithFacebook();
    // } else {
    me.fbMe = {};
    me.fbMe.id = Math.round(Math.random() * 9999999);
    me.fbMe.name = localStorage.getItem('twing.name') || prompt('Enter a Nickname!');
    localStorage.setItem('twing.name', me.fbMe.name);
    socket = io.connect();
    socketEvents(); // }
  }

  var userLevelCalculate = function userLevelCalculate(score) {
    console.log('calculating score');
    var level = {};
    level.level = Math.floor(Math.sqrt(score / 1000)) + 1;
    level.thisLevelIn = Math.pow(level.level - 1, 2) * 1000;
    level.nextLevelIn = Math.pow(level.level, 2) * 1000;
    level.levelProgress = Math.floor((score - level.thisLevelIn) / (level.nextLevelIn - level.thisLevelIn) * 100);
    return level;
  };

  var getRandomFrineds = function getRandomFrineds(count) {
    console.log('getting random frens');
    var allFriends = friends.map(function (b) {
      return b.id;
    });

    if (allFriends.length > count) {
      return allFriends.sort(function (a, b) {
        return Math.random() - 0.5;
      }).slice(0, count);
    } else {
      return allFriends;
    }
  };

  function updateMeInfo(callback) {
    console.log('Updating my info!');
    var $me = $('.me-info');
    var level = userLevelCalculate(me.score);
    me.level = level.level;
    twing.gifts['coinsLvl'] = me.level * 10 + ' coins';
    me.thisLevelIn = level.thisLevelIn;
    me.nextLevelIn = level.nextLevelIn;
    me.levelProgress = level.levelProgress;
    $('.me-image').empty().append("<img class=\"me-thumb\" src=\"https://graph.facebook.com/".concat(me.fbMe.id, "/picture\">"));
    $me.empty();
    $me.append("<div class=\"me-name\">".concat(me.fbMe.name, "</div>"));
    $me.append("<div class=\"me-money\">".concat(me.money, "</div>"));
    $me.append("<div class=\"me-level\" title=\"Next level at scores of ".concat(me.nextLevelIn, "!\" >\n    <div class=\"me-level-progress\"><div class=\"me-level-text\">Level ").concat(me.level, "</div><div class=\"filler\" style=\"width:").concat(me.levelProgress, "%\"></div></div></div>"));
    $me.append('<div class="theme"></div><div class="my-score"></div>');
    if (callback) callback();
  }

  function socketEvents() {
    console.log('Loading sounds');
    var joinedSound = new _sounds_js__WEBPACK_IMPORTED_MODULE_2__.default('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-46416/zapsplat_technology_videogame_controller_xbox_set_down_wood_table_002_47651.mp3');
    console.log('Loading socket events!');
    socket.on('connect', function () {
      console.log('Socket connected to server!');
      getNickname();

      if (!socketEventsBinded) {
        socket.on('problem', function (e) {
          console.error(e);
          twing.dAlert(JSON.stringify(e), 'error');
        });
        socket.on('my stats', function (myStats) {
          var $1 = $('.loading.overlay');
          $1.fadeOut(function () {
            $1.remove();
          });
          console.log('Registered!! Got my stats!');
          me.score = myStats.score;
          me.money = myStats.money;
          updateMeInfo(function () {
            socket.emit('notifications');
          });
        });
        socket.on('drag', onDrag);
        socket.on('cursor move', onCursorMove);
        socket.on('add me', function (me) {
          //            console.log("add me - me");
          joinedSound.play();
          console.log(me);
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)(me.name + ' joined!!', 'success');
          addCursors(me);
          addScore(me);
        });
        socket.on('hosts', function (hosts) {
          console.log('Got hosts!');
          $('.leave-room').remove();
          $('.side-box.menu .create-host').show();
          showHosts(hosts);
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)('<strong>PRESS ENTER to chat!</strong>', 'success');
        });
        socket.on('waiting for players', function () {
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)('Waiting for other players', 'error');
          $('.stage').append($.tmpl('instructions'));
        });
        socket.on('stage ready', function (data) {
          console.log(data);
          $('.overlay.waiting-for-players').remove();
          addDraggables(data);
          sortBlocks(data);
          stageReady();
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)("The game begins!!!! Theme is ".concat(data.theme.name), 'success');
          $('.theme').html(data.theme.name);
        });
        socket.on('userlist', function (_ref) {
          var me = _ref.me,
              roomName = _ref.roomName,
              users = _ref.users;
          twing.registerMe(me.name, me.room, me.sid, me.score, me.fbMe);
          var $room = $('.room');
          $room.empty();
          $room.append("<strong> ".concat(roomName, "</strong>")); //console.log(users);

          if (roomName != 'lobby') {
            $('.stage').append('<div class="overlay"><div class="ready-wrapper"><a href="#" class="ready button">READY</a></div></div>');
            $('.hosts').remove();
          }

          $('.scores-list').empty();

          for (var userID in users) {
            addCursors(users[userID]);
            addScore(users[userID]);
          }

          $('.side-box.menu .create-host').hide();
          $('.side-box.menu .leave-room').remove();
          $('.invite').before('<a href="#" class="leave-room button">Leave</a>');
        });
        socket.on('room left', function () {
          $('.scores-list').empty();
          $('.leave-room').remove();
          $('.side-box.menu .create-host').show();
        });
        socket.on('matched', function (data) {
          //                dlog(data.name+" Matched "+data.block+"!",'success');
          var newScore = 100;
          if (data.block % 11 == 0 || data.block > 39) newScore += 100;
          $("#".concat(data.id, "-score")).find('.score').text(parseInt($("#".concat(data.id, "-score")).find('.score').text()) + newScore);
          lockBlock(data.block);
        });
        socket.on('leave', function (leaver) {
          twing.dAlert("".concat(leaver, " left!"), 'error');
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)("".concat(leaver, " left!"), 'error');
          removeCursors(leaver);
          removeScore(leaver);
        });
        socket.on('highscores', function (scores) {
          var highscoresHtml = '';
          $(scores).each(function () {
            var itemClass = this.fbID == me.fbMe.id ? 'me' : '';
            highscoresHtml += "\n            <li class=\"user-thumbnail ".concat(itemClass, "\">\n              <div class=\"user-thumbnail-img-wrapper\">\n                <img\n                  class=\"user-thumbnail-img\"\n                  src=\"https://graph.facebook.com/").concat(this.fbID, "/picture?width=100&height=100\"\n                />\n                <div class=\"user-thumb-level\">\n                  ").concat(userLevelCalculate(this.score).level, "\n                </div>\n              </div>\n              <div class=\"user-thumb-name\">").concat(this.name, "</div>\n              <div class=\"user-thumb-score\">").concat(this.score, "</div>\n              <div class=\"user-thumb-money\">").concat(this.money, "</div>\n            </li>");
          });
          $('.stage').append("<div class=\"overlay highscores\">\n                <a href=\"#\" class=\"close cross\"><i class=\"icon-remove\"></i></a>\n                <div class=\"highscores-wrapper\">\n                  <h3>Highscores</h3>\n                  <div class=\"desc clearfix\">\n                    <ul id=\"sort-by\">\n                      <li><a href=\"#name\">Name</a></li>\n                      <li><a href=\"#score\">Scores</a></li>\n                      <li><a href=\"#money\">Coins</a></li>\n                    </ul>\n                    <ul class=\"board-list clearfix\">\n                      ".concat(highscoresHtml, "\n                    </ul>\n                  </div>\n                </div>\n              </div>"));
          $('.board-list').slimScroll({
            height: 456
          });
          $('.board-list').isotope({
            animationEngine: 'best-available',
            getSortData: {
              name: function name($elem) {
                return $elem.find('.user-thumb-name').text();
              },
              score: function score($elem) {
                return -parseInt($elem.find('.user-thumb-score').text());
              },
              money: function money($elem) {
                return -parseInt($elem.find('.user-thumb-money').text());
              }
            },
            animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
            }
          });
          $('#sort-by a').click(function () {
            // get href attribute, minus the '#'
            var sortName = $(this).attr('href').slice(1);
            $('.board-list').isotope({
              sortBy: sortName,
              animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
              }
            });
            return false;
          });
        });
        socket.on('notifications', function (notifications) {
          var notificationsHtml = '';
          $(notifications).each(function () {
            var phrase = this.type == 'gift' ? ' sent you ' : ' is in need of ';
            var amount = this.amount + ' coins';
            var label = phrase + amount + '!';
            var actionText = this.type == 'gift' ? ' Accept ' : ' Send ';
            notificationsHtml += "<li class=\"clearfix notification-item ".concat(this.type, "\">\n              <div class=\"notification-img-wrapper\">\n                <img\n                  class=\"notification-user-img\"\n                  src=\"https://graph.facebook.com/").concat(this.senderID, "/picture\"\n                />\n              </div>\n              <div class=\"notification-label\">").concat(label, "</div>\n              <div class=\"notification-action\">\n                <a\n                  class=\"accept-").concat(this.type, " button\"\n                  data-amount=\"").concat(this.amount, "\"\n                  data-action-id=\"").concat(this._id, "\"\n                  data-sender=\"").concat(this.senderID, "\"\n                  data-name=\"").concat(this.name, "\"\n                  >").concat(actionText, "</a\n                >\n              </div>\n            </li>\n            ");
          });
          notificationsHtml = notificationsHtml ? notificationsHtml : "<li class=\"clearfix notification-item empty-notifications\">\n                <div class=\"notification-img-wrapper\">\n                  <img class=\"notification-user-img\" src=\"images/empty-50.png\" />\n                </div>\n                <div class=\"notification-label\">\n                  No new notifications! Need some coins? Ask for coins with your friends!\n                </div>\n                <div class=\"notification-action\">\n                  <a class=\"send-mass-help-request button\">Ask for Coins</a>\n                </div>\n              </li>";
          $('.stage').append("<div class=\"overlay notifications\">\n                <a href=\"#\" class=\"close cross\"><i class=\"icon-remove\"></i></a>\n                <div class=\"notifications-wrapper\">\n                  <h3>Notifications</h3>\n                  <div class=\"desc clearfix\">\n                    <ul class=\"board-list\">\n                      ".concat(notificationsHtml, "\n                    </ul>\n                  </div>\n                </div>\n              </div>\n              "));
          $('.board-list').slimScroll({
            height: 456
          });
        });
        socket.on('remove room', function (room) {
          $('.hosts-list>li.' + room).remove();
        });
        socket.on('refresh rooms', function (hosts) {
          if ($('.hosts').length) {
            $('.hosts').remove();
            showHosts(hosts);
          }
        });
        socket.on('challenge', function (challenger, duel) {
          console.log('New Dual Challenge!'); //            console.log(challenger);

          var duelOverlay = "<div class=\"overlay duel-overlay\">\n                  <div class=\"overlay-wrapper\">\n                    <div class=\"desc\">\n                      <div class=\"user-thumb\">\n                        <img src=\"https://graph.facebook.com/".concat(challenger.fbMe.id, "/picture\" />\n                      </div>\n                      ").concat(challenger.fbMe.name, " has challenged you for a duel. <br />Bet amount: $\n                      ").concat(duel.bet, "\n                    </div>\n                    <div class=\"actions clearfix\">\n                      <a\n                        href=\"#\"\n                        class=\"accept-duel button\"\n                        data-duel-id=\"").concat(duel.id, "\"\n                        id=\"close-overlay\"\n                        >Accept</a>\n                      <a\n                        href=\"#\"\n                        class=\"reject-duel button\"\n                        data-duel-id=\"").concat(duel.id, "\"\n                        id=\"close-overlay\"\n                        >Reject</a>\n                    </div>\n                  </div>\n                </div>\n                ");
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable();
        });
        socket.on('duel accepted', function (duel) {
          console.log('Dual Challenge Accepted!');
          var duelOverlay = "\n              <div class=\"overlay duel-overlay\">\n                <div class=\"overlay-wrapper\">\n                  <div class=\"desc\">\n                    <div class=\"user-thumb\">\n                      <img src=\"https://graph.facebook.com/".concat(duel.target.fbMe.id, "/picture\" />\n                    </div>\n                    ").concat(duel.target.fbMe.name, " has accepted your challenge for a duel.\n                  </div>\n                  <div class=\"actions clearfix\">\n                    <a\n                      href=\"#\"\n                      class=\"join-duel button\"\n                      data-duel-id=\"").concat(duel.id, "\"\n                      id=\"close-overlay\"\n                      >Join</a\n                    >\n                  </div>\n                </div>\n              </div>");
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable();
        });
        socket.on('duel rejected', function (duel) {
          console.log('Dual Challenge Rejected!');
          var duelOverlay = "<div class=\"overlay duel-overlay\">\n            <a href=\"#\" class=\"close cross\"><i class=\"icon-remove\"></i></a>\n            <div class=\"overlay-wrapper\">\n              <div class=\"desc\">\n                <div class=\"user-thumb\">\n                  <img src=\"https://graph.facebook.com/".concat(duel.target.fbMe.id, "/picture\" />\n                </div>\n                ").concat(duel.target.fbMe.name, " has rejected your challenge for a duel.\n              </div>\n            </div>\n          </div>\n          ");
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable;
        });
        socket.on('gift', function (data) {
          console.log('New Gift!');
          var duelOverlay = "<div class=\"overlay gift-overlay volatile\">\n            <a href=\"#\" class=\"close cross\"><i class=\"icon-remove\"></i></a>\n            <div class=\"overlay-wrapper\">\n              <div class=\"desc\">\n                <div class=\"user-thumb\">\n                  <img src=\"https://graph.facebook.com/".concat(data.sender.fbMe.id, "/picture\" />\n                </div>\n                ").concat(data.sender.fbMe.name, " has sent you ").concat(twing.gifts[data.gift], ".\n                <div class=\"actions clearfix\"></div>\n              </div>\n            </div>\n          </div>\n          ");
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable();
        });
        socket.on('appFriends', function (data) {
          console.log('Got AppFriends score data!');
          console.log(data);
          data = data.map(function (a) {
            a.level = Math.floor(Math.sqrt(a.score / 1000)) + 1;
            return a;
          });
          $.tmpl('friend', data).appendTo('.friends-list');
          var $friends = $('.friends-list');
          $friends.width($('.friends-list>li').length * 200);
          $friends.mousewheel(function (e) {
            e.preventDefault();
            scrollFriends(e.originalEvent);
          });
        });
        socket.on('game over', function (users) {
          console.log('Game Over!'); //           console.log(users);

          leaveRoom();
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)('Game Over!!!', 'error');
          var scoreHtml = '';
          var userListHtml = '';
          var scores = [];

          for (var userID in users) {
            scores.push({
              id: users[userID].fbMe.id,
              name: users[userID].name,
              currScore: users[userID].currScore,
              betMoney: users[userID].betMoney
            });
          }

          scores.sort(function (a, b) {
            return b.currScore - a.currScore;
          });
          $(scores).each(function () {
            var classes = '';

            if (this.id == me.fbMe.id) {
              FB.api('/me/scores/', 'post', {
                score: this.currScore
              }, function (response) {
                console.log('My Score posted to FB!'); //                  console.log(response);
              });
              classes = 'me'; //                console.log('me before score alter');
              //                console.log(me);
              //                console.log('currScore');
              //                console.log(this.currScore);
              //                console.log('betmoney');
              //                console.log(this.betMoney?this.betMoney:10);

              me.score += this.currScore;
              me.money += this.betMoney ? this.betMoney : 10;
              updateMeInfo();
            } else {
              userListHtml += "".concat(this.name, " (").concat(this.currScore, ")<br>\n                   ");
            }

            scoreHtml = "\n              <li class=\"final-score-item ".concat(classes, "\">\n                <img\n                  class=\"list-user-thumb\"\n                  src=\"https://graph.facebook.com/").concat(this.id, "/picture\"\n                />\n                <label>").concat(this.name, "</label> <span class=\"score\">").concat(this.currScore, "</span>\n              </li>");
          });
          var shareBtn = '';

          if (scores[0].id == me.fbMe.id) {
            shareBtn = '<a href="#" class="share brag button"><i class="icon-trophy"></i> Share</a>';
            window.bragData = {
              userListHtml: userListHtml,
              scores: scores
            };
          }

          $('.stage').append("<div class=\"overlay final-scores\">\n            <a href=\"#\" class=\"close cross\"><i class=\"icon-remove\"></i></a>\n            <div class=\"game-over-wrapper\">\n              <h3>GAME OVER</h3>\n              <div class=\"desc clearfix\">\n                Scoreboard:\n                <ol class=\"board-list\">\n                  ".concat(scoreHtml, "\n                </ol>\n                ").concat(shareBtn, "\n                <a href=\"#\" class=\"close button red\"><i class=\"icon-remove\"></i> close</a>\n              </div>\n            </div>\n          </div>\n          "));
        });
        socket.on('message', function (data) {
          (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)("".concat(data.name, " > ").concat(data.message), 'message'); //            $('#'+data.name+"-cursor").find('span.status').text(data.message);
        });
      } else {
        console.log('Reconnected with server!');
      }

      socketEventsBinded = true;
    });

    function onDrag(data) {
      $(".draggable[rel=".concat(data.block, "]")).css({
        top: data.position.top,
        left: data.position.left
      });
    }

    function onCursorMove(data) {
      var cursor = document.getElementById("".concat(data.id, "-cursor")); // var sp = $('.stage').position();

      if (cursor) {
        cursor.style.left = "".concat(data.position.left, "px");
        cursor.style.top = "".concat(data.position.top, "px");
      }
    }
  }

  $(document).ready(function () {
    if (!isiPad) {
      $(document).tooltip();
    }

    $('.progressbar').progressbar({
      value: false
    });
    var $body = $('body');
    $body.delegate('.close', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.overlay').remove();
    });
    $body.delegate('.share.brag', 'click', function (e) {
      e.preventDefault();
      brag(bragData);
    });
    $body.delegate('.send-mass-gifts', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.overlay').remove();

      if (sendMassGiftTo.length <= 50) {
        FB.ui({
          method: 'apprequests',
          title: 'Gift some coins!',
          to: sendMassGiftTo,
          message: 'Here are some coins. You may use them to bet on duel games.'
        }, function (response) {
          socket.emit('mass request', {
            targets: response.to,
            name: 'coins10',
            type: 'gift',
            amount: 10
          });
        });
      } else {
        var pages = Math.ceil(sendMassGiftTo.length / 50);

        for (var i = 0; i < pages; i++) {
          FB.ui({
            method: 'apprequests',
            title: 'Gift some coins!',
            to: sendMassGiftTo.splice(0, 50),
            message: 'Here are some coins. You may use them to bet on duel games.'
          }, function (response) {
            console.log(response.to);
            socket.emit('mass request', {
              targets: response.to,
              name: 'coins10',
              type: 'gift',
              amount: 10
            });
          });
        }
      }
    });
    $body.delegate('.send-mass-help-request', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.overlay').remove();
      FB.ui({
        method: 'apprequests',
        title: 'Ask for coins!',
        to: getRandomFrineds(50),
        message: 'I am out of coins, Please send me some.'
      }, function (response) {
        socket.emit('mass request', {
          targets: response.to,
          name: 'coins10',
          type: 'help',
          amount: 10
        });
      });
    });
    $body.delegate('.accept-help', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.notification-item').fadeOut('slow');
      var actionID = $(e.currentTarget).attr('data-action-id');
      var target = {
        uid: $(e.currentTarget).attr('data-sender'),
        sid: 'offline'
      };
      FB.ui({
        method: 'apprequests',
        title: 'Send coins!',
        to: target.uid,
        message: 'Here are some coins. You may use them to bet on duel games.'
      }, function (response) {
        socket.emit('mass request', {
          targets: [target.uid],
          name: 'coinsLvl',
          type: 'gift',
          amount: me.level * 10
        });
        socket.emit('accept help', actionID);
      });
    });
    $body.delegate('a.highscores.button', 'click', function (e) {
      e.preventDefault();
      socket.emit('highscores');
    });
    $body.delegate('a.notifications.button', 'click', function (e) {
      e.preventDefault();
      socket.emit('notifications');
    });
    $body.delegate('.invite', 'click', function (e) {
      e.preventDefault();
      FB.ui({
        method: 'apprequests',
        title: 'Lets Twing!',
        message: 'I am online can you join me right now. Twing is a multiplayer puzzle game.'
      }, function (response) {//        console.log(response.to);
      });
    });
    $body.delegate('.hosts-list>li.available-true>a', 'click', function (e) {
      e.preventDefault();
      $('.hosts').remove();
      socket.emit('join room', $(this).attr('rel'));
    });
    $body.delegate('.hosts-list>li.available-false>a', 'click', function (e) {
      e.preventDefault();
      (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)('You cant join this game, the game is in progress!', 'error');
    });
    $body.delegate('.create-host', 'click', function (e) {
      e.preventDefault();
      $('.hosts').remove();
      socket.emit('create room', {
        roomID: '',
        bet: 0
      });
    });
    $body.delegate('li.user-context', 'click', function (e) {
      showContextMenu(e);
    });
    $body.delegate('li.user-context', 'mouseleave', function (e) {
      $('.context-menu').remove();
    });
    $body.delegate('li.context-link', 'click', function (e) {
      e.stopPropagation();
      $('.context-menu').remove();
      var action = $(e.currentTarget).attr('data-action');
      var target = {
        uid: $(e.currentTarget).attr('data-uid'),
        sid: $(e.currentTarget).attr('data-sid')
      };
      var amount = 0;

      if (action == 'challenge') {
        var targetMoney = $(e.currentTarget).attr('data-money');
        var maxBet = targetMoney < me.money ? targetMoney : me.money;
        var userBet = parseInt(prompt('Enter Bet Amount, MAX: ' + maxBet));
        userBet = userBet ? userBet : 10;
        userBet = userBet > 0 ? userBet : 10;
        amount = userBet > maxBet ? maxBet : userBet;
      }

      doActionOnUser({
        action: action,
        target: target,
        amount: amount
      });
      $('.context-menu').remove();
    });
    $body.delegate('.accept-duel', 'click', function (e) {
      e.preventDefault();
      var duel = $(e.currentTarget).attr('data-duel-id');
      socket.emit('accept duel', duel);
      $('.overlay').remove();
    });
    $body.delegate('.reject-duel', 'click', function (e) {
      e.preventDefault();
      var duel = $(e.currentTarget).attr('data-duel-id');
      socket.emit('reject duel', duel);
      $(e.currentTarget).closest('.overlay').remove();
    });
    $body.delegate('.join-duel', 'click', function (e) {
      e.preventDefault();
      var duel = $(e.currentTarget).attr('data-duel-id');
      socket.emit('join duel', duel);
      $('.overlay').remove();
    });
    $body.delegate('.get-level-coins', 'click', function (e) {
      e.preventDefault();
      $this = $(this);
      if ($this.hasClass('disabled')) return false;
      $this.addClass('disabled');
      var target = $(e.currentTarget).attr('data-fbId');
      var data = {};
      data.targets = [target];
      data.type = 'help';
      data.name = 'coinsLvl';
      data.amount = $(e.currentTarget).attr('data-amount');
      FB.ui({
        method: 'apprequests',
        title: 'Ask for coins!',
        to: target,
        message: 'I am out of coins, Please send me some.'
      }, function (response) {
        socket.emit('mass request', data);
      });
    });
    $body.delegate('.accept-gift', 'click', function (e) {
      $(this).closest('.notification-item').fadeOut('slow');
      e.preventDefault();
      var actionId = $(e.currentTarget).attr('data-action-id');
      var amount = $(e.currentTarget).attr('data-amount');
      me.money += parseInt(amount);
      updateMeInfo();
      socket.emit('accept gift', actionId);
    });
    $body.delegate('.leave-room', 'click', function (e) {
      e.preventDefault();
      leaveRoom();
    });
    $body.delegate('.ready', 'click', function (e) {
      e.preventDefault();
      $('.overlay').remove();
      socket.emit('ready');
    }); //            $body.delegate('.rematch','click',function(e){
    //              e.preventDefault();
    //              $('.overlay').remove();
    //              socket.emit('rematch');
    //              addDraggables();
    //            });
    //          $('#sidebar').draggable();
  });
  $(window).keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      var msg = prompt('Message');

      if (msg) {
        socket.emit('message', msg);
        (0,_dlog_js__WEBPACK_IMPORTED_MODULE_0__.default)('Me > ' + msg, 'my-message');
      }
    }
  });

  function fbCallback(response) {
    console.log(response);
  }

  function getNickname() {
    console.log('Attempting to register in the game!');
    socket.emit('register me', me.fbMe);
  }

  function addScore(user) {
    //      console.log("addScore user");
    //      console.log(user);
    if (!$('#' + user.id + '-score').length && user.name != 'unnamed') $('.scores-list').append("<li\n        class=\"others-score user-context\"\n        id=\"".concat(user.id, "-score\"\n        data-uid=\"").concat(user.fbMe.id, "\"\n        data-sid=\"").concat(user.id, "\"\n        data-money=\"").concat(user.money, "\"\n        data-name=\"").concat(user.fbMe.name, "\"\n      >\n        <img\n          class=\"list-user-thumb\"\n          src=\"https://graph.facebook.com/").concat(user.fbMe.id, "/picture\"\n        />\n        <label>").concat(user.name, "</label>\n        [<span class=\"score\">0</span>]\n      </li>"));
  }

  function removeScore(user) {
    $('.scores-list').find('#' + user.id + '-score').remove();
  }

  function addCursors(user) {
    if (!$("#".concat(user.sid, "-cursor")).length && user.name != 'unnamed') $('.stage').append("<div class=\"cursor ".concat(user.fbMe.gender, "\" id=\"").concat(user.sid, "-cursor\">\n          ").concat(user.name, "<span class=\"status\"></span>\n        </div>"));
  }

  function removeCursors(user) {
    $('#' + user.id + '-cursor').remove();
  }

  function showHosts(hosts) {
    var hostsList = '';
    var noHosts = true;

    for (var hostName in hosts) {
      if (hostName != 'lobby') {
        noHosts = false;
        var availableTip = '';
        var availableFlag = false;

        if (!hosts[hostName].available) {
          availableTip = "The host ".concat(hosts[hostName].name, " has already started the game! Join another host or Host a new game.");
        } else if (hosts[hostName].players.length > 4) {
          availableTip = "".concat(hosts[hostName].name, " is full! Join another host or Host a new game.");
        } else {
          availableTip = "Click to join ".concat(hosts[hostName].name);
          availableFlag = true;
        }

        hostsList += "<li class=\"".concat(hosts[hostName].name, " available-").concat(availableFlag, "\">\n            <a title=\"").concat(availableTip, "\" href=\"#\" rel=\"").concat(hostName, "\"\n              ><strong>").concat(hosts[hostName].name, "</strong> (<strong class=\"host-player-count\"\n                >").concat(hosts[hostName].players.length, "</strong\n              >/5)</a\n            >\n            <div class=\"players-in-host\">\n              <span>").concat(hosts[hostName].players.join('</span><span>'), "</span>\n            </div>\n          </li>");
      }
    }

    if (noHosts) {
      hostsList = "<li>There are no hosts available right now.</li>\n        <li>Host new game by clicking on the button below.</li>\n        <li>You can chat with the players by pressing ENTER.</li>\n        <li>The online players are listed on the green bar.</li>\n        <li>\n          If nobody is online, Invite your close friends to play realtime, Click on\n          Invite Friends button on the right.\n        </li>\n        <li>Play frequently and you stand a chance to be on the highscores list.</li>\n        <li>View the highscores list by clicking on the Highscores button.</li>";
    }

    $('.stage').append("<div class=\"overlay hosts\">\n      <div class=\"overlay-wrapper\">\n        <h3>Hosts</h3>\n        <div class=\"desc clearfix\">\n          <ol class=\"hosts-list\">\n            ".concat(hostsList, "\n          </ol>\n          <a class=\"button create-host\">Host a new game</a>\n        </div>\n      </div>\n    </div>\n    "));
  }

  function lockBlock(block) {
    $(".draggable[rel=".concat(block, "]")).remove();

    if (!$('.draggable').length) {
      socket.emit('game over');
    }

    $(".droppable[rel=".concat(block, "]")).addClass('lost');
  } // Rearrange the Blocks after reading the maps from server


  function sortBlocks(data) {
    var $draggables = $('.draggable');
    var elements = [];
    var x, y;
    $.each(data.draggables, function (i, position) {
      switch (data.mode) {
        //Block size is 95px so multiples of it like 95 190 285 are something representing number of blocks
        case 1:
          y = Math.floor(i / 8) * 95;
          x = i % 8 * 95;
          break;

        case 2:
          y = 190 + Math.floor(i / 8) * 20;
          x = 190 + i % 8 * 43;
          break;

        case 3:
          y = 95 + Math.floor(i / 8) * 60;
          x = 190 + i % 8 * 43;
          break;

        case 4:
          y = 95 + Math.floor(i / 8) * 60;
          x = 285 + i % 8 * 14;
          break;

        case 5:
          y = 190 + Math.floor(i / 8) * 20;
          x = i % 8 * 95;
          break;

        case 6:
          y = Math.floor(i / 8) * 95;
          x = 285 + i % 8 * 14;
          break;

        case 7:
          y = Math.floor(i / 8) * 95;
          x = i % 8 * 95 / (Math.floor(i / 8) + 1);
          break;

        default:
          y = Math.floor(i / 8) * 95;
          x = i % 8 * 95;
          break;
      }

      $draggables.eq(position - 1).css({
        left: x,
        top: y
      });
      elements.push($draggables.get(position - 1));
    });
    $('.stage').append(elements);
    var $droppables = $('.droppable');
    var elements = [];
    $.each(data.droppables, function (i, position) {
      elements.push($droppables.get(position - 1));
    });
    $('.stage').append(elements);
  }

  function stageReady() {
    $('.draggable').draggable({
      containment: 'parent',
      start: function start() {
        console.log('started dragging');
        draggingBlock = true;
      },
      stop: function stop() {
        console.log('stopped dragging');
        draggingBlock = false;
      },
      drag: $.debounce(15, onBlockDrag) // }

    });

    function onBlockDrag(event, ui) {
      // if (ui.position.left % requestDelay == 0 || ui.position.top % requestDelay == 0) {
      // var sp = $('.stage').position();
      socket.emit('drag', {
        id: me.id,
        block: $(event.target).attr('rel'),
        position: {
          left: ui.position.left,
          top: ui.position.top
        }
      });
    }

    $('.droppable').droppable({
      accept: '.draggable',
      drop: function drop(event, ui) {
        if ($(event.target).attr('rel') == ui.draggable.attr('rel')) {
          var block = parseInt($(event.target).attr('rel'));
          $(event.target).addClass('matched');
          ui.draggable.remove();
          var newScore = 100;
          if (block % 11 == 0 || block > 39) newScore += 100;
          $('.my-score').text(parseInt($('.my-score').text()) + newScore);
          socket.emit('matched', block);

          if (!$('.draggable').length) {
            socket.emit('game over');
          }
        } else {
          var sp = $('.stage').position();
          socket.emit('drag', {
            block: ui.draggable.attr('rel'),
            position: {
              left: ui.position.left,
              top: ui.position.top
            }
          });
        }
      }
    });
    $('.stage').addClass('game-running').on('mousemove', $.debounce(15, onStageMouseMove));
  }

  function onStageMouseMove(e) {
    if (!draggingBlock) {
      // if (e.clientX % requestDelay == 0 || e.clientY % requestDelay == 0) {
      var sp = $('.stage').position();
      socket.emit('cursor move', {
        left: e.clientX - sp.left,
        top: e.clientY - sp.top
      }); // }
    }
  }

  function addDraggables(data) {
    $('.stage draggable,.stage droppable').remove();
    $('.my-score').text('0');

    for (var i = 1; i <= data.draggables.length; i++) {
      var classes = '';

      if (i % 11 == 0 || i > 39) {
        classes = 'bonus';
      }

      var offset = 61439 + data.theme.start;
      var decVal = i + offset;

      if (decVal >= 61619 && decVal <= 61631) {
        decVal += 50;
      }

      var hexVal = decVal.toString(16);

      while (hexVal.match(/f$/)) {
        hexVal = (offset + parseInt(50 + Math.random() * 50)).toString(16);
      }

      console.log(i);
      console.log(hexVal);
      $('.stage').append("<div class=\"draggable ".concat(classes, "\" rel=\"").concat(i, "\">&#x").concat(hexVal, ";</div>")).append("<div class=\"droppable\" rel=\"".concat(i, "\">&#x").concat(hexVal, ";</div>"));
    }
  }

  function showContextMenu(e) {
    var $context = $(e.currentTarget);
    $context.append("<div class=\"context-menu clearfix glass\">\n              <div class=\"context-img\"><img src=\"https://graph.facebook.com/".concat($context.attr('data-uid'), "/picture\"/></div>\n              <div class=\"context-detail\">\n              <h5 class=\"context-title\">").concat($context.attr('data-name'), "</h5>\n                <ul class=\"context-menu-list\">\n              <li class=\"context-link challenge-duel\" data-action=\"challenge\" data-money=\"").concat($context.attr('data-money'), "\" data-sid=\"").concat($context.attr('data-sid'), "\" data-uid=\"").concat($context.attr('data-uid'), "\" title=\"Challange for a Dual\">Challange Dual</li>\n                      <li class=\"context-link send-gift\" data-action=\"gift\" data-sid=\"").concat($context.attr('data-sid'), "\" data-uid=\"").concat($context.attr('data-uid'), "\" title=\"Send a Gift\">Send Gift</li>\n              </ul>\n                  </div>\n              </div>")); //            console.log(e);
    //            console.log($(e.currentTarget));
  }

  function doActionOnUser(data) {
    if (data.action == 'challenge') {
      socket.emit('challenge', {
        bet: data.amount,
        target: data.target
      });
    } else if (data.action == 'gift') {
      socket.emit('gift', data);
    }
  }

  function leaveRoom() {
    $('.scores-list').empty();
    $('.overlay').remove();
    $('.cursor').remove();
    $('.room>strong').remove();
    $('.my-score').html('');
    $('.theme').html('');
    $('.droppable').remove();
    $('.draggable').remove();
    socket.emit('leave room');
    $('.stage').removeClass('game-running').off('mousemove', onStageMouseMove);
  }

  function brag(data) {
    var bragTitle = "And here is your winner ".concat(me.fbMe.name, "!");
    var bragCaption = data.userListHtml;
    var bragDesc = 'I just scored highest score ' + data.scores[0].currScore + ' among all my opponents in TWING!';

    if (data.scores.length == 2) {
      bragTitle = 'You loose I win!';
      bragDesc = "I just won a duel challenge with ".concat(data.scores[0].currScore, " scores against ").concat(data.scores[1].name, "!");
    } else {
      bragTitle = 'You guys need some more practice!';
      bragDesc = "I just scored highest score ".concat(data.scores[0].currScore, " among all my opponents in TWING!");
    }

    FB.ui({
      method: 'feed',
      link: 'https://apps.facebook.com/twingjitsu',
      caption: bragCaption,
      description: bragDesc,
      picture: 'http://review.com.np/og/images/trophy.png',
      name: bragTitle
    }, function () {});
  }

  function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + (exdays == null ? '' : "; expires=".concat(exdate.toUTCString()));
    document.cookie = c_name + '=' + c_value;
  }

  function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(' ' + c_name + '=');

    if (c_start == -1) {
      c_start = c_value.indexOf(c_name + '=');
    }

    if (c_start == -1) {
      c_value = null;
    } else {
      c_start = c_value.indexOf('=', c_start) + 1;
      var c_end = c_value.indexOf(';', c_start);

      if (c_end == -1) {
        c_end = c_value.length;
      }

      c_value = unescape(c_value.substring(c_start, c_end));
    }

    return c_value;
  }
});
$(document).ready(function () {
  alert('In $ready callback');
  $('#sidebar').append('<div class="dlog-wrapper"></div>');
  var $dlogWrapper = $('.dlog-wrapper');
  $dlogWrapper.append('<div class="dlog-list-wrapper"><ul class="dlog-list"></ul></div>');
  $('ul.dlog-list').draggable({
    axis: 'y',
    stop: function stop(event, ui) {
      $('ul.dlog-list').css({
        top: 'initial',
        bottom: '0'
      });
    },
    revert: true
  });
});

function scrollFriends(evt) {
  var w = evt.wheelDelta,
      d = evt.detail;
  var wDir;

  if (d) {
    if (w) wDir = w / d / 40 * d > 0 ? 1 : -1; // Opera
    else wDir = -d / 3; // Firefox;         TODO: do not /3 for OS X
  } else wDir = w / 120; // IE/Safari/Chrome TODO: /3 for Chrome OS X


  if (wDir < 0) {
    $('.friends').scrollLeft($('.friends').animate({
      scrollLeft: '+=750'
    }, {
      queue: false,
      duration: 1000
    }));
  } else {
    $('.friends').scrollLeft($('.friends').animate({
      scrollLeft: '-=750'
    }, {
      queue: false,
      duration: 1000
    }));
  }
}

/***/ }),

/***/ "./public/javascripts/sounds.js":
/*!**************************************!*\
  !*** ./public/javascripts/sounds.js ***!
  \**************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Sound
/* harmony export */ });
function Sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);

  this.play = function () {
    this.sound.play();
  };

  this.stop = function () {
    this.sound.pause();
  };
}

/***/ }),

/***/ "./public/javascripts/twing.js":
/*!*************************************!*\
  !*** ./public/javascripts/twing.js ***!
  \*************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Twing = /*#__PURE__*/function () {
  function Twing() {
    _classCallCheck(this, Twing);

    this.me = {};
    this.gifts = {
      coins10: '10 coins',
      coinsLvl: 'x coins'
    };
  }

  _createClass(Twing, [{
    key: "registerMe",
    value: function registerMe(name, room, sid, score, fbMe) {
      this.me = {
        name: name,
        room: room,
        sid: sid,
        score: score,
        fbMe: fbMe
      };
    }
  }, {
    key: "dAlert",
    value: function dAlert(msg, theme) {
      $('.stage').append("<div class=\"overlay dAlert volatile ".concat(theme, "\">\n      <a href=\"#\" class=\"close cross\">\n        <i class=\"icon-remove\"></i></a>\n        <div class=\"overlay-wrapper\">\n        <h3>Oops.. </h3>\n        <div class=\"desc clearfix\">").concat(msg, "</div>\n      </div>\n    </div>"));
    }
  }]);

  return Twing;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Twing);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./public/javascripts/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90d2luZy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9kbG9nLmpzIiwid2VicGFjazovL3R3aW5nLy4vcHVibGljL2phdmFzY3JpcHRzL2ZhY2Vib29rLmpzIiwid2VicGFjazovL3R3aW5nLy4vcHVibGljL2phdmFzY3JpcHRzL2luZGV4LmpzIiwid2VicGFjazovL3R3aW5nLy4vcHVibGljL2phdmFzY3JpcHRzL3NvdW5kcy5qcyIsIndlYnBhY2s6Ly90d2luZy8uL3B1YmxpYy9qYXZhc2NyaXB0cy90d2luZy5qcyIsIndlYnBhY2s6Ly90d2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90d2luZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHdpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90d2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3R3aW5nL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJkbG9nIiwib2JqIiwib2JqU3RyaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsIiRkbG9nTGlzdCIsIiQiLCJsaWNsYXNzIiwiYXJndW1lbnRzIiwiYXBwZW5kIiwiRkJMb2dpbiIsImNvbnNvbGUiLCJsb2ciLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJhdXRoUmVzcG9uc2UiLCJhcGkiLCJtZSIsImZiTWUiLCJzb2NrZXQiLCJpbyIsImNvbm5lY3QiLCJzb2NrZXRFdmVudHMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNjb3BlIiwibG9naW5XaXRoRmFjZWJvb2siLCJkb2N1bWVudCIsInJlZmVycmVyIiwibWF0Y2giLCJ0d2luZyIsIlR3aW5nIiwiZnJpZW5kcyIsImFwcEZyaWVuZHMiLCJzZW5kTWFzc0dpZnRUbyIsInNvY2tldEV2ZW50c0JpbmRlZCIsImlzaVBhZCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImFwcF9pZCIsImFsZXJ0IiwiZHJhZ2dpbmdCbG9jayIsImZiQXN5bmNJbml0IiwiaW5pdCIsInhmYm1sIiwic3RhdHVzIiwiY29va2llIiwiYXBwSWQiLCJmcmljdGlvbmxlc3NSZXF1ZXN0cyIsImdldExvZ2luU3RhdHVzIiwibG9naW5TdGF0dXMiLCJhcHBlbmRUbyIsInRtcGwiLCJtZVJlcyIsImlkIiwid2FybiIsInVzZXJJRCIsImRhdGEiLCJmaWx0ZXIiLCJhIiwiaW5zdGFsbGVkIiwibWFwIiwiYiIsImVtaXQiLCJsZW5ndGgiLCJzb3J0IiwiTWF0aCIsInJhbmRvbSIsIm1hc3NHaWZ0VXNlcnNIVE1MIiwiZm9yRWFjaCIsImZiSWQiLCJzaG93TG9naW5PcHRpb25zQW5kTG9naW4iLCJyb3VuZCIsIm5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicHJvbXB0Iiwic2V0SXRlbSIsInVzZXJMZXZlbENhbGN1bGF0ZSIsInNjb3JlIiwibGV2ZWwiLCJmbG9vciIsInNxcnQiLCJ0aGlzTGV2ZWxJbiIsInBvdyIsIm5leHRMZXZlbEluIiwibGV2ZWxQcm9ncmVzcyIsImdldFJhbmRvbUZyaW5lZHMiLCJjb3VudCIsImFsbEZyaWVuZHMiLCJzbGljZSIsInVwZGF0ZU1lSW5mbyIsImNhbGxiYWNrIiwiJG1lIiwiZ2lmdHMiLCJlbXB0eSIsIm1vbmV5Iiwiam9pbmVkU291bmQiLCJTb3VuZCIsIm9uIiwiZ2V0Tmlja25hbWUiLCJlIiwiZXJyb3IiLCJkQWxlcnQiLCJteVN0YXRzIiwiJDEiLCJmYWRlT3V0IiwicmVtb3ZlIiwib25EcmFnIiwib25DdXJzb3JNb3ZlIiwicGxheSIsImFkZEN1cnNvcnMiLCJhZGRTY29yZSIsImhvc3RzIiwic2hvdyIsInNob3dIb3N0cyIsImFkZERyYWdnYWJsZXMiLCJzb3J0QmxvY2tzIiwic3RhZ2VSZWFkeSIsInRoZW1lIiwiaHRtbCIsInJvb21OYW1lIiwidXNlcnMiLCJyZWdpc3Rlck1lIiwicm9vbSIsInNpZCIsIiRyb29tIiwiaGlkZSIsImJlZm9yZSIsIm5ld1Njb3JlIiwiYmxvY2siLCJmaW5kIiwidGV4dCIsInBhcnNlSW50IiwibG9ja0Jsb2NrIiwibGVhdmVyIiwicmVtb3ZlQ3Vyc29ycyIsInJlbW92ZVNjb3JlIiwic2NvcmVzIiwiaGlnaHNjb3Jlc0h0bWwiLCJlYWNoIiwiaXRlbUNsYXNzIiwiZmJJRCIsInNsaW1TY3JvbGwiLCJoZWlnaHQiLCJpc290b3BlIiwiYW5pbWF0aW9uRW5naW5lIiwiZ2V0U29ydERhdGEiLCIkZWxlbSIsImFuaW1hdGlvbk9wdGlvbnMiLCJkdXJhdGlvbiIsImVhc2luZyIsInF1ZXVlIiwiY2xpY2siLCJzb3J0TmFtZSIsImF0dHIiLCJzb3J0QnkiLCJub3RpZmljYXRpb25zIiwibm90aWZpY2F0aW9uc0h0bWwiLCJwaHJhc2UiLCJ0eXBlIiwiYW1vdW50IiwibGFiZWwiLCJhY3Rpb25UZXh0Iiwic2VuZGVySUQiLCJfaWQiLCJjaGFsbGVuZ2VyIiwiZHVlbCIsImR1ZWxPdmVybGF5IiwiYmV0Iiwic2xpZGVEb3duIiwiZHJhZ2dhYmxlIiwidGFyZ2V0Iiwic2VuZGVyIiwiZ2lmdCIsIiRmcmllbmRzIiwid2lkdGgiLCJtb3VzZXdoZWVsIiwicHJldmVudERlZmF1bHQiLCJzY3JvbGxGcmllbmRzIiwib3JpZ2luYWxFdmVudCIsImxlYXZlUm9vbSIsInNjb3JlSHRtbCIsInVzZXJMaXN0SHRtbCIsInB1c2giLCJjdXJyU2NvcmUiLCJiZXRNb25leSIsImNsYXNzZXMiLCJzaGFyZUJ0biIsImJyYWdEYXRhIiwibWVzc2FnZSIsImNzcyIsInRvcCIsInBvc2l0aW9uIiwibGVmdCIsImN1cnNvciIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJyZWFkeSIsInRvb2x0aXAiLCJwcm9ncmVzc2JhciIsInZhbHVlIiwiJGJvZHkiLCJkZWxlZ2F0ZSIsImNsb3Nlc3QiLCJicmFnIiwidWkiLCJtZXRob2QiLCJ0aXRsZSIsInRvIiwidGFyZ2V0cyIsInBhZ2VzIiwiY2VpbCIsImkiLCJzcGxpY2UiLCJhY3Rpb25JRCIsImN1cnJlbnRUYXJnZXQiLCJ1aWQiLCJyb29tSUQiLCJzaG93Q29udGV4dE1lbnUiLCJzdG9wUHJvcGFnYXRpb24iLCJhY3Rpb24iLCJ0YXJnZXRNb25leSIsIm1heEJldCIsInVzZXJCZXQiLCJkb0FjdGlvbk9uVXNlciIsIiR0aGlzIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFjdGlvbklkIiwia2V5cHJlc3MiLCJ3aGljaCIsIm1zZyIsImZiQ2FsbGJhY2siLCJ1c2VyIiwiZ2VuZGVyIiwiaG9zdHNMaXN0Iiwibm9Ib3N0cyIsImhvc3ROYW1lIiwiYXZhaWxhYmxlVGlwIiwiYXZhaWxhYmxlRmxhZyIsImF2YWlsYWJsZSIsInBsYXllcnMiLCJqb2luIiwiJGRyYWdnYWJsZXMiLCJlbGVtZW50cyIsIngiLCJ5IiwiZHJhZ2dhYmxlcyIsIm1vZGUiLCJlcSIsImdldCIsIiRkcm9wcGFibGVzIiwiZHJvcHBhYmxlcyIsImNvbnRhaW5tZW50Iiwic3RhcnQiLCJzdG9wIiwiZHJhZyIsImRlYm91bmNlIiwib25CbG9ja0RyYWciLCJldmVudCIsImRyb3BwYWJsZSIsImFjY2VwdCIsImRyb3AiLCJzcCIsIm9uU3RhZ2VNb3VzZU1vdmUiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9mZnNldCIsImRlY1ZhbCIsImhleFZhbCIsInRvU3RyaW5nIiwiJGNvbnRleHQiLCJyZW1vdmVDbGFzcyIsIm9mZiIsImJyYWdUaXRsZSIsImJyYWdDYXB0aW9uIiwiYnJhZ0Rlc2MiLCJsaW5rIiwiY2FwdGlvbiIsImRlc2NyaXB0aW9uIiwicGljdHVyZSIsInNldENvb2tpZSIsImNfbmFtZSIsImV4ZGF5cyIsImV4ZGF0ZSIsIkRhdGUiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsImNfdmFsdWUiLCJlc2NhcGUiLCJ0b1VUQ1N0cmluZyIsImdldENvb2tpZSIsImNfc3RhcnQiLCJpbmRleE9mIiwiY19lbmQiLCJ1bmVzY2FwZSIsInN1YnN0cmluZyIsIiRkbG9nV3JhcHBlciIsImF4aXMiLCJib3R0b20iLCJyZXZlcnQiLCJldnQiLCJ3Iiwid2hlZWxEZWx0YSIsImQiLCJkZXRhaWwiLCJ3RGlyIiwic2Nyb2xsTGVmdCIsImFuaW1hdGUiLCJzcmMiLCJzb3VuZCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNwbGF5IiwiYm9keSIsImFwcGVuZENoaWxkIiwicGF1c2UiLCJjb2luczEwIiwiY29pbnNMdmwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLElBQVQsQ0FBY0MsR0FBZCxFQUFtQjtBQUNqQixNQUFJQyxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQWhCO0FBQ0EsTUFBSUksU0FBUyxHQUFHQyxDQUFDLENBQUMsWUFBRCxDQUFqQjtBQUNBLE1BQUlDLE9BQU8sR0FBR0MsU0FBUyxDQUFDLENBQUQsQ0FBVCxHQUFlQSxTQUFTLENBQUMsQ0FBRCxDQUF4QixHQUE4QixRQUE1QztBQUNBSCxXQUFTLENBQUNJLE1BQVYsdUJBQStCRixPQUEvQixnQkFBMkNMLFNBQTNDLFlBSmlCLENBS2pCO0FBQ0Q7O0FBRUQsaUVBQWVGLElBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSTyxJQUFNVSxPQUFPLEdBQUcsU0FBVkEsT0FBVSxHQUFNO0FBQzNCQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBQyxJQUFFLENBQUNDLEtBQUgsQ0FDRSxVQUFVQyxRQUFWLEVBQW9CO0FBQ2xCLFFBQUlBLFFBQVEsQ0FBQ0MsWUFBYixFQUEyQjtBQUN6QkwsYUFBTyxDQUFDQyxHQUFSLENBQVksZ0JBQVo7QUFDQUMsUUFBRSxDQUFDSSxHQUFILENBQU8sS0FBUCxFQUFjLFVBQVVGLFFBQVYsRUFBb0I7QUFDaENKLGVBQU8sQ0FBQ0MsR0FBUixDQUFZLG1CQUFaO0FBQ0FNLFVBQUUsQ0FBQ0MsSUFBSCxHQUFVSixRQUFWLENBRmdDLENBR2hDOztBQUNBSyxjQUFNLEdBQUdDLEVBQUUsQ0FBQ0MsT0FBSCxFQUFUO0FBQ0FDLG9C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QSxJQUFSO0FBQWNDLFdBQUcsRUFBSEEsR0FBZDtBQUFtQjlDLGFBQUssRUFBTEEsS0FBbkI7QUFBMEI3RCxZQUFJLEVBQUpBO0FBQTFCLE9BQVY7QUFDRDs7OzJCQUVNc04sRyxFQUFLakgsSyxFQUFPO0FBQ2pCbEgsT0FBQyxDQUFDLFFBQUQsQ0FBRCxDQUFZRyxNQUFaLGdEQUN5QytHLEtBRHpDLGlOQU1pQ2lILEdBTmpDO0FBVUQ7Ozs7OztBQUdILGlFQUFlek0sS0FBZixFOzs7Ozs7VUMzQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGRsb2cob2JqKSB7XG4gIHZhciBvYmpTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICB2YXIgJGRsb2dMaXN0ID0gJCgnLmRsb2ctbGlzdCcpO1xuICB2YXIgbGljbGFzcyA9IGFyZ3VtZW50c1sxXSA/IGFyZ3VtZW50c1sxXSA6ICdub3RpY2UnO1xuICAkZGxvZ0xpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCIke2xpY2xhc3N9XCI+JHtvYmpTdHJpbmd9PC9saT5gKTtcbiAgLy8gICAgICAgICAgJCgnLmRsb2ctd3JhcHBlcicpLmVmZmVjdChcInNoYWtlXCIsIHsgZGlyZWN0aW9uOiAndXAnLCB0aW1lczoyLCBkaXN0YW5jZToyIH0sMTAwKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGxvZztcbiIsImV4cG9ydCBjb25zdCBGQkxvZ2luID0gKCkgPT4ge1xuICBjb25zb2xlLmxvZygnQXR0ZW1wdGluZyBsb2dpbiBGQiEnKTtcbiAgRkIubG9naW4oXG4gICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2dpbiBzdWNjZXNzIScpO1xuICAgICAgICBGQi5hcGkoJy9tZScsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdHb3QgdXNlciBGQiBpbmZvIScpO1xuICAgICAgICAgIG1lLmZiTWUgPSByZXNwb25zZTtcbiAgICAgICAgICAvLyAgICAgICAgICBjb25zb2xlLmxvZyhteUZCKTtcbiAgICAgICAgICBzb2NrZXQgPSBpby5jb25uZWN0KCk7XG4gICAgICAgICAgc29ja2V0RXZlbnRzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1JlZGlyZWN0aW5nIHRvIEZCIHBhZ2UhJyk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vdHdpbmdqaXRzdSc7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBzY29wZTogJ3B1YmxpY19wcm9maWxlLGVtYWlsJyxcbiAgICB9XG4gICk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5XaXRoRmFjZWJvb2soKSB7XG4gIGlmIChkb2N1bWVudC5yZWZlcnJlcikge1xuICAgIC8vIEluIHRoZSBmYWNlYm9vayBpZnJhbWUsIHJlZGlyZWN0IHdvbnQgd29yay5cbiAgICBpZiAoZG9jdW1lbnQucmVmZXJyZXIubWF0Y2goL2FwcHMuZmFjZWJvb2suY29tLykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGQiBBcHAgY2FudmFzIGRldGVjdGVkIScpO1xuICAgICAgRkJMb2dpbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gRkIgQXBwIGNhbnZhcyBkZXRlY3RlZCwgcmVkaXJlY3RpbmcgdG8gRkIgbG9naW4gcGFnZSEnKTtcbiAgICAgIEZCTG9naW4oKTtcbiAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbiA9IGVuY29kZVVSSShcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvb2F1dGg/Y2xpZW50X2lkPTUyNzgwNDMyMzkzMTc5OCZyZWRpcmVjdF91cmk9XCIgKyBjdXJyZW50VXJsICsgXCImcmVzcG9uc2VfdHlwZT10b2tlblwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ05vIEZCIEFwcCBjYW52YXMgZGV0ZWN0ZWQsIHJlZGlyZWN0aW5nIHRvIEZCIGxvZ2luIHBhZ2UhJyk7XG4gICAgRkJMb2dpbigpO1xuICAgIC8vIHdpbmRvdy5sb2NhdGlvbiA9IGVuY29kZVVSSShcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvb2F1dGg/Y2xpZW50X2lkPTUyNzgwNDMyMzkzMTc5OCZyZWRpcmVjdF91cmk9XCIgKyBjdXJyZW50VXJsICsgXCImcmVzcG9uc2VfdHlwZT10b2tlblwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IGRsb2cgZnJvbSAnLi9kbG9nLmpzJztcbmltcG9ydCB7IGxvZ2luV2l0aEZhY2Vib29rIH0gZnJvbSAnLi9mYWNlYm9vay5qcyc7XG5pbXBvcnQgU291bmQgZnJvbSAnLi9zb3VuZHMuanMnO1xuaW1wb3J0IFR3aW5nIGZyb20gJy4vdHdpbmcuanMnO1xuXG5jb25zdCB0d2luZyA9IG5ldyBUd2luZygpO1xubGV0IG1lID0ge307XG4vLyB2YXIgY3VycmVudFVybCA9IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9LyR7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfWA7XG5cbnZhciBmcmllbmRzID0gW107XG52YXIgYXBwRnJpZW5kcyA9IFtdO1xudmFyIHNlbmRNYXNzR2lmdFRvID0gW107XG52YXIgc29ja2V0RXZlbnRzQmluZGVkID0gZmFsc2U7XG52YXIgaXNpUGFkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZC9pKSAhPSBudWxsO1xuXG4vLyB2YXIgcGFnZV9pZCA9IDUyNDgyNjkyNzU2Mzg2OTtcbnZhciBhcHBfaWQgPSA1Mjc4MDQzMjM5MzE3OTg7XG5cbiQoZnVuY3Rpb24gKCkge1xuICBhbGVydCgnSW4gJCBjYWxsYmFjaycpO1xuICB2YXIgZHJhZ2dpbmdCbG9jayA9IGZhbHNlO1xuICB2YXIgc29ja2V0O1xuXG4gIHdpbmRvdy5mYkFzeW5jSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIHRvIEZCIScpO1xuICAgIEZCLmluaXQoe1xuICAgICAgeGZibWw6IHRydWUsXG4gICAgICBzdGF0dXM6IHRydWUsIC8vIGNoZWNrIGxvZ2luIHN0YXR1c1xuICAgICAgY29va2llOiB0cnVlLCAvLyBlbmFibGUgY29va2llcyB0byBhbGxvdyB0aGUgc2VydmVyIHRvIGFjY2VzcyB0aGUgc2Vzc2lvblxuICAgICAgYXBwSWQ6IGFwcF9pZCxcbiAgICAgIGZyaWN0aW9ubGVzc1JlcXVlc3RzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGxvZ2luIHN0YXR1cyEnKTtcbiAgICBGQi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHZhciBsb2dpblN0YXR1cyA9IHJlc3BvbnNlO1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xvZ2dlZCBpbiB0byBGQiEnKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgIC8vIHZhciB1c2VyX2lkID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLnVzZXJJRDtcbiAgICAgICAgLy8gdmFyIGZxbF9xdWVyeSA9IFwiU0VMRUNUIHVpZCBGUk9NIHBhZ2VfZmFuIFdIRVJFIHBhZ2VfaWQgPSBcIiArIHBhZ2VfaWQgKyBcImFuZCB1aWQ9XCIgKyB1c2VyX2lkO1xuICAgICAgICAvLyBGQi5EYXRhLnF1ZXJ5KGZxbF9xdWVyeSkud2FpdChmdW5jdGlvbiAocm93cykge1xuICAgICAgICAvLyAgICAgaWYgKHJvd3MubGVuZ3RoID09IDEgJiYgcm93c1swXS51aWQgPT0gdXNlcl9pZCkge1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSk7XG4gICAgICAgICQoJzxwPiZjb3B5OyBodHRwczovL2FwcHMuZmFjZWJvb2suY29tL3R3aW5naml0c3UgMjAxMzwvcD4nKS5hcHBlbmRUbyhcbiAgICAgICAgICAnI2Zvb3RlcidcbiAgICAgICAgKTtcbiAgICAgICAgJC50bXBsKCdsaWtlUGFnZScsIHt9KS5hcHBlbmRUbygnI2Zvb3RlcicpO1xuXG4gICAgICAgIEZCLmFwaSgnL21lJywgZnVuY3Rpb24gKG1lUmVzKSB7XG4gICAgICAgICAgaWYgKG1lUmVzLmlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR290IHVzZXIgaW5mbyEnKTtcbiAgICAgICAgICAgIG1lLmZiTWUgPSBtZVJlcztcbiAgICAgICAgICAgIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHNvY2tldEV2ZW50cygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cobWVSZXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvdWxkIG5vdCBjb25uZWN0IHRvIGdyYXBoIHNlcnZlcicpO1xuICAgICAgICAgICAgbWUuZmJNZSA9IHt9O1xuICAgICAgICAgICAgbWUuZmJNZS5pZCA9IGxvZ2luU3RhdHVzLnVzZXJJRDtcbiAgICAgICAgICAgIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHNvY2tldEV2ZW50cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ0dldHRpbmcgVHdpbmcgcGxheWVyIGZyZW5zIScpO1xuICAgICAgICBGQi5hcGkoJy9tZS9mcmllbmRzP2ZpZWxkcz1pbnN0YWxsZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnR290IHR3aW5nIHBsYXllciBmcmVucyEnKTtcbiAgICAgICAgICBmcmllbmRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICBhcHBGcmllbmRzID0gZnJpZW5kc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICByZXR1cm4gYS5pbnN0YWxsZWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICByZXR1cm4gYi5pZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgc29ja2V0LmVtaXQoJ2dldCBhcHBGcmllbmRzJywgYXBwRnJpZW5kcyk7XG5cbiAgICAgICAgICBpZiAoYXBwRnJpZW5kcy5sZW5ndGggPiA1MCkge1xuICAgICAgICAgICAgc2VuZE1hc3NHaWZ0VG8gPSBhcHBGcmllbmRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZE1hc3NHaWZ0VG8gPSBhcHBGcmllbmRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbWFzc0dpZnRVc2Vyc0hUTUwgPSAnJztcbiAgICAgICAgICBzZW5kTWFzc0dpZnRUby5mb3JFYWNoKGZ1bmN0aW9uIChmYklkKSB7XG4gICAgICAgICAgICBtYXNzR2lmdFVzZXJzSFRNTCArPSBgPGRpdiBjbGFzcz1cIm1hc3MtdXNlci10aHVtYlwiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtmYklkfS9waWN0dXJlXCIgLz48L2Rpdj5gO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgICQoJy5zdGFnZScpLmFwcGVuZChcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwib3ZlcmxheSBzZW5kLW1hc3MtZ2lmdHMtb3ZlcmxheVwiPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNyb3NzIGNsb3NlXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS13cmFwcGVyXCI+XG4gICAgICAgICAgICA8aDM+R2lmdCB5b3VyIGZyaWVuZHMgc29tZSBjb2lucy48L2gzPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjIGNsZWFyZml4XCI+U2VuZCBzb21lIGNvaW5zIHRvIHlvdXIgZnJpZW5kcyB3aG8gYXJlIGluIG5lZWQgb2YgaXQuIFlvdSBtYXkgZ2V0IHNvbWUgaW4gcmV0dXJuLiA6KVxuICAgICAgICAgICAgICAgIDxici8+ICR7bWFzc0dpZnRVc2Vyc0hUTUx9ICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwic2VuZC1tYXNzLWdpZnRzIGJ1dHRvblwiPlNlbmQgQ29pbnM8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+YFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZCIG5vdCBsb2dnZWQgaW4hJyk7XG4gICAgICAgIHNob3dMb2dpbk9wdGlvbnNBbmRMb2dpbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNob3dMb2dpbk9wdGlvbnNBbmRMb2dpbigpIHtcbiAgICAvLyBpZiAoY29uZmlybSgnRG8geW91IHdhbnQgdG8gbG9naW4gd2l0aCBmYWNlYm9vaz8nKSkge1xuICAgIC8vICAgbG9naW5XaXRoRmFjZWJvb2soKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIG1lLmZiTWUgPSB7fTtcbiAgICBtZS5mYk1lLmlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogOTk5OTk5OSk7XG4gICAgbWUuZmJNZS5uYW1lID1cbiAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0d2luZy5uYW1lJykgfHwgcHJvbXB0KCdFbnRlciBhIE5pY2tuYW1lIScpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0d2luZy5uYW1lJywgbWUuZmJNZS5uYW1lKTtcbiAgICBzb2NrZXQgPSBpby5jb25uZWN0KCk7XG4gICAgc29ja2V0RXZlbnRzKCk7XG4gICAgLy8gfVxuICB9XG5cbiAgdmFyIHVzZXJMZXZlbENhbGN1bGF0ZSA9IGZ1bmN0aW9uIChzY29yZSkge1xuICAgIGNvbnNvbGUubG9nKCdjYWxjdWxhdGluZyBzY29yZScpO1xuICAgIHZhciBsZXZlbCA9IHt9O1xuICAgIGxldmVsLmxldmVsID0gTWF0aC5mbG9vcihNYXRoLnNxcnQoc2NvcmUgLyAxMDAwKSkgKyAxO1xuICAgIGxldmVsLnRoaXNMZXZlbEluID0gTWF0aC5wb3cobGV2ZWwubGV2ZWwgLSAxLCAyKSAqIDEwMDA7XG4gICAgbGV2ZWwubmV4dExldmVsSW4gPSBNYXRoLnBvdyhsZXZlbC5sZXZlbCwgMikgKiAxMDAwO1xuICAgIGxldmVsLmxldmVsUHJvZ3Jlc3MgPSBNYXRoLmZsb29yKFxuICAgICAgKChzY29yZSAtIGxldmVsLnRoaXNMZXZlbEluKSAvIChsZXZlbC5uZXh0TGV2ZWxJbiAtIGxldmVsLnRoaXNMZXZlbEluKSkgKlxuICAgICAgICAxMDBcbiAgICApO1xuICAgIHJldHVybiBsZXZlbDtcbiAgfTtcbiAgdmFyIGdldFJhbmRvbUZyaW5lZHMgPSBmdW5jdGlvbiAoY291bnQpIHtcbiAgICBjb25zb2xlLmxvZygnZ2V0dGluZyByYW5kb20gZnJlbnMnKTtcbiAgICB2YXIgYWxsRnJpZW5kcyA9IGZyaWVuZHMubWFwKGZ1bmN0aW9uIChiKSB7XG4gICAgICByZXR1cm4gYi5pZDtcbiAgICB9KTtcbiAgICBpZiAoYWxsRnJpZW5kcy5sZW5ndGggPiBjb3VudCkge1xuICAgICAgcmV0dXJuIGFsbEZyaWVuZHNcbiAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSlcbiAgICAgICAgLnNsaWNlKDAsIGNvdW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFsbEZyaWVuZHM7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiB1cGRhdGVNZUluZm8oY2FsbGJhY2spIHtcbiAgICBjb25zb2xlLmxvZygnVXBkYXRpbmcgbXkgaW5mbyEnKTtcblxuICAgIHZhciAkbWUgPSAkKCcubWUtaW5mbycpO1xuICAgIHZhciBsZXZlbCA9IHVzZXJMZXZlbENhbGN1bGF0ZShtZS5zY29yZSk7XG5cbiAgICBtZS5sZXZlbCA9IGxldmVsLmxldmVsO1xuICAgIHR3aW5nLmdpZnRzWydjb2luc0x2bCddID0gbWUubGV2ZWwgKiAxMCArICcgY29pbnMnO1xuICAgIG1lLnRoaXNMZXZlbEluID0gbGV2ZWwudGhpc0xldmVsSW47XG4gICAgbWUubmV4dExldmVsSW4gPSBsZXZlbC5uZXh0TGV2ZWxJbjtcbiAgICBtZS5sZXZlbFByb2dyZXNzID0gbGV2ZWwubGV2ZWxQcm9ncmVzcztcbiAgICAkKCcubWUtaW1hZ2UnKVxuICAgICAgLmVtcHR5KClcbiAgICAgIC5hcHBlbmQoXG4gICAgICAgIGA8aW1nIGNsYXNzPVwibWUtdGh1bWJcIiBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke21lLmZiTWUuaWR9L3BpY3R1cmVcIj5gXG4gICAgICApO1xuXG4gICAgJG1lLmVtcHR5KCk7XG4gICAgJG1lLmFwcGVuZChgPGRpdiBjbGFzcz1cIm1lLW5hbWVcIj4ke21lLmZiTWUubmFtZX08L2Rpdj5gKTtcbiAgICAkbWUuYXBwZW5kKGA8ZGl2IGNsYXNzPVwibWUtbW9uZXlcIj4ke21lLm1vbmV5fTwvZGl2PmApO1xuICAgICRtZS5hcHBlbmQoXG4gICAgICBgPGRpdiBjbGFzcz1cIm1lLWxldmVsXCIgdGl0bGU9XCJOZXh0IGxldmVsIGF0IHNjb3JlcyBvZiAke21lLm5leHRMZXZlbElufSFcIiA+XG4gICAgPGRpdiBjbGFzcz1cIm1lLWxldmVsLXByb2dyZXNzXCI+PGRpdiBjbGFzcz1cIm1lLWxldmVsLXRleHRcIj5MZXZlbCAke21lLmxldmVsfTwvZGl2PjxkaXYgY2xhc3M9XCJmaWxsZXJcIiBzdHlsZT1cIndpZHRoOiR7bWUubGV2ZWxQcm9ncmVzc30lXCI+PC9kaXY+PC9kaXY+PC9kaXY+YFxuICAgICk7XG4gICAgJG1lLmFwcGVuZCgnPGRpdiBjbGFzcz1cInRoZW1lXCI+PC9kaXY+PGRpdiBjbGFzcz1cIm15LXNjb3JlXCI+PC9kaXY+Jyk7XG4gICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ja2V0RXZlbnRzKCkge1xuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIHNvdW5kcycpO1xuICAgIGNvbnN0IGpvaW5lZFNvdW5kID0gbmV3IFNvdW5kKFxuICAgICAgJ2h0dHBzOi8vd3d3LnphcHNwbGF0LmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNS9zb3VuZC1lZmZlY3RzLTQ2NDE2L3phcHNwbGF0X3RlY2hub2xvZ3lfdmlkZW9nYW1lX2NvbnRyb2xsZXJfeGJveF9zZXRfZG93bl93b29kX3RhYmxlXzAwMl80NzY1MS5tcDMnXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZygnTG9hZGluZyBzb2NrZXQgZXZlbnRzIScpO1xuICAgIHNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTb2NrZXQgY29ubmVjdGVkIHRvIHNlcnZlciEnKTtcbiAgICAgIGdldE5pY2tuYW1lKCk7XG5cbiAgICAgIGlmICghc29ja2V0RXZlbnRzQmluZGVkKSB7XG4gICAgICAgIHNvY2tldC5vbigncHJvYmxlbScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB0d2luZy5kQWxlcnQoSlNPTi5zdHJpbmdpZnkoZSksICdlcnJvcicpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdteSBzdGF0cycsIGZ1bmN0aW9uIChteVN0YXRzKSB7XG4gICAgICAgICAgY29uc3QgJDEgPSAkKCcubG9hZGluZy5vdmVybGF5Jyk7XG4gICAgICAgICAgJDEuZmFkZU91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkMS5yZW1vdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmVnaXN0ZXJlZCEhIEdvdCBteSBzdGF0cyEnKTtcbiAgICAgICAgICBtZS5zY29yZSA9IG15U3RhdHMuc2NvcmU7XG4gICAgICAgICAgbWUubW9uZXkgPSBteVN0YXRzLm1vbmV5O1xuICAgICAgICAgIHVwZGF0ZU1lSW5mbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnbm90aWZpY2F0aW9ucycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdkcmFnJywgb25EcmFnKTtcbiAgICAgICAgc29ja2V0Lm9uKCdjdXJzb3IgbW92ZScsIG9uQ3Vyc29yTW92ZSk7XG4gICAgICAgIHNvY2tldC5vbignYWRkIG1lJywgZnVuY3Rpb24gKG1lKSB7XG4gICAgICAgICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkZCBtZSAtIG1lXCIpO1xuXG4gICAgICAgICAgam9pbmVkU291bmQucGxheSgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG1lKTtcbiAgICAgICAgICBkbG9nKG1lLm5hbWUgKyAnIGpvaW5lZCEhJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICBhZGRDdXJzb3JzKG1lKTtcbiAgICAgICAgICBhZGRTY29yZShtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ2hvc3RzJywgZnVuY3Rpb24gKGhvc3RzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0dvdCBob3N0cyEnKTtcbiAgICAgICAgICAkKCcubGVhdmUtcm9vbScpLnJlbW92ZSgpO1xuICAgICAgICAgICQoJy5zaWRlLWJveC5tZW51IC5jcmVhdGUtaG9zdCcpLnNob3coKTtcbiAgICAgICAgICBzaG93SG9zdHMoaG9zdHMpO1xuICAgICAgICAgIGRsb2coJzxzdHJvbmc+UFJFU1MgRU5URVIgdG8gY2hhdCE8L3N0cm9uZz4nLCAnc3VjY2VzcycpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCd3YWl0aW5nIGZvciBwbGF5ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRsb2coJ1dhaXRpbmcgZm9yIG90aGVyIHBsYXllcnMnLCAnZXJyb3InKTtcbiAgICAgICAgICAkKCcuc3RhZ2UnKS5hcHBlbmQoJC50bXBsKCdpbnN0cnVjdGlvbnMnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ3N0YWdlIHJlYWR5JywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAkKCcub3ZlcmxheS53YWl0aW5nLWZvci1wbGF5ZXJzJykucmVtb3ZlKCk7XG4gICAgICAgICAgYWRkRHJhZ2dhYmxlcyhkYXRhKTtcbiAgICAgICAgICBzb3J0QmxvY2tzKGRhdGEpO1xuICAgICAgICAgIHN0YWdlUmVhZHkoKTtcbiAgICAgICAgICBkbG9nKGBUaGUgZ2FtZSBiZWdpbnMhISEhIFRoZW1lIGlzICR7ZGF0YS50aGVtZS5uYW1lfWAsICdzdWNjZXNzJyk7XG4gICAgICAgICAgJCgnLnRoZW1lJykuaHRtbChkYXRhLnRoZW1lLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCd1c2VybGlzdCcsIGZ1bmN0aW9uICh7IG1lLCByb29tTmFtZSwgdXNlcnMgfSkge1xuICAgICAgICAgIHR3aW5nLnJlZ2lzdGVyTWUobWUubmFtZSwgbWUucm9vbSwgbWUuc2lkLCBtZS5zY29yZSwgbWUuZmJNZSk7XG4gICAgICAgICAgY29uc3QgJHJvb20gPSAkKCcucm9vbScpO1xuXG4gICAgICAgICAgJHJvb20uZW1wdHkoKTtcbiAgICAgICAgICAkcm9vbS5hcHBlbmQoYDxzdHJvbmc+ICR7cm9vbU5hbWV9PC9zdHJvbmc+YCk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyh1c2Vycyk7XG4gICAgICAgICAgaWYgKHJvb21OYW1lICE9ICdsb2JieScpIHtcbiAgICAgICAgICAgICQoJy5zdGFnZScpLmFwcGVuZChcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJvdmVybGF5XCI+PGRpdiBjbGFzcz1cInJlYWR5LXdyYXBwZXJcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwicmVhZHkgYnV0dG9uXCI+UkVBRFk8L2E+PC9kaXY+PC9kaXY+J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICQoJy5ob3N0cycpLnJlbW92ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoJy5zY29yZXMtbGlzdCcpLmVtcHR5KCk7XG4gICAgICAgICAgZm9yICh2YXIgdXNlcklEIGluIHVzZXJzKSB7XG4gICAgICAgICAgICBhZGRDdXJzb3JzKHVzZXJzW3VzZXJJRF0pO1xuICAgICAgICAgICAgYWRkU2NvcmUodXNlcnNbdXNlcklEXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJCgnLnNpZGUtYm94Lm1lbnUgLmNyZWF0ZS1ob3N0JykuaGlkZSgpO1xuICAgICAgICAgICQoJy5zaWRlLWJveC5tZW51IC5sZWF2ZS1yb29tJykucmVtb3ZlKCk7XG4gICAgICAgICAgJCgnLmludml0ZScpLmJlZm9yZShcbiAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwibGVhdmUtcm9vbSBidXR0b25cIj5MZWF2ZTwvYT4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbigncm9vbSBsZWZ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJy5zY29yZXMtbGlzdCcpLmVtcHR5KCk7XG4gICAgICAgICAgJCgnLmxlYXZlLXJvb20nKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKCcuc2lkZS1ib3gubWVudSAuY3JlYXRlLWhvc3QnKS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oJ21hdGNoZWQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRsb2coZGF0YS5uYW1lK1wiIE1hdGNoZWQgXCIrZGF0YS5ibG9jaytcIiFcIiwnc3VjY2VzcycpO1xuICAgICAgICAgIHZhciBuZXdTY29yZSA9IDEwMDtcbiAgICAgICAgICBpZiAoZGF0YS5ibG9jayAlIDExID09IDAgfHwgZGF0YS5ibG9jayA+IDM5KSBuZXdTY29yZSArPSAxMDA7XG4gICAgICAgICAgJChgIyR7ZGF0YS5pZH0tc2NvcmVgKVxuICAgICAgICAgICAgLmZpbmQoJy5zY29yZScpXG4gICAgICAgICAgICAudGV4dChcbiAgICAgICAgICAgICAgcGFyc2VJbnQoJChgIyR7ZGF0YS5pZH0tc2NvcmVgKS5maW5kKCcuc2NvcmUnKS50ZXh0KCkpICsgbmV3U2NvcmVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgbG9ja0Jsb2NrKGRhdGEuYmxvY2spO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdsZWF2ZScsIGZ1bmN0aW9uIChsZWF2ZXIpIHtcbiAgICAgICAgICB0d2luZy5kQWxlcnQoYCR7bGVhdmVyfSBsZWZ0IWAsICdlcnJvcicpO1xuICAgICAgICAgIGRsb2coYCR7bGVhdmVyfSBsZWZ0IWAsICdlcnJvcicpO1xuICAgICAgICAgIHJlbW92ZUN1cnNvcnMobGVhdmVyKTtcbiAgICAgICAgICByZW1vdmVTY29yZShsZWF2ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdoaWdoc2NvcmVzJywgZnVuY3Rpb24gKHNjb3Jlcykge1xuICAgICAgICAgIHZhciBoaWdoc2NvcmVzSHRtbCA9ICcnO1xuXG4gICAgICAgICAgJChzY29yZXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZW1DbGFzcyA9IHRoaXMuZmJJRCA9PSBtZS5mYk1lLmlkID8gJ21lJyA6ICcnO1xuICAgICAgICAgICAgaGlnaHNjb3Jlc0h0bWwgKz0gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwidXNlci10aHVtYm5haWwgJHtpdGVtQ2xhc3N9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1ibmFpbC1pbWctd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwidXNlci10aHVtYm5haWwtaW1nXCJcbiAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmJJRFxuICAgICAgICAgICAgICAgICAgfS9waWN0dXJlP3dpZHRoPTEwMCZoZWlnaHQ9MTAwXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1iLWxldmVsXCI+XG4gICAgICAgICAgICAgICAgICAke3VzZXJMZXZlbENhbGN1bGF0ZSh0aGlzLnNjb3JlKS5sZXZlbH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1iLW5hbWVcIj4ke3RoaXMubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItdGh1bWItc2NvcmVcIj4ke3RoaXMuc2NvcmV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1iLW1vbmV5XCI+JHt0aGlzLm1vbmV5fTwvZGl2PlxuICAgICAgICAgICAgPC9saT5gO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgICQoJy5zdGFnZScpLmFwcGVuZChcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwib3ZlcmxheSBoaWdoc2NvcmVzXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGNyb3NzXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhpZ2hzY29yZXMtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgPGgzPkhpZ2hzY29yZXM8L2gzPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2MgY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwic29ydC1ieVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI25hbWVcIj5OYW1lPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjc2NvcmVcIj5TY29yZXM8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNtb25leVwiPkNvaW5zPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImJvYXJkLWxpc3QgY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAke2hpZ2hzY29yZXNIdG1sfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgICApO1xuICAgICAgICAgICQoJy5ib2FyZC1saXN0Jykuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICBoZWlnaHQ6IDQ1NixcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICQoJy5ib2FyZC1saXN0JykuaXNvdG9wZSh7XG4gICAgICAgICAgICBhbmltYXRpb25FbmdpbmU6ICdiZXN0LWF2YWlsYWJsZScsXG4gICAgICAgICAgICBnZXRTb3J0RGF0YToge1xuICAgICAgICAgICAgICBuYW1lOiBmdW5jdGlvbiAoJGVsZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW0uZmluZCgnLnVzZXItdGh1bWItbmFtZScpLnRleHQoKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2NvcmU6IGZ1bmN0aW9uICgkZWxlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtcGFyc2VJbnQoJGVsZW0uZmluZCgnLnVzZXItdGh1bWItc2NvcmUnKS50ZXh0KCkpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtb25leTogZnVuY3Rpb24gKCRlbGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC1wYXJzZUludCgkZWxlbS5maW5kKCcudXNlci10aHVtYi1tb25leScpLnRleHQoKSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0aW9uT3B0aW9uczoge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogNzUwLFxuICAgICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgICQoJyNzb3J0LWJ5IGEnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBnZXQgaHJlZiBhdHRyaWJ1dGUsIG1pbnVzIHRoZSAnIydcbiAgICAgICAgICAgIHZhciBzb3J0TmFtZSA9ICQodGhpcykuYXR0cignaHJlZicpLnNsaWNlKDEpO1xuICAgICAgICAgICAgJCgnLmJvYXJkLWxpc3QnKS5pc290b3BlKHtcbiAgICAgICAgICAgICAgc29ydEJ5OiBzb3J0TmFtZSxcbiAgICAgICAgICAgICAgYW5pbWF0aW9uT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbignbm90aWZpY2F0aW9ucycsIGZ1bmN0aW9uIChub3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgbGV0IG5vdGlmaWNhdGlvbnNIdG1sID0gJyc7XG5cbiAgICAgICAgICAkKG5vdGlmaWNhdGlvbnMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgcGhyYXNlID1cbiAgICAgICAgICAgICAgdGhpcy50eXBlID09ICdnaWZ0JyA/ICcgc2VudCB5b3UgJyA6ICcgaXMgaW4gbmVlZCBvZiAnO1xuICAgICAgICAgICAgY29uc3QgYW1vdW50ID0gdGhpcy5hbW91bnQgKyAnIGNvaW5zJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gcGhyYXNlICsgYW1vdW50ICsgJyEnO1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uVGV4dCA9IHRoaXMudHlwZSA9PSAnZ2lmdCcgPyAnIEFjY2VwdCAnIDogJyBTZW5kICc7XG5cbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbnNIdG1sICs9IGA8bGkgY2xhc3M9XCJjbGVhcmZpeCBub3RpZmljYXRpb24taXRlbSAke3RoaXMudHlwZX1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1pbWctd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgIGNsYXNzPVwibm90aWZpY2F0aW9uLXVzZXItaW1nXCJcbiAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dGhpcy5zZW5kZXJJRH0vcGljdHVyZVwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZmljYXRpb24tbGFiZWxcIj4ke2xhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uLWFjdGlvblwiPlxuICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImFjY2VwdC0ke3RoaXMudHlwZX0gYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGRhdGEtYW1vdW50PVwiJHt0aGlzLmFtb3VudH1cIlxuICAgICAgICAgICAgICAgICAgZGF0YS1hY3Rpb24taWQ9XCIke3RoaXMuX2lkfVwiXG4gICAgICAgICAgICAgICAgICBkYXRhLXNlbmRlcj1cIiR7dGhpcy5zZW5kZXJJRH1cIlxuICAgICAgICAgICAgICAgICAgZGF0YS1uYW1lPVwiJHt0aGlzLm5hbWV9XCJcbiAgICAgICAgICAgICAgICAgID4ke2FjdGlvblRleHR9PC9hXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICBgO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbm90aWZpY2F0aW9uc0h0bWwgPSBub3RpZmljYXRpb25zSHRtbFxuICAgICAgICAgICAgPyBub3RpZmljYXRpb25zSHRtbFxuICAgICAgICAgICAgOiBgPGxpIGNsYXNzPVwiY2xlYXJmaXggbm90aWZpY2F0aW9uLWl0ZW0gZW1wdHktbm90aWZpY2F0aW9uc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZmljYXRpb24taW1nLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJub3RpZmljYXRpb24tdXNlci1pbWdcIiBzcmM9XCJpbWFnZXMvZW1wdHktNTAucG5nXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICBObyBuZXcgbm90aWZpY2F0aW9ucyEgTmVlZCBzb21lIGNvaW5zPyBBc2sgZm9yIGNvaW5zIHdpdGggeW91ciBmcmllbmRzIVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZmljYXRpb24tYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNlbmQtbWFzcy1oZWxwLXJlcXVlc3QgYnV0dG9uXCI+QXNrIGZvciBDb2luczwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9saT5gO1xuXG4gICAgICAgICAgJCgnLnN0YWdlJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwib3ZlcmxheSBub3RpZmljYXRpb25zXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGNyb3NzXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbnMtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgPGgzPk5vdGlmaWNhdGlvbnM8L2gzPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2MgY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiYm9hcmQtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICR7bm90aWZpY2F0aW9uc0h0bWx9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgJCgnLmJvYXJkLWxpc3QnKS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgIGhlaWdodDogNDU2LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdyZW1vdmUgcm9vbScsIGZ1bmN0aW9uIChyb29tKSB7XG4gICAgICAgICAgJCgnLmhvc3RzLWxpc3Q+bGkuJyArIHJvb20pLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdyZWZyZXNoIHJvb21zJywgZnVuY3Rpb24gKGhvc3RzKSB7XG4gICAgICAgICAgaWYgKCQoJy5ob3N0cycpLmxlbmd0aCkge1xuICAgICAgICAgICAgJCgnLmhvc3RzJykucmVtb3ZlKCk7XG4gICAgICAgICAgICBzaG93SG9zdHMoaG9zdHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbignY2hhbGxlbmdlJywgZnVuY3Rpb24gKGNoYWxsZW5nZXIsIGR1ZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTmV3IER1YWwgQ2hhbGxlbmdlIScpO1xuICAgICAgICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGxlbmdlcik7XG4gICAgICAgICAgdmFyIGR1ZWxPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJvdmVybGF5IGR1ZWwtb3ZlcmxheVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXktd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1iXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7Y2hhbGxlbmdlci5mYk1lLmlkfS9waWN0dXJlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAke2NoYWxsZW5nZXIuZmJNZS5uYW1lfSBoYXMgY2hhbGxlbmdlZCB5b3UgZm9yIGEgZHVlbC4gPGJyIC8+QmV0IGFtb3VudDogJFxuICAgICAgICAgICAgICAgICAgICAgICR7ZHVlbC5iZXR9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9ucyBjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiI1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImFjY2VwdC1kdWVsIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWR1ZWwtaWQ9XCIke2R1ZWwuaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY2xvc2Utb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+QWNjZXB0PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiI1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInJlamVjdC1kdWVsIGJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWR1ZWwtaWQ9XCIke2R1ZWwuaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY2xvc2Utb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+UmVqZWN0PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgJCgnLnN0YWdlJykuYXBwZW5kKGR1ZWxPdmVybGF5KTtcbiAgICAgICAgICAkKCcuZHVlbC1vdmVybGF5JykuaGlkZSgpLnNsaWRlRG93bigpLmRyYWdnYWJsZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdkdWVsIGFjY2VwdGVkJywgZnVuY3Rpb24gKGR1ZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRHVhbCBDaGFsbGVuZ2UgQWNjZXB0ZWQhJyk7XG5cbiAgICAgICAgICB2YXIgZHVlbE92ZXJsYXkgPSBgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5IGR1ZWwtb3ZlcmxheVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5LXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLXRodW1iXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke2R1ZWwudGFyZ2V0LmZiTWUuaWR9L3BpY3R1cmVcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgJHtkdWVsLnRhcmdldC5mYk1lLm5hbWV9IGhhcyBhY2NlcHRlZCB5b3VyIGNoYWxsZW5nZSBmb3IgYSBkdWVsLlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9ucyBjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgIGhyZWY9XCIjXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImpvaW4tZHVlbCBidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtZHVlbC1pZD1cIiR7ZHVlbC5pZH1cIlxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY2xvc2Utb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgPkpvaW48L2FcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgICAgJCgnLnN0YWdlJykuYXBwZW5kKGR1ZWxPdmVybGF5KTtcbiAgICAgICAgICAkKCcuZHVlbC1vdmVybGF5JykuaGlkZSgpLnNsaWRlRG93bigpLmRyYWdnYWJsZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdkdWVsIHJlamVjdGVkJywgZnVuY3Rpb24gKGR1ZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRHVhbCBDaGFsbGVuZ2UgUmVqZWN0ZWQhJyk7XG4gICAgICAgICAgdmFyIGR1ZWxPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJvdmVybGF5IGR1ZWwtb3ZlcmxheVwiPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGNyb3NzXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS13cmFwcGVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItdGh1bWJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtkdWVsLnRhcmdldC5mYk1lLmlkfS9waWN0dXJlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke2R1ZWwudGFyZ2V0LmZiTWUubmFtZX0gaGFzIHJlamVjdGVkIHlvdXIgY2hhbGxlbmdlIGZvciBhIGR1ZWwuXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYDtcbiAgICAgICAgICAkKCcuc3RhZ2UnKS5hcHBlbmQoZHVlbE92ZXJsYXkpO1xuICAgICAgICAgICQoJy5kdWVsLW92ZXJsYXknKS5oaWRlKCkuc2xpZGVEb3duKCkuZHJhZ2dhYmxlO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKCdnaWZ0JywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTmV3IEdpZnQhJyk7XG4gICAgICAgICAgdmFyIGR1ZWxPdmVybGF5ID0gYDxkaXYgY2xhc3M9XCJvdmVybGF5IGdpZnQtb3ZlcmxheSB2b2xhdGlsZVwiPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGNyb3NzXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS13cmFwcGVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXItdGh1bWJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zZW5kZXIuZmJNZS5pZFxuICAgICAgICAgICAgICAgICAgfS9waWN0dXJlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAke2RhdGEuc2VuZGVyLmZiTWUubmFtZX0gaGFzIHNlbnQgeW91ICR7dHdpbmcuZ2lmdHNbZGF0YS5naWZ0XX0uXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnMgY2xlYXJmaXhcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgO1xuICAgICAgICAgICQoJy5zdGFnZScpLmFwcGVuZChkdWVsT3ZlcmxheSk7XG4gICAgICAgICAgJCgnLmR1ZWwtb3ZlcmxheScpLmhpZGUoKS5zbGlkZURvd24oKS5kcmFnZ2FibGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbignYXBwRnJpZW5kcycsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0dvdCBBcHBGcmllbmRzIHNjb3JlIGRhdGEhJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgZGF0YSA9IGRhdGEubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICBhLmxldmVsID0gTWF0aC5mbG9vcihNYXRoLnNxcnQoYS5zY29yZSAvIDEwMDApKSArIDE7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkLnRtcGwoJ2ZyaWVuZCcsIGRhdGEpLmFwcGVuZFRvKCcuZnJpZW5kcy1saXN0Jyk7XG4gICAgICAgICAgdmFyICRmcmllbmRzID0gJCgnLmZyaWVuZHMtbGlzdCcpO1xuICAgICAgICAgICRmcmllbmRzLndpZHRoKCQoJy5mcmllbmRzLWxpc3Q+bGknKS5sZW5ndGggKiAyMDApO1xuICAgICAgICAgICRmcmllbmRzLm1vdXNld2hlZWwoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNjcm9sbEZyaWVuZHMoZS5vcmlnaW5hbEV2ZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbignZ2FtZSBvdmVyJywgZnVuY3Rpb24gKHVzZXJzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0dhbWUgT3ZlciEnKTtcbiAgICAgICAgICAvLyAgICAgICAgICAgY29uc29sZS5sb2codXNlcnMpO1xuICAgICAgICAgIGxlYXZlUm9vbSgpO1xuICAgICAgICAgIGRsb2coJ0dhbWUgT3ZlciEhIScsICdlcnJvcicpO1xuICAgICAgICAgIHZhciBzY29yZUh0bWwgPSAnJztcbiAgICAgICAgICB2YXIgdXNlckxpc3RIdG1sID0gJyc7XG5cbiAgICAgICAgICB2YXIgc2NvcmVzID0gW107XG4gICAgICAgICAgZm9yICh2YXIgdXNlcklEIGluIHVzZXJzKSB7XG4gICAgICAgICAgICBzY29yZXMucHVzaCh7XG4gICAgICAgICAgICAgIGlkOiB1c2Vyc1t1c2VySURdLmZiTWUuaWQsXG4gICAgICAgICAgICAgIG5hbWU6IHVzZXJzW3VzZXJJRF0ubmFtZSxcbiAgICAgICAgICAgICAgY3VyclNjb3JlOiB1c2Vyc1t1c2VySURdLmN1cnJTY29yZSxcbiAgICAgICAgICAgICAgYmV0TW9uZXk6IHVzZXJzW3VzZXJJRF0uYmV0TW9uZXksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2NvcmVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBiLmN1cnJTY29yZSAtIGEuY3VyclNjb3JlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJChzY29yZXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSAnJztcbiAgICAgICAgICAgIGlmICh0aGlzLmlkID09IG1lLmZiTWUuaWQpIHtcbiAgICAgICAgICAgICAgRkIuYXBpKFxuICAgICAgICAgICAgICAgICcvbWUvc2NvcmVzLycsXG4gICAgICAgICAgICAgICAgJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHNjb3JlOiB0aGlzLmN1cnJTY29yZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ015IFNjb3JlIHBvc3RlZCB0byBGQiEnKTtcbiAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2xhc3NlcyA9ICdtZSc7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtZSBiZWZvcmUgc2NvcmUgYWx0ZXInKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWUpO1xuICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY3VyclNjb3JlJyk7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY3VyclNjb3JlKTtcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2JldG1vbmV5Jyk7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYmV0TW9uZXk/dGhpcy5iZXRNb25leToxMCk7XG4gICAgICAgICAgICAgIG1lLnNjb3JlICs9IHRoaXMuY3VyclNjb3JlO1xuICAgICAgICAgICAgICBtZS5tb25leSArPSB0aGlzLmJldE1vbmV5ID8gdGhpcy5iZXRNb25leSA6IDEwO1xuICAgICAgICAgICAgICB1cGRhdGVNZUluZm8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVzZXJMaXN0SHRtbCArPSBgJHt0aGlzLm5hbWV9ICgke3RoaXMuY3VyclNjb3JlfSk8YnI+XG4gICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjb3JlSHRtbCA9IGBcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZmluYWwtc2NvcmUtaXRlbSAke2NsYXNzZXN9XCI+XG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0LXVzZXItdGh1bWJcIlxuICAgICAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt0aGlzLmlkfS9waWN0dXJlXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxsYWJlbD4ke3RoaXMubmFtZX08L2xhYmVsPiA8c3BhbiBjbGFzcz1cInNjb3JlXCI+JHt0aGlzLmN1cnJTY29yZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvbGk+YDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgc2hhcmVCdG4gPSAnJztcbiAgICAgICAgICBpZiAoc2NvcmVzWzBdLmlkID09IG1lLmZiTWUuaWQpIHtcbiAgICAgICAgICAgIHNoYXJlQnRuID1cbiAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJzaGFyZSBicmFnIGJ1dHRvblwiPjxpIGNsYXNzPVwiaWNvbi10cm9waHlcIj48L2k+IFNoYXJlPC9hPic7XG4gICAgICAgICAgICB3aW5kb3cuYnJhZ0RhdGEgPSB7IHVzZXJMaXN0SHRtbDogdXNlckxpc3RIdG1sLCBzY29yZXM6IHNjb3JlcyB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcuc3RhZ2UnKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJvdmVybGF5IGZpbmFsLXNjb3Jlc1wiPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGNyb3NzXCI+PGkgY2xhc3M9XCJpY29uLXJlbW92ZVwiPjwvaT48L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1vdmVyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgPGgzPkdBTUUgT1ZFUjwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjIGNsZWFyZml4XCI+XG4gICAgICAgICAgICAgICAgU2NvcmVib2FyZDpcbiAgICAgICAgICAgICAgICA8b2wgY2xhc3M9XCJib2FyZC1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAke3Njb3JlSHRtbH1cbiAgICAgICAgICAgICAgICA8L29sPlxuICAgICAgICAgICAgICAgICR7c2hhcmVCdG59XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlIGJ1dHRvbiByZWRcIj48aSBjbGFzcz1cImljb24tcmVtb3ZlXCI+PC9pPiBjbG9zZTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgZGxvZyhgJHtkYXRhLm5hbWV9ID4gJHtkYXRhLm1lc3NhZ2V9YCwgJ21lc3NhZ2UnKTtcbiAgICAgICAgICAvLyAgICAgICAgICAgICQoJyMnK2RhdGEubmFtZStcIi1jdXJzb3JcIikuZmluZCgnc3Bhbi5zdGF0dXMnKS50ZXh0KGRhdGEubWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1JlY29ubmVjdGVkIHdpdGggc2VydmVyIScpO1xuICAgICAgfVxuICAgICAgc29ja2V0RXZlbnRzQmluZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBvbkRyYWcoZGF0YSkge1xuICAgICAgJChgLmRyYWdnYWJsZVtyZWw9JHtkYXRhLmJsb2NrfV1gKS5jc3Moe1xuICAgICAgICB0b3A6IGRhdGEucG9zaXRpb24udG9wLFxuICAgICAgICBsZWZ0OiBkYXRhLnBvc2l0aW9uLmxlZnQsXG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25DdXJzb3JNb3ZlKGRhdGEpIHtcbiAgICAgIGNvbnN0IGN1cnNvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2RhdGEuaWR9LWN1cnNvcmApO1xuICAgICAgLy8gdmFyIHNwID0gJCgnLnN0YWdlJykucG9zaXRpb24oKTtcbiAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgY3Vyc29yLnN0eWxlLmxlZnQgPSBgJHtkYXRhLnBvc2l0aW9uLmxlZnR9cHhgO1xuICAgICAgICBjdXJzb3Iuc3R5bGUudG9wID0gYCR7ZGF0YS5wb3NpdGlvbi50b3B9cHhgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlzaVBhZCkge1xuICAgICAgJChkb2N1bWVudCkudG9vbHRpcCgpO1xuICAgIH1cbiAgICAkKCcucHJvZ3Jlc3NiYXInKS5wcm9ncmVzc2Jhcih7XG4gICAgICB2YWx1ZTogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5jbG9zZScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5vdmVybGF5JykucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5zaGFyZS5icmFnJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGJyYWcoYnJhZ0RhdGEpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuc2VuZC1tYXNzLWdpZnRzJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnLm92ZXJsYXknKS5yZW1vdmUoKTtcbiAgICAgIGlmIChzZW5kTWFzc0dpZnRUby5sZW5ndGggPD0gNTApIHtcbiAgICAgICAgRkIudWkoXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kOiAnYXBwcmVxdWVzdHMnLFxuICAgICAgICAgICAgdGl0bGU6ICdHaWZ0IHNvbWUgY29pbnMhJyxcbiAgICAgICAgICAgIHRvOiBzZW5kTWFzc0dpZnRUbyxcbiAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgICdIZXJlIGFyZSBzb21lIGNvaW5zLiBZb3UgbWF5IHVzZSB0aGVtIHRvIGJldCBvbiBkdWVsIGdhbWVzLicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KCdtYXNzIHJlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHRhcmdldHM6IHJlc3BvbnNlLnRvLFxuICAgICAgICAgICAgICBuYW1lOiAnY29pbnMxMCcsXG4gICAgICAgICAgICAgIHR5cGU6ICdnaWZ0JyxcbiAgICAgICAgICAgICAgYW1vdW50OiAxMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwYWdlcyA9IE1hdGguY2VpbChzZW5kTWFzc0dpZnRUby5sZW5ndGggLyA1MCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZXM7IGkrKykge1xuICAgICAgICAgIEZCLnVpKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6ICdhcHByZXF1ZXN0cycsXG4gICAgICAgICAgICAgIHRpdGxlOiAnR2lmdCBzb21lIGNvaW5zIScsXG4gICAgICAgICAgICAgIHRvOiBzZW5kTWFzc0dpZnRUby5zcGxpY2UoMCwgNTApLFxuICAgICAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgICAgICdIZXJlIGFyZSBzb21lIGNvaW5zLiBZb3UgbWF5IHVzZSB0aGVtIHRvIGJldCBvbiBkdWVsIGdhbWVzLicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnRvKTtcbiAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ21hc3MgcmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiByZXNwb25zZS50byxcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29pbnMxMCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dpZnQnLFxuICAgICAgICAgICAgICAgIGFtb3VudDogMTAsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAkYm9keS5kZWxlZ2F0ZSgnLnNlbmQtbWFzcy1oZWxwLXJlcXVlc3QnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcub3ZlcmxheScpLnJlbW92ZSgpO1xuICAgICAgRkIudWkoXG4gICAgICAgIHtcbiAgICAgICAgICBtZXRob2Q6ICdhcHByZXF1ZXN0cycsXG4gICAgICAgICAgdGl0bGU6ICdBc2sgZm9yIGNvaW5zIScsXG4gICAgICAgICAgdG86IGdldFJhbmRvbUZyaW5lZHMoNTApLFxuICAgICAgICAgIG1lc3NhZ2U6ICdJIGFtIG91dCBvZiBjb2lucywgUGxlYXNlIHNlbmQgbWUgc29tZS4nLFxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnbWFzcyByZXF1ZXN0Jywge1xuICAgICAgICAgICAgdGFyZ2V0czogcmVzcG9uc2UudG8sXG4gICAgICAgICAgICBuYW1lOiAnY29pbnMxMCcsXG4gICAgICAgICAgICB0eXBlOiAnaGVscCcsXG4gICAgICAgICAgICBhbW91bnQ6IDEwLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuYWNjZXB0LWhlbHAnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90aWZpY2F0aW9uLWl0ZW0nKS5mYWRlT3V0KCdzbG93Jyk7XG4gICAgICB2YXIgYWN0aW9uSUQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1hY3Rpb24taWQnKTtcbiAgICAgIHZhciB0YXJnZXQgPSB7XG4gICAgICAgIHVpZDogJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtc2VuZGVyJyksXG4gICAgICAgIHNpZDogJ29mZmxpbmUnLFxuICAgICAgfTtcbiAgICAgIEZCLnVpKFxuICAgICAgICB7XG4gICAgICAgICAgbWV0aG9kOiAnYXBwcmVxdWVzdHMnLFxuICAgICAgICAgIHRpdGxlOiAnU2VuZCBjb2lucyEnLFxuICAgICAgICAgIHRvOiB0YXJnZXQudWlkLFxuICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAnSGVyZSBhcmUgc29tZSBjb2lucy4gWW91IG1heSB1c2UgdGhlbSB0byBiZXQgb24gZHVlbCBnYW1lcy4nLFxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnbWFzcyByZXF1ZXN0Jywge1xuICAgICAgICAgICAgdGFyZ2V0czogW3RhcmdldC51aWRdLFxuICAgICAgICAgICAgbmFtZTogJ2NvaW5zTHZsJyxcbiAgICAgICAgICAgIHR5cGU6ICdnaWZ0JyxcbiAgICAgICAgICAgIGFtb3VudDogbWUubGV2ZWwgKiAxMCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnYWNjZXB0IGhlbHAnLCBhY3Rpb25JRCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJ2EuaGlnaHNjb3Jlcy5idXR0b24nLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc29ja2V0LmVtaXQoJ2hpZ2hzY29yZXMnKTtcbiAgICB9KTtcbiAgICAkYm9keS5kZWxlZ2F0ZSgnYS5ub3RpZmljYXRpb25zLmJ1dHRvbicsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzb2NrZXQuZW1pdCgnbm90aWZpY2F0aW9ucycpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuaW52aXRlJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIEZCLnVpKFxuICAgICAgICB7XG4gICAgICAgICAgbWV0aG9kOiAnYXBwcmVxdWVzdHMnLFxuICAgICAgICAgIHRpdGxlOiAnTGV0cyBUd2luZyEnLFxuICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAnSSBhbSBvbmxpbmUgY2FuIHlvdSBqb2luIG1lIHJpZ2h0IG5vdy4gVHdpbmcgaXMgYSBtdWx0aXBsYXllciBwdXp6bGUgZ2FtZS4nLFxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UudG8pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuaG9zdHMtbGlzdD5saS5hdmFpbGFibGUtdHJ1ZT5hJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQoJy5ob3N0cycpLnJlbW92ZSgpO1xuICAgICAgc29ja2V0LmVtaXQoJ2pvaW4gcm9vbScsICQodGhpcykuYXR0cigncmVsJykpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuaG9zdHMtbGlzdD5saS5hdmFpbGFibGUtZmFsc2U+YScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkbG9nKCdZb3UgY2FudCBqb2luIHRoaXMgZ2FtZSwgdGhlIGdhbWUgaXMgaW4gcHJvZ3Jlc3MhJywgJ2Vycm9yJyk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5jcmVhdGUtaG9zdCcsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKCcuaG9zdHMnKS5yZW1vdmUoKTtcbiAgICAgIHNvY2tldC5lbWl0KCdjcmVhdGUgcm9vbScsIHsgcm9vbUlEOiAnJywgYmV0OiAwIH0pO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCdsaS51c2VyLWNvbnRleHQnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2hvd0NvbnRleHRNZW51KGUpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCdsaS51c2VyLWNvbnRleHQnLCAnbW91c2VsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCcuY29udGV4dC1tZW51JykucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJ2xpLmNvbnRleHQtbGluaycsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgJCgnLmNvbnRleHQtbWVudScpLnJlbW92ZSgpO1xuICAgICAgdmFyIGFjdGlvbiA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWFjdGlvbicpO1xuICAgICAgdmFyIHRhcmdldCA9IHtcbiAgICAgICAgdWlkOiAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS11aWQnKSxcbiAgICAgICAgc2lkOiAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1zaWQnKSxcbiAgICAgIH07XG4gICAgICB2YXIgYW1vdW50ID0gMDtcbiAgICAgIGlmIChhY3Rpb24gPT0gJ2NoYWxsZW5nZScpIHtcbiAgICAgICAgdmFyIHRhcmdldE1vbmV5ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtbW9uZXknKTtcbiAgICAgICAgdmFyIG1heEJldCA9IHRhcmdldE1vbmV5IDwgbWUubW9uZXkgPyB0YXJnZXRNb25leSA6IG1lLm1vbmV5O1xuICAgICAgICB2YXIgdXNlckJldCA9IHBhcnNlSW50KHByb21wdCgnRW50ZXIgQmV0IEFtb3VudCwgTUFYOiAnICsgbWF4QmV0KSk7XG4gICAgICAgIHVzZXJCZXQgPSB1c2VyQmV0ID8gdXNlckJldCA6IDEwO1xuICAgICAgICB1c2VyQmV0ID0gdXNlckJldCA+IDAgPyB1c2VyQmV0IDogMTA7XG4gICAgICAgIGFtb3VudCA9IHVzZXJCZXQgPiBtYXhCZXQgPyBtYXhCZXQgOiB1c2VyQmV0O1xuICAgICAgfVxuICAgICAgZG9BY3Rpb25PblVzZXIoeyBhY3Rpb246IGFjdGlvbiwgdGFyZ2V0OiB0YXJnZXQsIGFtb3VudDogYW1vdW50IH0pO1xuICAgICAgJCgnLmNvbnRleHQtbWVudScpLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuYWNjZXB0LWR1ZWwnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGR1ZWwgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1kdWVsLWlkJyk7XG4gICAgICBzb2NrZXQuZW1pdCgnYWNjZXB0IGR1ZWwnLCBkdWVsKTtcbiAgICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5yZWplY3QtZHVlbCcsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZHVlbCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWR1ZWwtaWQnKTtcbiAgICAgIHNvY2tldC5lbWl0KCdyZWplY3QgZHVlbCcsIGR1ZWwpO1xuICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy5vdmVybGF5JykucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5qb2luLWR1ZWwnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGR1ZWwgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1kdWVsLWlkJyk7XG4gICAgICBzb2NrZXQuZW1pdCgnam9pbiBkdWVsJywgZHVlbCk7XG4gICAgICAkKCcub3ZlcmxheScpLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcuZ2V0LWxldmVsLWNvaW5zJywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICR0aGlzID0gJCh0aGlzKTtcbiAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnZGlzYWJsZWQnKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB2YXIgdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtZmJJZCcpO1xuICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgIGRhdGEudGFyZ2V0cyA9IFt0YXJnZXRdO1xuICAgICAgZGF0YS50eXBlID0gJ2hlbHAnO1xuICAgICAgZGF0YS5uYW1lID0gJ2NvaW5zTHZsJztcbiAgICAgIGRhdGEuYW1vdW50ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtYW1vdW50Jyk7XG4gICAgICBGQi51aShcbiAgICAgICAge1xuICAgICAgICAgIG1ldGhvZDogJ2FwcHJlcXVlc3RzJyxcbiAgICAgICAgICB0aXRsZTogJ0FzayBmb3IgY29pbnMhJyxcbiAgICAgICAgICB0bzogdGFyZ2V0LFxuICAgICAgICAgIG1lc3NhZ2U6ICdJIGFtIG91dCBvZiBjb2lucywgUGxlYXNlIHNlbmQgbWUgc29tZS4nLFxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnbWFzcyByZXF1ZXN0JywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgJGJvZHkuZGVsZWdhdGUoJy5hY2NlcHQtZ2lmdCcsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RpZmljYXRpb24taXRlbScpLmZhZGVPdXQoJ3Nsb3cnKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBhY3Rpb25JZCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWFjdGlvbi1pZCcpO1xuICAgICAgdmFyIGFtb3VudCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWFtb3VudCcpO1xuICAgICAgbWUubW9uZXkgKz0gcGFyc2VJbnQoYW1vdW50KTtcbiAgICAgIHVwZGF0ZU1lSW5mbygpO1xuICAgICAgc29ja2V0LmVtaXQoJ2FjY2VwdCBnaWZ0JywgYWN0aW9uSWQpO1xuICAgIH0pO1xuICAgICRib2R5LmRlbGVnYXRlKCcubGVhdmUtcm9vbScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZWF2ZVJvb20oKTtcbiAgICB9KTtcbiAgICAkYm9keS5kZWxlZ2F0ZSgnLnJlYWR5JywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XG4gICAgICBzb2NrZXQuZW1pdCgncmVhZHknKTtcbiAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICRib2R5LmRlbGVnYXRlKCcucmVtYXRjaCcsJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAvLyAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vICAgICAgICAgICAgICAkKCcub3ZlcmxheScpLnJlbW92ZSgpO1xuICAgIC8vICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgncmVtYXRjaCcpO1xuICAgIC8vICAgICAgICAgICAgICBhZGREcmFnZ2FibGVzKCk7XG4gICAgLy8gICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAkKCcjc2lkZWJhcicpLmRyYWdnYWJsZSgpO1xuICB9KTtcblxuICAkKHdpbmRvdykua2V5cHJlc3MoZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIG1zZyA9IHByb21wdCgnTWVzc2FnZScpO1xuICAgICAgaWYgKG1zZykge1xuICAgICAgICBzb2NrZXQuZW1pdCgnbWVzc2FnZScsIG1zZyk7XG4gICAgICAgIGRsb2coJ01lID4gJyArIG1zZywgJ215LW1lc3NhZ2UnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZiQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROaWNrbmFtZSgpIHtcbiAgICBjb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byByZWdpc3RlciBpbiB0aGUgZ2FtZSEnKTtcbiAgICBzb2NrZXQuZW1pdCgncmVnaXN0ZXIgbWUnLCBtZS5mYk1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNjb3JlKHVzZXIpIHtcbiAgICAvLyAgICAgIGNvbnNvbGUubG9nKFwiYWRkU2NvcmUgdXNlclwiKTtcbiAgICAvLyAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgIGlmICghJCgnIycgKyB1c2VyLmlkICsgJy1zY29yZScpLmxlbmd0aCAmJiB1c2VyLm5hbWUgIT0gJ3VubmFtZWQnKVxuICAgICAgJCgnLnNjb3Jlcy1saXN0JykuYXBwZW5kKGA8bGlcbiAgICAgICAgY2xhc3M9XCJvdGhlcnMtc2NvcmUgdXNlci1jb250ZXh0XCJcbiAgICAgICAgaWQ9XCIke3VzZXIuaWR9LXNjb3JlXCJcbiAgICAgICAgZGF0YS11aWQ9XCIke3VzZXIuZmJNZS5pZH1cIlxuICAgICAgICBkYXRhLXNpZD1cIiR7dXNlci5pZH1cIlxuICAgICAgICBkYXRhLW1vbmV5PVwiJHt1c2VyLm1vbmV5fVwiXG4gICAgICAgIGRhdGEtbmFtZT1cIiR7dXNlci5mYk1lLm5hbWV9XCJcbiAgICAgID5cbiAgICAgICAgPGltZ1xuICAgICAgICAgIGNsYXNzPVwibGlzdC11c2VyLXRodW1iXCJcbiAgICAgICAgICBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3VzZXIuZmJNZS5pZH0vcGljdHVyZVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxsYWJlbD4ke3VzZXIubmFtZX08L2xhYmVsPlxuICAgICAgICBbPHNwYW4gY2xhc3M9XCJzY29yZVwiPjA8L3NwYW4+XVxuICAgICAgPC9saT5gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVNjb3JlKHVzZXIpIHtcbiAgICAkKCcuc2NvcmVzLWxpc3QnKVxuICAgICAgLmZpbmQoJyMnICsgdXNlci5pZCArICctc2NvcmUnKVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQ3Vyc29ycyh1c2VyKSB7XG4gICAgaWYgKCEkKGAjJHt1c2VyLnNpZH0tY3Vyc29yYCkubGVuZ3RoICYmIHVzZXIubmFtZSAhPSAndW5uYW1lZCcpXG4gICAgICAkKCcuc3RhZ2UnKVxuICAgICAgICAuYXBwZW5kKGA8ZGl2IGNsYXNzPVwiY3Vyc29yICR7dXNlci5mYk1lLmdlbmRlcn1cIiBpZD1cIiR7dXNlci5zaWR9LWN1cnNvclwiPlxuICAgICAgICAgICR7dXNlci5uYW1lfTxzcGFuIGNsYXNzPVwic3RhdHVzXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUN1cnNvcnModXNlcikge1xuICAgICQoJyMnICsgdXNlci5pZCArICctY3Vyc29yJykucmVtb3ZlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93SG9zdHMoaG9zdHMpIHtcbiAgICB2YXIgaG9zdHNMaXN0ID0gJyc7XG4gICAgdmFyIG5vSG9zdHMgPSB0cnVlO1xuICAgIGZvciAodmFyIGhvc3ROYW1lIGluIGhvc3RzKSB7XG4gICAgICBpZiAoaG9zdE5hbWUgIT0gJ2xvYmJ5Jykge1xuICAgICAgICBub0hvc3RzID0gZmFsc2U7XG4gICAgICAgIHZhciBhdmFpbGFibGVUaXAgPSAnJztcbiAgICAgICAgdmFyIGF2YWlsYWJsZUZsYWcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFob3N0c1tob3N0TmFtZV0uYXZhaWxhYmxlKSB7XG4gICAgICAgICAgYXZhaWxhYmxlVGlwID0gYFRoZSBob3N0ICR7aG9zdHNbaG9zdE5hbWVdLm5hbWV9IGhhcyBhbHJlYWR5IHN0YXJ0ZWQgdGhlIGdhbWUhIEpvaW4gYW5vdGhlciBob3N0IG9yIEhvc3QgYSBuZXcgZ2FtZS5gO1xuICAgICAgICB9IGVsc2UgaWYgKGhvc3RzW2hvc3ROYW1lXS5wbGF5ZXJzLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICBhdmFpbGFibGVUaXAgPSBgJHtob3N0c1tob3N0TmFtZV0ubmFtZX0gaXMgZnVsbCEgSm9pbiBhbm90aGVyIGhvc3Qgb3IgSG9zdCBhIG5ldyBnYW1lLmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXZhaWxhYmxlVGlwID0gYENsaWNrIHRvIGpvaW4gJHtob3N0c1tob3N0TmFtZV0ubmFtZX1gO1xuICAgICAgICAgIGF2YWlsYWJsZUZsYWcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGhvc3RzTGlzdCArPSBgPGxpIGNsYXNzPVwiJHtcbiAgICAgICAgICBob3N0c1tob3N0TmFtZV0ubmFtZVxuICAgICAgICB9IGF2YWlsYWJsZS0ke2F2YWlsYWJsZUZsYWd9XCI+XG4gICAgICAgICAgICA8YSB0aXRsZT1cIiR7YXZhaWxhYmxlVGlwfVwiIGhyZWY9XCIjXCIgcmVsPVwiJHtob3N0TmFtZX1cIlxuICAgICAgICAgICAgICA+PHN0cm9uZz4ke1xuICAgICAgICAgICAgICAgIGhvc3RzW2hvc3ROYW1lXS5uYW1lXG4gICAgICAgICAgICAgIH08L3N0cm9uZz4gKDxzdHJvbmcgY2xhc3M9XCJob3N0LXBsYXllci1jb3VudFwiXG4gICAgICAgICAgICAgICAgPiR7aG9zdHNbaG9zdE5hbWVdLnBsYXllcnMubGVuZ3RofTwvc3Ryb25nXG4gICAgICAgICAgICAgID4vNSk8L2FcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXJzLWluLWhvc3RcIj5cbiAgICAgICAgICAgICAgPHNwYW4+JHtob3N0c1tob3N0TmFtZV0ucGxheWVycy5qb2luKCc8L3NwYW4+PHNwYW4+Jyl9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5gO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9Ib3N0cykge1xuICAgICAgaG9zdHNMaXN0ID0gYDxsaT5UaGVyZSBhcmUgbm8gaG9zdHMgYXZhaWxhYmxlIHJpZ2h0IG5vdy48L2xpPlxuICAgICAgICA8bGk+SG9zdCBuZXcgZ2FtZSBieSBjbGlja2luZyBvbiB0aGUgYnV0dG9uIGJlbG93LjwvbGk+XG4gICAgICAgIDxsaT5Zb3UgY2FuIGNoYXQgd2l0aCB0aGUgcGxheWVycyBieSBwcmVzc2luZyBFTlRFUi48L2xpPlxuICAgICAgICA8bGk+VGhlIG9ubGluZSBwbGF5ZXJzIGFyZSBsaXN0ZWQgb24gdGhlIGdyZWVuIGJhci48L2xpPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgSWYgbm9ib2R5IGlzIG9ubGluZSwgSW52aXRlIHlvdXIgY2xvc2UgZnJpZW5kcyB0byBwbGF5IHJlYWx0aW1lLCBDbGljayBvblxuICAgICAgICAgIEludml0ZSBGcmllbmRzIGJ1dHRvbiBvbiB0aGUgcmlnaHQuXG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaT5QbGF5IGZyZXF1ZW50bHkgYW5kIHlvdSBzdGFuZCBhIGNoYW5jZSB0byBiZSBvbiB0aGUgaGlnaHNjb3JlcyBsaXN0LjwvbGk+XG4gICAgICAgIDxsaT5WaWV3IHRoZSBoaWdoc2NvcmVzIGxpc3QgYnkgY2xpY2tpbmcgb24gdGhlIEhpZ2hzY29yZXMgYnV0dG9uLjwvbGk+YDtcbiAgICB9XG4gICAgJCgnLnN0YWdlJykuYXBwZW5kKGA8ZGl2IGNsYXNzPVwib3ZlcmxheSBob3N0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXktd3JhcHBlclwiPlxuICAgICAgICA8aDM+SG9zdHM8L2gzPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzYyBjbGVhcmZpeFwiPlxuICAgICAgICAgIDxvbCBjbGFzcz1cImhvc3RzLWxpc3RcIj5cbiAgICAgICAgICAgICR7aG9zdHNMaXN0fVxuICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgPGEgY2xhc3M9XCJidXR0b24gY3JlYXRlLWhvc3RcIj5Ib3N0IGEgbmV3IGdhbWU8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgYCk7XG4gIH1cblxuICBmdW5jdGlvbiBsb2NrQmxvY2soYmxvY2spIHtcbiAgICAkKGAuZHJhZ2dhYmxlW3JlbD0ke2Jsb2NrfV1gKS5yZW1vdmUoKTtcbiAgICBpZiAoISQoJy5kcmFnZ2FibGUnKS5sZW5ndGgpIHtcbiAgICAgIHNvY2tldC5lbWl0KCdnYW1lIG92ZXInKTtcbiAgICB9XG4gICAgJChgLmRyb3BwYWJsZVtyZWw9JHtibG9ja31dYCkuYWRkQ2xhc3MoJ2xvc3QnKTtcbiAgfVxuXG4gIC8vIFJlYXJyYW5nZSB0aGUgQmxvY2tzIGFmdGVyIHJlYWRpbmcgdGhlIG1hcHMgZnJvbSBzZXJ2ZXJcbiAgZnVuY3Rpb24gc29ydEJsb2NrcyhkYXRhKSB7XG4gICAgdmFyICRkcmFnZ2FibGVzID0gJCgnLmRyYWdnYWJsZScpO1xuICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgIHZhciB4LCB5O1xuXG4gICAgJC5lYWNoKGRhdGEuZHJhZ2dhYmxlcywgZnVuY3Rpb24gKGksIHBvc2l0aW9uKSB7XG4gICAgICBzd2l0Y2ggKGRhdGEubW9kZSkge1xuICAgICAgICAvL0Jsb2NrIHNpemUgaXMgOTVweCBzbyBtdWx0aXBsZXMgb2YgaXQgbGlrZSA5NSAxOTAgMjg1IGFyZSBzb21ldGhpbmcgcmVwcmVzZW50aW5nIG51bWJlciBvZiBibG9ja3NcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHkgPSBNYXRoLmZsb29yKGkgLyA4KSAqIDk1O1xuICAgICAgICAgIHggPSAoaSAlIDgpICogOTU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHkgPSAxOTAgKyBNYXRoLmZsb29yKGkgLyA4KSAqIDIwO1xuICAgICAgICAgIHggPSAxOTAgKyAoaSAlIDgpICogNDM7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHkgPSA5NSArIE1hdGguZmxvb3IoaSAvIDgpICogNjA7XG4gICAgICAgICAgeCA9IDE5MCArIChpICUgOCkgKiA0MztcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgeSA9IDk1ICsgTWF0aC5mbG9vcihpIC8gOCkgKiA2MDtcbiAgICAgICAgICB4ID0gMjg1ICsgKGkgJSA4KSAqIDE0O1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICB5ID0gMTkwICsgTWF0aC5mbG9vcihpIC8gOCkgKiAyMDtcbiAgICAgICAgICB4ID0gKGkgJSA4KSAqIDk1O1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICB5ID0gTWF0aC5mbG9vcihpIC8gOCkgKiA5NTtcbiAgICAgICAgICB4ID0gMjg1ICsgKGkgJSA4KSAqIDE0O1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICB5ID0gTWF0aC5mbG9vcihpIC8gOCkgKiA5NTtcbiAgICAgICAgICB4ID0gKChpICUgOCkgKiA5NSkgLyAoTWF0aC5mbG9vcihpIC8gOCkgKyAxKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHkgPSBNYXRoLmZsb29yKGkgLyA4KSAqIDk1O1xuICAgICAgICAgIHggPSAoaSAlIDgpICogOTU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgICRkcmFnZ2FibGVzLmVxKHBvc2l0aW9uIC0gMSkuY3NzKHtcbiAgICAgICAgbGVmdDogeCxcbiAgICAgICAgdG9wOiB5LFxuICAgICAgfSk7XG4gICAgICBlbGVtZW50cy5wdXNoKCRkcmFnZ2FibGVzLmdldChwb3NpdGlvbiAtIDEpKTtcbiAgICB9KTtcblxuICAgICQoJy5zdGFnZScpLmFwcGVuZChlbGVtZW50cyk7XG4gICAgdmFyICRkcm9wcGFibGVzID0gJCgnLmRyb3BwYWJsZScpO1xuICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgICQuZWFjaChkYXRhLmRyb3BwYWJsZXMsIGZ1bmN0aW9uIChpLCBwb3NpdGlvbikge1xuICAgICAgZWxlbWVudHMucHVzaCgkZHJvcHBhYmxlcy5nZXQocG9zaXRpb24gLSAxKSk7XG4gICAgfSk7XG4gICAgJCgnLnN0YWdlJykuYXBwZW5kKGVsZW1lbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YWdlUmVhZHkoKSB7XG4gICAgJCgnLmRyYWdnYWJsZScpLmRyYWdnYWJsZSh7XG4gICAgICBjb250YWlubWVudDogJ3BhcmVudCcsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRlZCBkcmFnZ2luZycpO1xuICAgICAgICBkcmFnZ2luZ0Jsb2NrID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9wcGVkIGRyYWdnaW5nJyk7XG4gICAgICAgIGRyYWdnaW5nQmxvY2sgPSBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBkcmFnOiAkLmRlYm91bmNlKDE1LCBvbkJsb2NrRHJhZyksXG4gICAgICAvLyB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBvbkJsb2NrRHJhZyhldmVudCwgdWkpIHtcbiAgICAgIC8vIGlmICh1aS5wb3NpdGlvbi5sZWZ0ICUgcmVxdWVzdERlbGF5ID09IDAgfHwgdWkucG9zaXRpb24udG9wICUgcmVxdWVzdERlbGF5ID09IDApIHtcbiAgICAgIC8vIHZhciBzcCA9ICQoJy5zdGFnZScpLnBvc2l0aW9uKCk7XG4gICAgICBzb2NrZXQuZW1pdCgnZHJhZycsIHtcbiAgICAgICAgaWQ6IG1lLmlkLFxuICAgICAgICBibG9jazogJChldmVudC50YXJnZXQpLmF0dHIoJ3JlbCcpLFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIGxlZnQ6IHVpLnBvc2l0aW9uLmxlZnQsXG4gICAgICAgICAgdG9wOiB1aS5wb3NpdGlvbi50b3AsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKCcuZHJvcHBhYmxlJykuZHJvcHBhYmxlKHtcbiAgICAgIGFjY2VwdDogJy5kcmFnZ2FibGUnLFxuICAgICAgZHJvcDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICBpZiAoJChldmVudC50YXJnZXQpLmF0dHIoJ3JlbCcpID09IHVpLmRyYWdnYWJsZS5hdHRyKCdyZWwnKSkge1xuICAgICAgICAgIHZhciBibG9jayA9IHBhcnNlSW50KCQoZXZlbnQudGFyZ2V0KS5hdHRyKCdyZWwnKSk7XG4gICAgICAgICAgJChldmVudC50YXJnZXQpLmFkZENsYXNzKCdtYXRjaGVkJyk7XG4gICAgICAgICAgdWkuZHJhZ2dhYmxlLnJlbW92ZSgpO1xuICAgICAgICAgIHZhciBuZXdTY29yZSA9IDEwMDtcbiAgICAgICAgICBpZiAoYmxvY2sgJSAxMSA9PSAwIHx8IGJsb2NrID4gMzkpIG5ld1Njb3JlICs9IDEwMDtcbiAgICAgICAgICAkKCcubXktc2NvcmUnKS50ZXh0KHBhcnNlSW50KCQoJy5teS1zY29yZScpLnRleHQoKSkgKyBuZXdTY29yZSk7XG4gICAgICAgICAgc29ja2V0LmVtaXQoJ21hdGNoZWQnLCBibG9jayk7XG5cbiAgICAgICAgICBpZiAoISQoJy5kcmFnZ2FibGUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KCdnYW1lIG92ZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNwID0gJCgnLnN0YWdlJykucG9zaXRpb24oKTtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnZHJhZycsIHtcbiAgICAgICAgICAgIGJsb2NrOiB1aS5kcmFnZ2FibGUuYXR0cigncmVsJyksXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICBsZWZ0OiB1aS5wb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgICB0b3A6IHVpLnBvc2l0aW9uLnRvcCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gICAgJCgnLnN0YWdlJylcbiAgICAgIC5hZGRDbGFzcygnZ2FtZS1ydW5uaW5nJylcbiAgICAgIC5vbignbW91c2Vtb3ZlJywgJC5kZWJvdW5jZSgxNSwgb25TdGFnZU1vdXNlTW92ZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TdGFnZU1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCFkcmFnZ2luZ0Jsb2NrKSB7XG4gICAgICAvLyBpZiAoZS5jbGllbnRYICUgcmVxdWVzdERlbGF5ID09IDAgfHwgZS5jbGllbnRZICUgcmVxdWVzdERlbGF5ID09IDApIHtcbiAgICAgIHZhciBzcCA9ICQoJy5zdGFnZScpLnBvc2l0aW9uKCk7XG4gICAgICBzb2NrZXQuZW1pdCgnY3Vyc29yIG1vdmUnLCB7XG4gICAgICAgIGxlZnQ6IGUuY2xpZW50WCAtIHNwLmxlZnQsXG4gICAgICAgIHRvcDogZS5jbGllbnRZIC0gc3AudG9wLFxuICAgICAgfSk7XG4gICAgICAvLyB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkRHJhZ2dhYmxlcyhkYXRhKSB7XG4gICAgJCgnLnN0YWdlIGRyYWdnYWJsZSwuc3RhZ2UgZHJvcHBhYmxlJykucmVtb3ZlKCk7XG4gICAgJCgnLm15LXNjb3JlJykudGV4dCgnMCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gZGF0YS5kcmFnZ2FibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9ICcnO1xuICAgICAgaWYgKGkgJSAxMSA9PSAwIHx8IGkgPiAzOSkge1xuICAgICAgICBjbGFzc2VzID0gJ2JvbnVzJztcbiAgICAgIH1cbiAgICAgIHZhciBvZmZzZXQgPSA2MTQzOSArIGRhdGEudGhlbWUuc3RhcnQ7XG4gICAgICB2YXIgZGVjVmFsID0gaSArIG9mZnNldDtcbiAgICAgIGlmIChkZWNWYWwgPj0gNjE2MTkgJiYgZGVjVmFsIDw9IDYxNjMxKSB7XG4gICAgICAgIGRlY1ZhbCArPSA1MDtcbiAgICAgIH1cbiAgICAgIHZhciBoZXhWYWwgPSBkZWNWYWwudG9TdHJpbmcoMTYpO1xuICAgICAgd2hpbGUgKGhleFZhbC5tYXRjaCgvZiQvKSkge1xuICAgICAgICBoZXhWYWwgPSAob2Zmc2V0ICsgcGFyc2VJbnQoNTAgKyBNYXRoLnJhbmRvbSgpICogNTApKS50b1N0cmluZygxNik7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKGkpO1xuICAgICAgY29uc29sZS5sb2coaGV4VmFsKTtcbiAgICAgICQoJy5zdGFnZScpXG4gICAgICAgIC5hcHBlbmQoXG4gICAgICAgICAgYDxkaXYgY2xhc3M9XCJkcmFnZ2FibGUgJHtjbGFzc2VzfVwiIHJlbD1cIiR7aX1cIj4mI3gke2hleFZhbH07PC9kaXY+YFxuICAgICAgICApXG4gICAgICAgIC5hcHBlbmQoYDxkaXYgY2xhc3M9XCJkcm9wcGFibGVcIiByZWw9XCIke2l9XCI+JiN4JHtoZXhWYWx9OzwvZGl2PmApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dDb250ZXh0TWVudShlKSB7XG4gICAgdmFyICRjb250ZXh0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICRjb250ZXh0LmFwcGVuZChcbiAgICAgIGA8ZGl2IGNsYXNzPVwiY29udGV4dC1tZW51IGNsZWFyZml4IGdsYXNzXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZXh0LWltZ1wiPjxpbWcgc3JjPVwiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHskY29udGV4dC5hdHRyKFxuICAgICAgICAgICAgICAgICdkYXRhLXVpZCdcbiAgICAgICAgICAgICAgKX0vcGljdHVyZVwiLz48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHQtZGV0YWlsXCI+XG4gICAgICAgICAgICAgIDxoNSBjbGFzcz1cImNvbnRleHQtdGl0bGVcIj4keyRjb250ZXh0LmF0dHIoJ2RhdGEtbmFtZScpfTwvaDU+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiY29udGV4dC1tZW51LWxpc3RcIj5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY29udGV4dC1saW5rIGNoYWxsZW5nZS1kdWVsXCIgZGF0YS1hY3Rpb249XCJjaGFsbGVuZ2VcIiBkYXRhLW1vbmV5PVwiJHskY29udGV4dC5hdHRyKFxuICAgICAgICAgICAgICAgICdkYXRhLW1vbmV5J1xuICAgICAgICAgICAgICApfVwiIGRhdGEtc2lkPVwiJHskY29udGV4dC5hdHRyKFxuICAgICAgICAnZGF0YS1zaWQnXG4gICAgICApfVwiIGRhdGEtdWlkPVwiJHskY29udGV4dC5hdHRyKFxuICAgICAgICAnZGF0YS11aWQnXG4gICAgICApfVwiIHRpdGxlPVwiQ2hhbGxhbmdlIGZvciBhIER1YWxcIj5DaGFsbGFuZ2UgRHVhbDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY29udGV4dC1saW5rIHNlbmQtZ2lmdFwiIGRhdGEtYWN0aW9uPVwiZ2lmdFwiIGRhdGEtc2lkPVwiJHskY29udGV4dC5hdHRyKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtc2lkJ1xuICAgICAgICAgICAgICAgICAgICAgICl9XCIgZGF0YS11aWQ9XCIkeyRjb250ZXh0LmF0dHIoXG4gICAgICAgICdkYXRhLXVpZCdcbiAgICAgICl9XCIgdGl0bGU9XCJTZW5kIGEgR2lmdFwiPlNlbmQgR2lmdDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+YFxuICAgICk7XG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoZS5jdXJyZW50VGFyZ2V0KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkb0FjdGlvbk9uVXNlcihkYXRhKSB7XG4gICAgaWYgKGRhdGEuYWN0aW9uID09ICdjaGFsbGVuZ2UnKSB7XG4gICAgICBzb2NrZXQuZW1pdCgnY2hhbGxlbmdlJywgeyBiZXQ6IGRhdGEuYW1vdW50LCB0YXJnZXQ6IGRhdGEudGFyZ2V0IH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hY3Rpb24gPT0gJ2dpZnQnKSB7XG4gICAgICBzb2NrZXQuZW1pdCgnZ2lmdCcsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYXZlUm9vbSgpIHtcbiAgICAkKCcuc2NvcmVzLWxpc3QnKS5lbXB0eSgpO1xuICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XG4gICAgJCgnLmN1cnNvcicpLnJlbW92ZSgpO1xuICAgICQoJy5yb29tPnN0cm9uZycpLnJlbW92ZSgpO1xuICAgICQoJy5teS1zY29yZScpLmh0bWwoJycpO1xuICAgICQoJy50aGVtZScpLmh0bWwoJycpO1xuICAgICQoJy5kcm9wcGFibGUnKS5yZW1vdmUoKTtcbiAgICAkKCcuZHJhZ2dhYmxlJykucmVtb3ZlKCk7XG4gICAgc29ja2V0LmVtaXQoJ2xlYXZlIHJvb20nKTtcbiAgICAkKCcuc3RhZ2UnKS5yZW1vdmVDbGFzcygnZ2FtZS1ydW5uaW5nJykub2ZmKCdtb3VzZW1vdmUnLCBvblN0YWdlTW91c2VNb3ZlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJyYWcoZGF0YSkge1xuICAgIHZhciBicmFnVGl0bGUgPSBgQW5kIGhlcmUgaXMgeW91ciB3aW5uZXIgJHttZS5mYk1lLm5hbWV9IWA7XG4gICAgdmFyIGJyYWdDYXB0aW9uID0gZGF0YS51c2VyTGlzdEh0bWw7XG4gICAgdmFyIGJyYWdEZXNjID1cbiAgICAgICdJIGp1c3Qgc2NvcmVkIGhpZ2hlc3Qgc2NvcmUgJyArXG4gICAgICBkYXRhLnNjb3Jlc1swXS5jdXJyU2NvcmUgK1xuICAgICAgJyBhbW9uZyBhbGwgbXkgb3Bwb25lbnRzIGluIFRXSU5HISc7XG4gICAgaWYgKGRhdGEuc2NvcmVzLmxlbmd0aCA9PSAyKSB7XG4gICAgICBicmFnVGl0bGUgPSAnWW91IGxvb3NlIEkgd2luISc7XG4gICAgICBicmFnRGVzYyA9IGBJIGp1c3Qgd29uIGEgZHVlbCBjaGFsbGVuZ2Ugd2l0aCAke2RhdGEuc2NvcmVzWzBdLmN1cnJTY29yZX0gc2NvcmVzIGFnYWluc3QgJHtkYXRhLnNjb3Jlc1sxXS5uYW1lfSFgO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmFnVGl0bGUgPSAnWW91IGd1eXMgbmVlZCBzb21lIG1vcmUgcHJhY3RpY2UhJztcbiAgICAgIGJyYWdEZXNjID0gYEkganVzdCBzY29yZWQgaGlnaGVzdCBzY29yZSAke2RhdGEuc2NvcmVzWzBdLmN1cnJTY29yZX0gYW1vbmcgYWxsIG15IG9wcG9uZW50cyBpbiBUV0lORyFgO1xuICAgIH1cbiAgICBGQi51aShcbiAgICAgIHtcbiAgICAgICAgbWV0aG9kOiAnZmVlZCcsXG4gICAgICAgIGxpbms6ICdodHRwczovL2FwcHMuZmFjZWJvb2suY29tL3R3aW5naml0c3UnLFxuICAgICAgICBjYXB0aW9uOiBicmFnQ2FwdGlvbixcbiAgICAgICAgZGVzY3JpcHRpb246IGJyYWdEZXNjLFxuICAgICAgICBwaWN0dXJlOiAnaHR0cDovL3Jldmlldy5jb20ubnAvb2cvaW1hZ2VzL3Ryb3BoeS5wbmcnLFxuICAgICAgICBuYW1lOiBicmFnVGl0bGUsXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24gKCkge31cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29va2llKGNfbmFtZSwgdmFsdWUsIGV4ZGF5cykge1xuICAgIHZhciBleGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGV4ZGF0ZS5zZXREYXRlKGV4ZGF0ZS5nZXREYXRlKCkgKyBleGRheXMpO1xuICAgIHZhciBjX3ZhbHVlID1cbiAgICAgIGVzY2FwZSh2YWx1ZSkgK1xuICAgICAgKGV4ZGF5cyA9PSBudWxsID8gJycgOiBgOyBleHBpcmVzPSR7ZXhkYXRlLnRvVVRDU3RyaW5nKCl9YCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gY19uYW1lICsgJz0nICsgY192YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvb2tpZShjX25hbWUpIHtcbiAgICB2YXIgY192YWx1ZSA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICB2YXIgY19zdGFydCA9IGNfdmFsdWUuaW5kZXhPZignICcgKyBjX25hbWUgKyAnPScpO1xuICAgIGlmIChjX3N0YXJ0ID09IC0xKSB7XG4gICAgICBjX3N0YXJ0ID0gY192YWx1ZS5pbmRleE9mKGNfbmFtZSArICc9Jyk7XG4gICAgfVxuICAgIGlmIChjX3N0YXJ0ID09IC0xKSB7XG4gICAgICBjX3ZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY19zdGFydCA9IGNfdmFsdWUuaW5kZXhPZignPScsIGNfc3RhcnQpICsgMTtcbiAgICAgIHZhciBjX2VuZCA9IGNfdmFsdWUuaW5kZXhPZignOycsIGNfc3RhcnQpO1xuICAgICAgaWYgKGNfZW5kID09IC0xKSB7XG4gICAgICAgIGNfZW5kID0gY192YWx1ZS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBjX3ZhbHVlID0gdW5lc2NhcGUoY192YWx1ZS5zdWJzdHJpbmcoY19zdGFydCwgY19lbmQpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNfdmFsdWU7XG4gIH1cbn0pO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFsZXJ0KCdJbiAkcmVhZHkgY2FsbGJhY2snKTtcblxuICAkKCcjc2lkZWJhcicpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImRsb2ctd3JhcHBlclwiPjwvZGl2PicpO1xuICB2YXIgJGRsb2dXcmFwcGVyID0gJCgnLmRsb2ctd3JhcHBlcicpO1xuICAkZGxvZ1dyYXBwZXIuYXBwZW5kKFxuICAgICc8ZGl2IGNsYXNzPVwiZGxvZy1saXN0LXdyYXBwZXJcIj48dWwgY2xhc3M9XCJkbG9nLWxpc3RcIj48L3VsPjwvZGl2PidcbiAgKTtcbiAgJCgndWwuZGxvZy1saXN0JykuZHJhZ2dhYmxlKHtcbiAgICBheGlzOiAneScsXG4gICAgc3RvcDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgJCgndWwuZGxvZy1saXN0JykuY3NzKHtcbiAgICAgICAgdG9wOiAnaW5pdGlhbCcsXG4gICAgICAgIGJvdHRvbTogJzAnLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICByZXZlcnQ6IHRydWUsXG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHNjcm9sbEZyaWVuZHMoZXZ0KSB7XG4gIHZhciB3ID0gZXZ0LndoZWVsRGVsdGEsXG4gICAgZCA9IGV2dC5kZXRhaWw7XG4gIHZhciB3RGlyO1xuICBpZiAoZCkge1xuICAgIGlmICh3KSB3RGlyID0gKHcgLyBkIC8gNDApICogZCA+IDAgPyAxIDogLTE7XG4gICAgLy8gT3BlcmFcbiAgICBlbHNlIHdEaXIgPSAtZCAvIDM7IC8vIEZpcmVmb3g7ICAgICAgICAgVE9ETzogZG8gbm90IC8zIGZvciBPUyBYXG4gIH0gZWxzZSB3RGlyID0gdyAvIDEyMDsgLy8gSUUvU2FmYXJpL0Nocm9tZSBUT0RPOiAvMyBmb3IgQ2hyb21lIE9TIFhcblxuICBpZiAod0RpciA8IDApIHtcbiAgICAkKCcuZnJpZW5kcycpLnNjcm9sbExlZnQoXG4gICAgICAkKCcuZnJpZW5kcycpLmFuaW1hdGUoXG4gICAgICAgIHsgc2Nyb2xsTGVmdDogJys9NzUwJyB9LFxuICAgICAgICB7IHF1ZXVlOiBmYWxzZSwgZHVyYXRpb246IDEwMDAgfVxuICAgICAgKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgJCgnLmZyaWVuZHMnKS5zY3JvbGxMZWZ0KFxuICAgICAgJCgnLmZyaWVuZHMnKS5hbmltYXRlKFxuICAgICAgICB7IHNjcm9sbExlZnQ6ICctPTc1MCcgfSxcbiAgICAgICAgeyBxdWV1ZTogZmFsc2UsIGR1cmF0aW9uOiAxMDAwIH1cbiAgICAgIClcbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTb3VuZChzcmMpIHtcbiAgdGhpcy5zb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gIHRoaXMuc291bmQuc3JjID0gc3JjO1xuICB0aGlzLnNvdW5kLnNldEF0dHJpYnV0ZSgncHJlbG9hZCcsICdhdXRvJyk7XG4gIHRoaXMuc291bmQuc2V0QXR0cmlidXRlKCdjb250cm9scycsICdub25lJyk7XG4gIHRoaXMuc291bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnNvdW5kKTtcbiAgdGhpcy5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc291bmQucGxheSgpO1xuICB9O1xuICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICB9O1xufVxuIiwiY2xhc3MgVHdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lID0ge307XG4gICAgdGhpcy5naWZ0cyA9IHtcbiAgICAgIGNvaW5zMTA6ICcxMCBjb2lucycsXG4gICAgICBjb2luc0x2bDogJ3ggY29pbnMnLFxuICAgIH07XG4gIH1cblxuICByZWdpc3Rlck1lKG5hbWUsIHJvb20sIHNpZCwgc2NvcmUsIGZiTWUpIHtcbiAgICB0aGlzLm1lID0geyBuYW1lLCByb29tLCBzaWQsIHNjb3JlLCBmYk1lIH07XG4gIH1cblxuICBkQWxlcnQobXNnLCB0aGVtZSkge1xuICAgICQoJy5zdGFnZScpLmFwcGVuZChcbiAgICAgIGA8ZGl2IGNsYXNzPVwib3ZlcmxheSBkQWxlcnQgdm9sYXRpbGUgJHt0aGVtZX1cIj5cbiAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjbG9zZSBjcm9zc1wiPlxuICAgICAgICA8aSBjbGFzcz1cImljb24tcmVtb3ZlXCI+PC9pPjwvYT5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXktd3JhcHBlclwiPlxuICAgICAgICA8aDM+T29wcy4uIDwvaDM+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjIGNsZWFyZml4XCI+JHttc2d9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUd2luZztcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vcHVibGljL2phdmFzY3JpcHRzL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==