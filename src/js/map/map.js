import _ from 'lodash';

const MapPosition = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let dice = 4;

class Map {
  constructor() {
    this.loaders = [];
    this.dice = null;
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
    const field = this.setField();
    const squares = this.setSquare();
    const btnDice = this.setBitmap('btn_dice');
    btnDice.x = window.innerWidth / 2 - btnDice.getBounds().width / 4;
    btnDice.y = window.innerHeight - btnDice.getBounds().height / 2;
    console.log(window.innerHeight);
    console.log(btnDice.getBounds().width);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);
    let touch = {
      start: {
        x: 0,
        y: 0
      },
      history: {
        x: 0,
        y: 0
      }
    };
    window.addEventListener('touchstart', function(e) {
      const t = e.changedTouches[0];
      touch.start.x = t.pageX;
      touch.start.y = t.pageY;
      squares.x = touch.history.x;
      squares.y = touch.history.y;
    });
    window.addEventListener('touchmove', function(e) {
      const t = e.changedTouches[0];
      const diffX = touch.start.x - t.pageX;
      const diffY = touch.start.y - t.pageY;
      console.log(window.innerWidth);
      if (window.innerWidth - squares.getBounds().width <= squares.x && squares.x <= 0) {
        squares.x = touch.history.x - diffX;
      }
      if (window.innerHeight - squares.getBounds().height <= squares.x && squares.x <= 0) {
        squares.y = touch.history.y - diffY;
      }
    });
    window.addEventListener('touchend', function() {
      if (squares.x < window.innerWidth - squares.getBounds().width) {
        squares.x = window.innerWidth - squares.getBounds().width;
      } else if (squares.x > 0) {
        squares.x = 0;
      }
      if (squares.y > 0) {
        squares.y = 0;
      }
      touch.history.x = squares.x;
      touch.history.y = squares.y;
    });
    const diceNumber = new createjs.Text(this.dice, "18px serif", "black");
    
    diceNumber.x = + 88;
    diceNumber.y = + 22;
    btnDice.addEventListener('click', () => {
      this.dice = random(1, 6);
      diceNumber.text = this.dice;
      stage.addChild(diceNumber);
      stage.update();
    })
    stage.addChild(field, squares, btnDice);
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
          square.addEventListener('click', function(obj) {
            console.log()
            const posDiffX = obj.target.pos.x - state.pos.x;
            const posDiffY = obj.target.pos.y - state.pos.y;
            console.log(posDiffX)
            console.log(posDiffY)
            if ((Math.abs(posDiffX) === 1 || Math.abs(posDiffX) === 0) && (Math.abs(posDiffY) === 1 || Math.abs(posDiffY) === 0)) {
              if ((Math.abs(posDiffX) === 1 && Math.abs(posDiffY) === 1)) return console.log('そこは進めません');
              state.pos = obj.target.pos;
              charactor.x = obj.target.x;
              charactor.y = obj.target.y;
              console.log(dice);
              dice -= 1;
              if (!dice) {
                route.to('battle');
              }
            } else {
              console.log('そこは進めません')
            }
          });
        }
        squares.addChild(square);
      }
    }
    charactor.x = state.pos.x * 80;
    charactor.y = state.pos.y * 80;
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



// 幅を指定するランダム関数
function random(min = 0, max = 100) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}


export default Map;