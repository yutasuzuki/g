import _ from 'lodash';
import { random } from '../util';

class Party {
  constructor() {
    this.loaders = [];
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const walkManifest = [
      {src: 'chara_8.png', id: 'walk'},
    ];
    queue.loadManifest(walkManifest, true, './assets/images/map/sprite/walk/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const container = new createjs.Container();
    const sprite = this.setBitmap('walk');

    container.addChild(sprite);
    stage.addChild(container);
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
    stage.update();
  }
}

export default Party;
