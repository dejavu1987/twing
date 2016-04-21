$.template( "friend", '<li class="friend-thumbnail">\n\
                        <div class="user-thumb-name">${name}</div>\n\
                        <div class="friend-thumbnail-img-wrapper">\n\
                          <img class="friend-thumbnail-img" src="https://graph.facebook.com/${fbID}/picture?width=50&height=50">\n\
                          <div class="user-thumb-level">${level}</div>\n\
                        </div>\n\
                        <div class="user-thumb-money">${money}</div>\n\
                        <div class="user-ask-coin"><a href="#" class="button get-level-coins" data-fbId="${fbID}" data-amount="${level*10}">\n\
<i class="icon-plus"></i> Get <i class="icon-circle"></i>${level*10}</a></div></div>\n\
                      </li>' );
$.template("likePage",'<div id="footer"><p>Please like our page for updates and offers.</p><iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Ffacebook.com%2Ftwingjitsu&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=false&amp;colorscheme=light&amp;action=like&amp;height=35&amp;appId=527804323931798" scrolling="no" frameborder="0" style="border: none; overflow: hidden; width: 400px; height: 35px;" allowtransparency="true"></iframe></div>');