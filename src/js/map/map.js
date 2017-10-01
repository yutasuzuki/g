import _ from 'lodash';

class Map {
  constructor() {
    this.loaders = [];
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    queue.loadManifest(fieldManifest, true, '/assets/images/field/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const field = this.setField();
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);
    stage.addChild(field);
    stage.update();
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