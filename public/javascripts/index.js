import dlog from './dlog.js';
import { loginWithFacebook } from './facebook.js';
import Sound from './sounds.js';
import Twing from './twing.js';

const twing = new Twing();
let me = {};
let bragData;
// var currentUrl = `${window.location.protocol}//${window.location.host}/${window.location.pathname}`;

// @type any[]
var friends = [];
var appFriends = [];
var sendMassGiftTo = [];
var socketEventsBinded = false;
var isiPad = navigator.userAgent.match(/iPad/i) != null;

// var page_id = 524826927563869;
var app_id = 527804323931798;

$(function () {
  var draggingBlock = false;
  var socket;

  window.fbAsyncInit = function () {
    console.log('Initializing to FB!');
    FB.init({
      xfbml: true,
      status: true, // check login status
      cookie: true, // enable cookies to allow the server to access the session
      appId: app_id,
      frictionlessRequests: true,
    });
    console.log('Getting login status!');
    FB.getLoginStatus(function (response) {
      var loginStatus = response;
      if (response.status === 'connected') {
        console.log('Logged in to FB!');
        console.log(response);

        // var user_id = response.authResponse.userID;
        // var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + "and uid=" + user_id;
        // FB.Data.query(fql_query).wait(function (rows) {
        //     if (rows.length == 1 && rows[0].uid == user_id) {
        //     } else {
        //     }
        // });
        $('<p>&copy; https://apps.facebook.com/twingjitsu 2013</p>').appendTo(
          '#footer'
        );
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
          appFriends = friends
            .filter(function (a) {
              return a.installed;
            })
            .map(function (b) {
              return b.id;
            });

          socket.emit('get appFriends', appFriends);

          if (appFriends.length > 50) {
            sendMassGiftTo = appFriends.sort(() => Math.random() - 0.5);
          } else {
            sendMassGiftTo = appFriends;
          }
          var massGiftUsersHTML = '';
          sendMassGiftTo.forEach(function (fbId) {
            massGiftUsersHTML += `<div class="mass-user-thumb"><img src="https://graph.facebook.com/${fbId}/picture" /></div>`;
          });
          $('.stage').append(
            `<div class="overlay send-mass-gifts-overlay">
            <a href="#" class="cross close"><i class="icon-remove"></i></a>
            <div class="overlay-wrapper">
            <h3>Gift your friends some coins.</h3>
                <div class="desc clearfix">Send some coins to your friends who are in need of it. You may get some in return. :)
                <br/> ${massGiftUsersHTML}  
                </div>
                <a href="#" class="send-mass-gifts button">Send Coins</a>
              </div>
            </div>`
          );
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
    me.fbMe.name =
      localStorage.getItem('twing.name') || prompt('Enter a Nickname!');
    localStorage.setItem('twing.name', me.fbMe.name);
    socket = io.connect();
    socketEvents();
    // }
  }

  var getRandomFrineds = function (count) {
    console.log('getting random frens');
    var allFriends = friends.map(function (b) {
      return b.id;
    });
    if (allFriends.length > count) {
      return allFriends
        .sort(function (a, b) {
          return Math.random() - 0.5;
        })
        .slice(0, count);
    } else {
      return allFriends;
    }
  };
  function updateMeInfo(callback) {
    console.log('Updating my info!');

    var $me = $('.me-info');
    var level = twing.userLevelCalculate(me.score);

    me.level = level.level;
    twing.gifts['coinsLvl'] = me.level * 10 + ' coins';
    me.thisLevelIn = level.thisLevelIn;
    me.nextLevelIn = level.nextLevelIn;
    me.levelProgress = level.levelProgress;
    $('.me-image')
      .empty()
      .append(
        `<img class="me-thumb" src="https://graph.facebook.com/${me.fbMe.id}/picture">`
      );

    $me.empty();
    $me.append(`<div class="me-name">${me.fbMe.name}</div>`);
    $me.append(`<div class="me-money">${me.money}</div>`);
    $me.append(
      `<div class="me-level" title="Next level at scores of ${me.nextLevelIn}!" >
    <div class="me-level-progress"><div class="me-level-text">Level ${me.level}</div><div class="filler" style="width:${me.levelProgress}%"></div></div></div>`
    );
    $me.append('<div class="theme"></div><div class="my-score"></div>');
    if (callback) callback();
  }

  function socketEvents() {
    console.log('Loading sounds');
    const joinedSound = new Sound(
      'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-46416/zapsplat_technology_videogame_controller_xbox_set_down_wood_table_002_47651.mp3'
    );
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
          const $1 = $('.loading.overlay');
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
          dlog(me.name + ' joined!!', 'success');
          addCursors(me);
          addScore(me);
        });
        socket.on('hosts', function (hosts) {
          console.log('Got hosts!');
          $('.leave-room').remove();
          $('.side-box.menu .create-host').show();
          showHosts(hosts);
          dlog('<strong>PRESS ENTER to chat!</strong>', 'success');
        });
        socket.on('waiting for players', function () {
          dlog('Waiting for other players', 'error');
          $('.stage').append($.tmpl('instructions'));
        });
        socket.on('stage ready', function (data) {
          console.log(data);
          $('.overlay.waiting-for-players').remove();
          addDraggables(data);
          sortBlocks(data);
          stageReady();
          dlog(`The game begins!!!! Theme is ${data.theme.name}`, 'success');
          $('.theme').html(data.theme.name);
        });
        socket.on('userlist', function ({ me, roomName, users }) {
          twing.registerMe(me.name, me.room, me.sid, me.score, me.fbMe);
          const $room = $('.room');

          $room.empty();
          $room.append(`<strong> ${roomName}</strong>`);
          //console.log(users);
          if (roomName != 'lobby') {
            $('.stage').append(
              '<div class="overlay"><div class="ready-wrapper"><a href="#" class="ready button">READY</a></div></div>'
            );
            $('.hosts').remove();
          }

          $('.scores-list').empty();
          for (var userID in users) {
            addCursors(users[userID]);
            addScore(users[userID]);
          }

          $('.side-box.menu .create-host').hide();
          $('.side-box.menu .leave-room').remove();
          $('.invite').before(
            '<a href="#" class="leave-room button">Leave</a>'
          );
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
          $(`#${data.id}-score`)
            .find('.score')
            .text(
              parseInt($(`#${data.id}-score`).find('.score').text()) + newScore
            );
          lockBlock(data.block);
        });
        socket.on('leave', function (leaver) {
          twing.dAlert(`${leaver} left!`, 'error');
          dlog(`${leaver} left!`, 'error');
          removeCursors(leaver);
          removeScore(leaver);
        });
        socket.on('highscores', function (scores) {
          var highscoresHtml = '';

          $(scores).each(function () {
            var itemClass = this.fbID == me.fbMe.id ? 'me' : '';
            highscoresHtml += `
            <li class="user-thumbnail ${itemClass}">
              <div class="user-thumbnail-img-wrapper">
                <img
                  class="user-thumbnail-img"
                  src="https://graph.facebook.com/${
                    this.fbID
                  }/picture?width=100&height=100"
                />
                <div class="user-thumb-level">
                  ${twing.userLevelCalculate(this.score).level}
                </div>
              </div>
              <div class="user-thumb-name">${this.name}</div>
              <div class="user-thumb-score">${this.score}</div>
              <div class="user-thumb-money">${this.money}</div>
            </li>`;
          });
          $('.stage').append(
            `<div class="overlay highscores">
                <a href="#" class="close cross"><i class="icon-remove"></i></a>
                <div class="highscores-wrapper">
                  <h3>Highscores</h3>
                  <div class="desc clearfix">
                    <ul id="sort-by">
                      <li><a href="#name">Name</a></li>
                      <li><a href="#score">Scores</a></li>
                      <li><a href="#money">Coins</a></li>
                    </ul>
                    <ul class="board-list clearfix">
                      ${highscoresHtml}
                    </ul>
                  </div>
                </div>
              </div>`
          );
          $('.board-list').slimScroll({
            height: 456,
          });

          $('.board-list').isotope({
            animationEngine: 'best-available',
            getSortData: {
              name: function ($elem) {
                return $elem.find('.user-thumb-name').text();
              },
              score: function ($elem) {
                return -parseInt($elem.find('.user-thumb-score').text());
              },
              money: function ($elem) {
                return -parseInt($elem.find('.user-thumb-money').text());
              },
            },
            animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false,
            },
          });
          $('#sort-by a').click(function () {
            // get href attribute, minus the '#'
            var sortName = $(this).attr('href').slice(1);
            $('.board-list').isotope({
              sortBy: sortName,
              animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false,
              },
            });
            return false;
          });
        });
        socket.on('notifications', function (notifications) {
          let notificationsHtml = '';

          $(notifications).each(function () {
            const phrase =
              this.type == 'gift' ? ' sent you ' : ' is in need of ';
            const amount = this.amount + ' coins';
            const label = phrase + amount + '!';
            const actionText = this.type == 'gift' ? ' Accept ' : ' Send ';

            notificationsHtml += `<li class="clearfix notification-item ${this.type}">
              <div class="notification-img-wrapper">
                <img
                  class="notification-user-img"
                  src="https://graph.facebook.com/${this.senderID}/picture"
                />
              </div>
              <div class="notification-label">${label}</div>
              <div class="notification-action">
                <a
                  class="accept-${this.type} button"
                  data-amount="${this.amount}"
                  data-action-id="${this._id}"
                  data-sender="${this.senderID}"
                  data-name="${this.name}"
                  >${actionText}</a
                >
              </div>
            </li>
            `;
          });

          notificationsHtml = notificationsHtml
            ? notificationsHtml
            : `<li class="clearfix notification-item empty-notifications">
                <div class="notification-img-wrapper">
                  <img class="notification-user-img" src="images/empty-50.png" />
                </div>
                <div class="notification-label">
                  No new notifications! Need some coins? Ask for coins with your friends!
                </div>
                <div class="notification-action">
                  <a class="send-mass-help-request button">Ask for Coins</a>
                </div>
              </li>`;

          $('.stage').append(`<div class="overlay notifications">
                <a href="#" class="close cross"><i class="icon-remove"></i></a>
                <div class="notifications-wrapper">
                  <h3>Notifications</h3>
                  <div class="desc clearfix">
                    <ul class="board-list">
                      ${notificationsHtml}
                    </ul>
                  </div>
                </div>
              </div>
              `);

          $('.board-list').slimScroll({
            height: 456,
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
          console.log('New Dual Challenge!');
          //            console.log(challenger);
          var duelOverlay = `<div class="overlay duel-overlay">
                  <div class="overlay-wrapper">
                    <div class="desc">
                      <div class="user-thumb">
                        <img src="https://graph.facebook.com/${challenger.fbMe.id}/picture" />
                      </div>
                      ${challenger.fbMe.name} has challenged you for a duel. <br />Bet amount: $
                      ${duel.bet}
                    </div>
                    <div class="actions clearfix">
                      <a
                        href="#"
                        class="accept-duel button"
                        data-duel-id="${duel.id}"
                        id="close-overlay"
                        >Accept</a>
                      <a
                        href="#"
                        class="reject-duel button"
                        data-duel-id="${duel.id}"
                        id="close-overlay"
                        >Reject</a>
                    </div>
                  </div>
                </div>
                `;
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable();
        });
        socket.on('duel accepted', function (duel) {
          console.log('Dual Challenge Accepted!');

          var duelOverlay = `
              <div class="overlay duel-overlay">
                <div class="overlay-wrapper">
                  <div class="desc">
                    <div class="user-thumb">
                      <img src="https://graph.facebook.com/${duel.target.fbMe.id}/picture" />
                    </div>
                    ${duel.target.fbMe.name} has accepted your challenge for a duel.
                  </div>
                  <div class="actions clearfix">
                    <a
                      href="#"
                      class="join-duel button"
                      data-duel-id="${duel.id}"
                      id="close-overlay"
                      >Join</a
                    >
                  </div>
                </div>
              </div>`;
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable();
        });
        socket.on('duel rejected', function (duel) {
          console.log('Dual Challenge Rejected!');
          var duelOverlay = `<div class="overlay duel-overlay">
            <a href="#" class="close cross"><i class="icon-remove"></i></a>
            <div class="overlay-wrapper">
              <div class="desc">
                <div class="user-thumb">
                  <img src="https://graph.facebook.com/${duel.target.fbMe.id}/picture" />
                </div>
                ${duel.target.fbMe.name} has rejected your challenge for a duel.
              </div>
            </div>
          </div>
          `;
          $('.stage').append(duelOverlay);
          $('.duel-overlay').hide().slideDown().draggable;
        });
        socket.on('gift', function (data) {
          console.log('New Gift!');
          var duelOverlay = `<div class="overlay gift-overlay volatile">
            <a href="#" class="close cross"><i class="icon-remove"></i></a>
            <div class="overlay-wrapper">
              <div class="desc">
                <div class="user-thumb">
                  <img src="https://graph.facebook.com/${
                    data.sender.fbMe.id
                  }/picture" />
                </div>
                ${data.sender.fbMe.name} has sent you ${twing.gifts[data.gift]}.
                <div class="actions clearfix"></div>
              </div>
            </div>
          </div>
          `;
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
          console.log('Game Over!');
          //           console.log(users);
          leaveRoom();
          dlog('Game Over!!!', 'error');
          var scoreHtml = '';
          var userListHtml = '';

          var scores = [];
          for (var userID in users) {
            scores.push({
              id: users[userID].fbMe.id,
              name: users[userID].name,
              currScore: users[userID].currScore,
              betMoney: users[userID].betMoney,
            });
          }
          scores.sort(function (a, b) {
            return b.currScore - a.currScore;
          });

          $(scores).each(function () {
            var classes = '';
            if (this.id == me.fbMe.id) {
              FB.api(
                '/me/scores/',
                'post',
                {
                  score: this.currScore,
                },
                function (response) {
                  console.log('My Score posted to FB!');
                  //                  console.log(response);
                }
              );
              classes = 'me';
              //                console.log('me before score alter');
              //                console.log(me);
              //                console.log('currScore');
              //                console.log(this.currScore);
              //                console.log('betmoney');
              //                console.log(this.betMoney?this.betMoney:10);
              me.score += this.currScore;
              me.money += this.betMoney ? this.betMoney : 10;
              updateMeInfo();
            } else {
              userListHtml += `${this.name} (${this.currScore})<br>
                   `;
            }
            scoreHtml = `
              <li class="final-score-item ${classes}">
                <img
                  class="list-user-thumb"
                  src="https://graph.facebook.com/${this.id}/picture"
                />
                <label>${this.name}</label> <span class="score">${this.currScore}</span>
              </li>`;
          });
          var shareBtn = '';
          if (scores[0].id == me.fbMe.id) {
            shareBtn =
              '<a href="#" class="share brag button"><i class="icon-trophy"></i> Share</a>';
            bragData = { userListHtml: userListHtml, scores: scores };
          }
          $('.stage').append(`<div class="overlay final-scores">
            <a href="#" class="close cross"><i class="icon-remove"></i></a>
            <div class="game-over-wrapper">
              <h3>GAME OVER</h3>
              <div class="desc clearfix">
                Scoreboard:
                <ol class="board-list">
                  ${scoreHtml}
                </ol>
                ${shareBtn}
                <a href="#" class="close button red"><i class="icon-remove"></i> close</a>
              </div>
            </div>
          </div>
          `);
        });
        socket.on('message', function (data) {
          dlog(`${data.name} > ${data.message}`, 'message');
          //            $('#'+data.name+"-cursor").find('span.status').text(data.message);
        });
      } else {
        console.log('Reconnected with server!');
      }
      socketEventsBinded = true;
    });
    function onDrag(data) {
      $(`.draggable[rel=${data.block}]`).css({
        top: data.position.top,
        left: data.position.left,
      });
    }
    function onCursorMove(data) {
      const cursor = document.getElementById(`${data.id}-cursor`);
      // var sp = $('.stage').position();
      if (cursor) {
        cursor.style.left = `${data.position.left}px`;
        cursor.style.top = `${data.position.top}px`;
      }
    }
  }

  $(document).ready(function () {
    if (!isiPad) {
      $(document).tooltip();
    }
    $('.progressbar').progressbar({
      value: false,
    });
    const $body = $('body');
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
        FB.ui(
          {
            method: 'apprequests',
            title: 'Gift some coins!',
            to: sendMassGiftTo,
            message:
              'Here are some coins. You may use them to bet on duel games.',
          },
          function (response) {
            socket.emit('mass request', {
              targets: response.to,
              name: 'coins10',
              type: 'gift',
              amount: 10,
            });
          }
        );
      } else {
        var pages = Math.ceil(sendMassGiftTo.length / 50);
        for (var i = 0; i < pages; i++) {
          FB.ui(
            {
              method: 'apprequests',
              title: 'Gift some coins!',
              to: sendMassGiftTo.splice(0, 50),
              message:
                'Here are some coins. You may use them to bet on duel games.',
            },
            function (response) {
              console.log(response.to);
              socket.emit('mass request', {
                targets: response.to,
                name: 'coins10',
                type: 'gift',
                amount: 10,
              });
            }
          );
        }
      }
    });
    $body.delegate('.send-mass-help-request', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.overlay').remove();
      FB.ui(
        {
          method: 'apprequests',
          title: 'Ask for coins!',
          to: getRandomFrineds(50),
          message: 'I am out of coins, Please send me some.',
        },
        function (response) {
          socket.emit('mass request', {
            targets: response.to,
            name: 'coins10',
            type: 'help',
            amount: 10,
          });
        }
      );
    });
    $body.delegate('.accept-help', 'click', function (e) {
      e.preventDefault();
      $(this).closest('.notification-item').fadeOut('slow');
      var actionID = $(e.currentTarget).attr('data-action-id');
      var target = {
        uid: $(e.currentTarget).attr('data-sender'),
        sid: 'offline',
      };
      FB.ui(
        {
          method: 'apprequests',
          title: 'Send coins!',
          to: target.uid,
          message:
            'Here are some coins. You may use them to bet on duel games.',
        },
        function (response) {
          socket.emit('mass request', {
            targets: [target.uid],
            name: 'coinsLvl',
            type: 'gift',
            amount: me.level * 10,
          });
          socket.emit('accept help', actionID);
        }
      );
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
      FB.ui(
        {
          method: 'apprequests',
          title: 'Lets Twing!',
          message:
            'I am online can you join me right now. Twing is a multiplayer puzzle game.',
        },
        function (response) {
          //        console.log(response.to);
        }
      );
    });
    $body.delegate('.hosts-list>li.available-true>a', 'click', function (e) {
      e.preventDefault();
      $('.hosts').remove();
      socket.emit('join room', $(this).attr('rel'));
    });
    $body.delegate('.hosts-list>li.available-false>a', 'click', function (e) {
      e.preventDefault();
      dlog('You cant join this game, the game is in progress!', 'error');
    });
    $body.delegate('.create-host', 'click', function (e) {
      e.preventDefault();
      $('.hosts').remove();
      socket.emit('create room', { roomID: '', bet: 0 });
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
        sid: $(e.currentTarget).attr('data-sid'),
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
      doActionOnUser({ action: action, target: target, amount: amount });
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
      FB.ui(
        {
          method: 'apprequests',
          title: 'Ask for coins!',
          to: target,
          message: 'I am out of coins, Please send me some.',
        },
        function (response) {
          socket.emit('mass request', data);
        }
      );
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
    });
    //            $body.delegate('.rematch','click',function(e){
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
        dlog('Me > ' + msg, 'my-message');
      }
    }
  });

  function getNickname() {
    console.log('Attempting to register in the game!');
    socket.emit('register me', me.fbMe);
  }

  function addScore(user) {
    //      console.log("addScore user");
    //      console.log(user);
    if (!$('#' + user.id + '-score').length && user.name != 'unnamed')
      $('.scores-list').append(`<li
        class="others-score user-context"
        id="${user.id}-score"
        data-uid="${user.fbMe.id}"
        data-sid="${user.id}"
        data-money="${user.money}"
        data-name="${user.fbMe.name}"
      >
        <img
          class="list-user-thumb"
          src="https://graph.facebook.com/${user.fbMe.id}/picture"
        />
        <label>${user.name}</label>
        [<span class="score">0</span>]
      </li>`);
  }

  function removeScore(user) {
    $('.scores-list')
      .find('#' + user.id + '-score')
      .remove();
  }

  function addCursors(user) {
    if (!$(`#${user.sid}-cursor`).length && user.name != 'unnamed')
      $('.stage')
        .append(`<div class="cursor ${user.fbMe.gender}" id="${user.sid}-cursor">
          ${user.name}<span class="status"></span>
        </div>`);
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
          availableTip = `The host ${hosts[hostName].name} has already started the game! Join another host or Host a new game.`;
        } else if (hosts[hostName].players.length > 4) {
          availableTip = `${hosts[hostName].name} is full! Join another host or Host a new game.`;
        } else {
          availableTip = `Click to join ${hosts[hostName].name}`;
          availableFlag = true;
        }
        hostsList += `<li class="${
          hosts[hostName].name
        } available-${availableFlag}">
            <a title="${availableTip}" href="#" rel="${hostName}"
              ><strong>${
                hosts[hostName].name
              }</strong> (<strong class="host-player-count"
                >${hosts[hostName].players.length}</strong
              >/5)</a
            >
            <div class="players-in-host">
              <span>${hosts[hostName].players.join('</span><span>')}</span>
            </div>
          </li>`;
      }
    }
    if (noHosts) {
      hostsList = `<li>There are no hosts available right now.</li>
        <li>Host new game by clicking on the button below.</li>
        <li>You can chat with the players by pressing ENTER.</li>
        <li>The online players are listed on the green bar.</li>
        <li>
          If nobody is online, Invite your close friends to play realtime, Click on
          Invite Friends button on the right.
        </li>
        <li>Play frequently and you stand a chance to be on the highscores list.</li>
        <li>View the highscores list by clicking on the Highscores button.</li>`;
    }
    $('.stage').append(`<div class="overlay hosts">
      <div class="overlay-wrapper">
        <h3>Hosts</h3>
        <div class="desc clearfix">
          <ol class="hosts-list">
            ${hostsList}
          </ol>
          <a class="button create-host">Host a new game</a>
        </div>
      </div>
    </div>
    `);
  }

  function lockBlock(block) {
    $(`.draggable[rel=${block}]`).remove();
    if (!$('.draggable').length) {
      socket.emit('game over');
    }
    $(`.droppable[rel=${block}]`).addClass('lost');
  }

  // Rearrange the Blocks after reading the maps from server
  function sortBlocks(data) {
    var $draggables = $('.draggable');
    var elements = [];
    var x, y;

    $.each(data.draggables, function (i, position) {
      switch (data.mode) {
        //Block size is 95px so multiples of it like 95 190 285 are something representing number of blocks
        case 1:
          y = Math.floor(i / 8) * 95;
          x = (i % 8) * 95;
          break;

        case 2:
          y = 190 + Math.floor(i / 8) * 20;
          x = 190 + (i % 8) * 43;
          break;

        case 3:
          y = 95 + Math.floor(i / 8) * 60;
          x = 190 + (i % 8) * 43;
          break;

        case 4:
          y = 95 + Math.floor(i / 8) * 60;
          x = 285 + (i % 8) * 14;
          break;

        case 5:
          y = 190 + Math.floor(i / 8) * 20;
          x = (i % 8) * 95;
          break;

        case 6:
          y = Math.floor(i / 8) * 95;
          x = 285 + (i % 8) * 14;
          break;

        case 7:
          y = Math.floor(i / 8) * 95;
          x = ((i % 8) * 95) / (Math.floor(i / 8) + 1);
          break;

        default:
          y = Math.floor(i / 8) * 95;
          x = (i % 8) * 95;
          break;
      }

      $draggables.eq(position - 1).css({
        left: x,
        top: y,
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
      start: function () {
        console.log('started dragging');
        draggingBlock = true;
      },
      stop: function () {
        console.log('stopped dragging');
        draggingBlock = false;
      },
      drag: $.debounce(15, onBlockDrag),
      // }
    });

    function onBlockDrag(event, ui) {
      // if (ui.position.left % requestDelay == 0 || ui.position.top % requestDelay == 0) {
      // var sp = $('.stage').position();
      socket.emit('drag', {
        id: me.id,
        block: $(event.target).attr('rel'),
        position: {
          left: ui.position.left,
          top: ui.position.top,
        },
      });
    }

    $('.droppable').droppable({
      accept: '.draggable',
      drop: function (event, ui) {
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
              top: ui.position.top,
            },
          });
        }
      },
    });
    $('.stage')
      .addClass('game-running')
      .on('mousemove', $.debounce(15, onStageMouseMove));
  }

  function onStageMouseMove(e) {
    if (!draggingBlock) {
      // if (e.clientX % requestDelay == 0 || e.clientY % requestDelay == 0) {
      var sp = $('.stage').position();
      socket.emit('cursor move', {
        left: e.clientX - sp.left,
        top: e.clientY - sp.top,
      });
      // }
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
      $('.stage')
        .append(
          `<div class="draggable ${classes}" rel="${i}">&#x${hexVal};</div>`
        )
        .append(`<div class="droppable" rel="${i}">&#x${hexVal};</div>`);
    }
  }

  function showContextMenu(e) {
    var $context = $(e.currentTarget);
    $context.append(
      `<div class="context-menu clearfix glass">
              <div class="context-img"><img src="https://graph.facebook.com/${$context.attr(
                'data-uid'
              )}/picture"/></div>
              <div class="context-detail">
              <h5 class="context-title">${$context.attr('data-name')}</h5>
                <ul class="context-menu-list">
              <li class="context-link challenge-duel" data-action="challenge" data-money="${$context.attr(
                'data-money'
              )}" data-sid="${$context.attr(
        'data-sid'
      )}" data-uid="${$context.attr(
        'data-uid'
      )}" title="Challange for a Dual">Challange Dual</li>
                      <li class="context-link send-gift" data-action="gift" data-sid="${$context.attr(
                        'data-sid'
                      )}" data-uid="${$context.attr(
        'data-uid'
      )}" title="Send a Gift">Send Gift</li>
              </ul>
                  </div>
              </div>`
    );
    //            console.log(e);
    //            console.log($(e.currentTarget));
  }

  function doActionOnUser(data) {
    if (data.action == 'challenge') {
      socket.emit('challenge', { bet: data.amount, target: data.target });
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
    var bragTitle = `And here is your winner ${me.fbMe.name}!`;
    var bragCaption = data.userListHtml;
    var bragDesc =
      'I just scored highest score ' +
      data.scores[0].currScore +
      ' among all my opponents in TWING!';
    if (data.scores.length == 2) {
      bragTitle = 'You loose I win!';
      bragDesc = `I just won a duel challenge with ${data.scores[0].currScore} scores against ${data.scores[1].name}!`;
    } else {
      bragTitle = 'You guys need some more practice!';
      bragDesc = `I just scored highest score ${data.scores[0].currScore} among all my opponents in TWING!`;
    }
    FB.ui(
      {
        method: 'feed',
        link: 'https://apps.facebook.com/twingjitsu',
        caption: bragCaption,
        description: bragDesc,
        picture: 'http://review.com.np/og/images/trophy.png',
        name: bragTitle,
      },
      function () {}
    );
  }
});

