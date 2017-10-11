import _ from 'lodash';
import { random } from '../util';

const MapPosition = [
  [1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 2, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 3, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

class Map {
  constructor() {
    this.loaders = [];
    this.dice = {
      isRoll: false,
      count: 0,
    };
    this.walk = {
      history: [{
        x: state.map.piece.pos.x,
        y: state.map.piece.pos.y
      }]
    }
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    const mapManifest = [
      {src: 'btn_dice.png', id: 'btn_dice'},
      {src: 'dice_bg.png', id: 'dice_bg'},
      {src: 'square_0.png', id: 'square_0'},
      {src: 'square_1.png', id: 'square_1'},
      {src: 'square_2.png', id: 'square_2'},
      {src: 'square_3.png', id: 'square_3'}
    ];
    const walkManifest = [
      {src: 'chara_8.png', id: 'walk'},
    ];
    queue.loadManifest(mapManifest, true, './assets/images/map/');
    queue.loadManifest(walkManifest, true, './assets/images/map/sprite/walk/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    this.field = this.setField();
    this.squares = this.setSquare();
    this.footer = this.setFooter();
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);
    let touch = {
      start: {
        x: 0,
        y: 0
      },
      history: {
        x: state.map.squares.pos.x,
        y: state.map.squares.pos.y
      }
    };
    this.touchstartHandler = (e) => {
      const t = e.changedTouches[0];
      touch.start.x = t.pageX;
      touch.start.y = t.pageY;
      this.squares.x = touch.history.x;
      this.squares.y = touch.history.y;
    }
    this.touchmoveHandler = (e) => {
      const t = e.changedTouches[0];
      const diffX = touch.start.x - t.pageX;
      const diffY = touch.start.y - t.pageY;
      if (window.innerWidth - this.squares.getBounds().width <= this.squares.x && this.squares.x <= 0) {
        this.squares.x = touch.history.x - diffX;
      }
      if (window.innerHeight - this.squares.getBounds().height <= this.squares.y && this.squares.y <= 0) {
        this.squares.y = touch.history.y - diffY;
      }
      if (this.squares.x < window.innerWidth - this.squares.getBounds().width) {
        this.squares.x = window.innerWidth - this.squares.getBounds().width;
      } else if (this.squares.x > 0) {
        this.squares.x = 0;
      }
      if (this.squares.y < window.innerHeight - this.squares.getBounds().height) {
        this.squares.y = window.innerHeight - this.squares.getBounds().height;
      } else if (this.squares.y > 0) {
        this.squares.y = 0;
      }
    }
    this.touchendHandler = () => {
      touch.history.x = state.map.squares.pos.x = this.squares.x;
      touch.history.y = state.map.squares.pos.y = this.squares.y;
    }
    window.addEventListener('touchstart', this.touchstartHandler);
    window.addEventListener('touchmove', this.touchmoveHandler);
    window.addEventListener('touchend', this.touchendHandler);
    stage.addChild(this.field, this.squares, this.footer);
    stage.update();
  }
    
  setBitmap(key) {
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.skewX = chara.width / 2;
    chara.skewY = chara.height / 2;
    chara.scaleX = 0.5;
    chara.scaleY = 0.5;
    return chara;
  }

  setCharaSprite() {
    const data = {
      images: ['./assets/images/map/sprite/walk/chara_8.png'],
      frames: {width: 160, height: 160, regX: 0, regY: 0, scaleX: 0.5, scaleY: 0.5},
      animations: {
        walk: {
          frames: [0, 1, 2],
        }
      },
      framerate: 15
    };
    
    const spritesheet = new createjs.SpriteSheet(data);
    const sprite = new createjs.Sprite(spritesheet, 0);
    sprite.scaleX = 0.5;
    sprite.scaleY = 0.5;
    
    sprite.stop('walk');

    return sprite;
  }

  setFooter() {
    const footer = new createjs.Container();
    footer.y = window.innerHeight - 60;

    const diceContainer = new createjs.Container();
    diceContainer.x = 5;
    diceContainer.y = 2.5;

    const bg = new createjs.Shape();
    bg.graphics.beginFill('rgba(255, 255, 255, 0.5)');   
    bg.graphics.rect(0,0, window.innerWidth, 60);

    const diceBg = this.setBitmap('dice_bg');

    this.diceText = new createjs.Text(this.dice.count, '24px Roboto', '#57450d');
    this.diceText.x = 21;
    this.diceText.y = 14;

    this.btnDice = this.setBitmap('btn_dice');
    this.btnDice.x = window.innerWidth / 2 - this.btnDice.getBounds().width / 4;
    this.btnDice.y = 10;
    this.btnDice.addEventListener('click', () => {
      if (this.dice.isRoll) return;
      this.dice.count = random(1, 6);
      this.diceText.text = this.dice.count;
      this.dice.isRoll = true;
      stage.update();
    })
    
    diceContainer.addChild(diceBg, this.diceText);
    footer.addChild(bg, diceContainer, this.btnDice);
    return footer;
  }

  setSquare() {
    const charactor = this.setCharaSprite();
    const squares = new createjs.Container();
    let isSquareEneble = true;

    const length = MapPosition.length;
    for (let i = 0; i < length; i++) {
      const item = MapPosition[i];
      const len = item.length;
      for (let t = 0; t < len; t++) {
        const square = new createjs.Bitmap(this.loaders[`square_${item[t]}`]);
        square.skewX = item[t].width / 2;
        square.skewY = item[t].height / 2;
        square.y = i * 80;
        square.x = t * 80;
        square.type = item[t];
        square.pos = {
          x: t,
          y: i
        };
        if (square.type) {
          square.addEventListener('click', (obj) => {
            if (!isSquareEneble) return;
            isSquareEneble = false;
            const posDiffX = obj.target.pos.x - state.map.piece.pos.x;
            const posDiffY = obj.target.pos.y - state.map.piece.pos.y;
            const posDiff = Math.abs(posDiffX) + Math.abs(posDiffY);

            if (this.dice.count && posDiff === 1 && this.dice.isRoll) {
              state.map.piece.pos = obj.target.pos;
              charactor.gotoAndPlay('walk');
              createjs.Tween.get(charactor)
                .to({
                  x: obj.target.x,
                  y: obj.target.y
                }, 400)
                .call(() => {
                  charactor.stop();
                  if (!this.dice.count) {
                    console.log(obj.target.type);
                    state.map.currentType = obj.target.type;
                    switch (obj.target.type) {
                      case 1:
                        route.to('battle');
                        break;
                      case 2:
                        route.to('talk');
                        break;
                      case 3:
                        route.to('talk');
                        break;
                    }
                    setTimeout(() => {
                      this.destroy();
                    }, 1000);
                  }
                })
              
              if (this.walk.history.length !== 1) {
                if (this.isRedo(obj.target.pos.x, obj.target.pos.y)) {
                  this.dice.count += 1;
                  this.walk.history.pop();
                } else {
                  this.dice.count -= 1;
                  this.walk.history.push({
                    x: obj.target.pos.x,
                    y: obj.target.pos.y
                  })
                }
              } else {
                this.dice.count -= 1;
                this.walk.history.push({
                  x: obj.target.pos.x,
                  y: obj.target.pos.y
                })
              }

              this.diceText.text = this.dice.count;
              stage.update();
            } else {
              console.log('そこは進めません');
            }
          });
        }
        squares.addChild(square);
      }
    }
    charactor.x = state.map.piece.pos.x * 80;
    charactor.y = state.map.piece.pos.y * 80;
    squares.x = state.map.squares.pos.x;
    squares.y = state.map.squares.pos.y;
    squares.addChild(charactor);

    return squares;
  }

  isRedo(x, y) {
    const index = this.walk.history.length - 2;
    let bool = false;
    if (x === this.walk.history[index].x && y === this.walk.history[index].y) {
      bool = true;
    }
    return bool;
  }

  setField() {
    const field = new createjs.Bitmap(this.loaders['field']);
    field.skewX = field.width / 2;
    field.skewY = field.height / 2;
    field.scaleX = 2;
    field.scaleY = 2;
    return field;
  }

  destroy() {
    stage.removeChild(this.field, this.squares, this.footer);
    window.removeEventListener('touchstart', this.touchstartHandler);
    window.removeEventListener('touchmove', this.touchmoveHandler);
    window.removeEventListener('touchend', this.touchendHandler);
    stage.update();
  }
}

export default Map;
