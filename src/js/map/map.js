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
    // queue.loadManifest(fieldManifest, true, '/assets/images/field/');
    queue.loadManifest(squareManifest, true, '/assets/images/map/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const field = this.setField();
    const squares = this.setSquare();
    console.log(squares);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);
    // squares.addEventListener('click', function() {
    //   squares.x += 100;
    //   squares.y += 100;
    // });
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