$(document).ready(function () {
  $('#sidebar').append('<div class="dlog-wrapper"></div>');
  var $dlogWrapper = $('.dlog-wrapper');
  $dlogWrapper.append(
    '<div class="dlog-list-wrapper"><ul class="dlog-list"></ul></div>'
  );
  $('ul.dlog-list').draggable({
    axis: 'y',
    stop: function () {
      $('ul.dlog-list').css({
        top: 'initial',
        bottom: '0',
      });
    },
    revert: true,
  });
});

function scrollFriends(evt) {
  var w = evt.wheelDelta,
    d = evt.detail;
  var wDir;
  if (d) {
    if (w) wDir = (w / d / 40) * d > 0 ? 1 : -1;
    // Opera
    else wDir = -d / 3; // Firefox;         TODO: do not /3 for OS X
  } else wDir = w / 120; // IE/Safari/Chrome TODO: /3 for Chrome OS X

  if (wDir < 0) {
    $('.friends').scrollLeft(
      $('.friends').animate(
        { scrollLeft: '+=750' },
        { queue: false, duration: 1000 }
      )
    );
  } else {
    $('.friends').scrollLeft(
      $('.friends').animate(
        { scrollLeft: '-=750' },
        { queue: false, duration: 1000 }
      )
    );
  }
}
