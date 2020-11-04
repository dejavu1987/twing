$.template(
  'friend',
  '<li class="friend-thumbnail">\n\
                        <div class="user-thumb-name">${name}</div>\n\
                        <div class="friend-thumbnail-img-wrapper">\n\
                          <img class="friend-thumbnail-img" src="https://graph.facebook.com/${fbID}/picture?width=50&height=50">\n\
                          <div class="user-thumb-level">${level}</div>\n\
                        </div>\n\
                        <div class="user-thumb-money">${money}</div>\n\
                        <div class="user-ask-coin"><a href="#" class="button get-level-coins" data-fbId="${fbID}" data-amount="${level*10}">\n\
<i class="icon-plus"></i> Get <i class="icon-circle"></i>${level*10}</a></div></div>\n\
                      </li>'
);
$.template(
  'likePage',
  '<div id="footer"><p>Please like our page for updates and offers.</p><iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Ffacebook.com%2Ftwingjitsu&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=false&amp;colorscheme=light&amp;action=like&amp;height=35&amp;appId=527804323931798" scrolling="no" frameborder="0" style="border: none; overflow: hidden; width: 400px; height: 35px;" allowtransparency="true"></iframe></div>'
);

$.template(
  'instructions',
  `<div class="waiting-for-players instructions overlay">
  <div class="title">
    <h2>Twing!</h2>
  </div>
  <div class="how-to-play">
    <h3>Waiting for other players!</h3>
    <h4>While waiting take a look at the instructions on game play.</h4>
    <div class="desc clearfix">
      <ol class="how-to-list">
        <li class="how-to-item how-to-item-1">
          Drag a yellow disc and drop it to Gray tile with same symbol on it.
        </li>
        <li class="how-to-item how-to-item-2">
          The tile will turn green and you will get 100 points.
        </li>
        <li class="how-to-item how-to-item-3">
          The opponents does the same the gray tile will turn red.
        </li>
        <li class="how-to-item how-to-item-4">
          Golden discs will give you <strong> +100 </strong>bonus scores.
        </li>
      </ol>
    </div>
  </div>
  <div class="draggable">♔</div>
  <div class="droppable">♔</div>
  <div class="cursor"></div>
  <div class="score-up">+100</div>
</div>
`
);
