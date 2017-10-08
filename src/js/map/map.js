import _ from 'lodash';
import { random } from '../util'

const MapPosition = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

class Map {
  constructor() {
    this.loaders = [];
    this.dice = {
      isRoll: false,
      count: 0,
    };
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    const mapManifest = [
      {src: 'btn_dice.png', id: 'btn_dice'},
      {src: 'square_0.png', id: 'square_0'},
      {src: 'square_1.png', id: 'square_1'}
    ];
    const charaManifest = [
      {src: 'chara_8.png', id: 'chara'},
    ];
    queue.loadManifest(charaManifest, true, '/assets/images/chara/');
    queue.loadManifest(mapManifest, true, '/assets/images/map/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    this.field = this.setField();
    this.squares = this.setSquare();
    this.btnDice = this.setBitmap('btn_dice');
    this.btnDice.x = window.innerWidth / 2 - this.btnDice.getBounds().width / 4;
    this.btnDice.y = window.innerHeight - this.btnDice.getBounds().height / 2;
    console.log(window.innerHeight);
    console.log(this.btnDice.getBounds().width);
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
    window.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      touch.start.x = t.pageX;
      touch.start.y = t.pageY;
      this.squares.x = touch.history.x;
      this.squares.y = touch.history.y;
    });
    window.addEventListener('touchmove', (e) => {
      const t = e.changedTouches[0];
      const diffX = touch.start.x - t.pageX;
      const diffY = touch.start.y - t.pageY;
      console.log(window.innerWidth);
      if (window.innerWidth - this.squares.getBounds().width <= this.squares.x && this.squares.x <= 0) {
        this.squares.x = touch.history.x - diffX;
      }
      if (window.innerHeight - this.squares.getBounds().height <= this.squares.y && this.squares.y <= 0) {
        this.squares.y = touch.history.y - diffY;
      }
    });
    window.addEventListener('touchend', () => {
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
      touch.history.x = state.map.squares.pos.x = this.squares.x;
      touch.history.y = state.map.squares.pos.y = this.squares.y;
    });
    this.diceText = new createjs.Text(this.dice.count, "18px serif", "black");
    
    this.diceText.x = + 88;
    this.diceText.y = + 22;
    this.btnDice.addEventListener('click', () => {
      this.dice.count = random(1, 6);
      this.diceText.text = this.dice.count;
      stage.addChild(this.diceText);
      stage.update();
      this.dice.isRoll = true;
    })
    stage.addChild(this.field, this.squares, this.btnDice);
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

  setSquare() {
    const charactor = this.setBitmap('chara');
    const squares = new createjs.Container();
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
            console.log('obj', obj);
            const posDiffX = obj.target.pos.x - state.map.piece.pos.x;
            const posDiffY = obj.target.pos.y - state.map.piece.pos.y;
            const posDiff = Math.abs(posDiffX) + Math.abs(posDiffY);

            if (posDiff === 1 && this.dice.isRoll) {
              state.map.piece.pos = obj.target.pos;
              charactor.x = obj.target.x;
              charactor.y = obj.target.y;
              this.dice.count -= 1;
              this.diceText.text = this.dice.count;
              stage.update();
              console.log('this.dice.count', this.dice.count);
              if (!this.dice.count) {
                route.to('battle');
                setTimeout(function() {
                  stage.removeChild(this.field, this.squares, this.btnDice, this.diceText);
                }, 1000);
              }
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
    console.log('state.map.piece.', state.map.piece);
    squares.x = state.map.squares.pos.x;
    squares.y = state.map.squares.pos.y;
    squares.addChild(charactor);
    return squares;
  }

  setField() {
    const field = new createjs.Bitmap(this.loaders['field']);
    field.skewX = field.width / 2;
    field.skewY = field.height / 2;
    field.scaleX = 2;
    field.scaleY = 2;
    return field;
  }
}

export default Map;
