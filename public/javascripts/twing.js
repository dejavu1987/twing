class Twing {
  constructor() {
    this.me = {};
    this.gifts = {
      coins10: '10 coins',
      coinsLvl: 'x coins',
    };
  }

  registerMe(name, room, sid, score, fbMe) {
    this.me = { name, room, sid, score, fbMe };
  }

  dAlert(msg, theme) {
    $('.stage').append(
      `<div class="overlay dAlert volatile ${theme}">
      <a href="#" class="close cross">
        <i class="icon-remove"></i></a>
        <div class="overlay-wrapper">
        <h3>Oops.. </h3>
        <div class="desc clearfix">${msg}</div>
      </div>
    </div>`
    );
  }

  userLevelCalculate(score) {
    console.log('calculating score');
    var level = {};
    level.level = Math.floor(Math.sqrt(score / 1000)) + 1;
    level.thisLevelIn = Math.pow(level.level - 1, 2) * 1000;
    level.nextLevelIn = Math.pow(level.level, 2) * 1000;
    level.levelProgress = Math.floor(
      ((score - level.thisLevelIn) / (level.nextLevelIn - level.thisLevelIn)) *
        100
    );
    return level;
  }
}

export default Twing;
