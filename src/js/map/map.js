import _ from 'lodash';

const MapPosition = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
]

class Map {
  constructor() {
    this.loaders = [];
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    const squareManifest = [
      {src: 'square_0.png', id: 'square_0'},
      {src: 'square_1.png', id: 'square_1'}
    ];
    const charaManifest = [
      {src: 'chara_8.png', id: 'chara'},
    ];
    queue.loadManifest(charaManifest, true, '/assets/images/chara/');
    queue.loadManifest(squareManifest, true, '/assets/images/map/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const field = this.setField();
    const squares = this.setSquare();
    console.log(squares.getBounds().width);
    console.log(squares.getBounds().height);
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
    stage.addChild(field, squares);
    stage.update();
  }

  setSquare() {
    const squares = new createjs.Container();
    const length = MapPosition.length;
    for (let i = 0; i < length; i++) {
      const item = MapPosition[i];
      const len = item.length;
      for (let t = 0; t < len; t++) {
        const square = new createjs.Bitmap(this.loaders[`square_${item[t]}`]);
        square.skewX = item[t].width / 2;
        square.skewY = item[t].height / 2;
        // square.scaleX = 0.5;
        // square.scaleY = 0.5;
        square.y = i * 80;
        square.x = t * 80;
        squares.addChild(square);
      }
    }
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