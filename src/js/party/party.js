import _ from 'lodash';
import { random } from '../util';

class Party {
  constructor() {
    this.loaders = [];
    this.members = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const myCharaManifest = [
      {src: 'chara_8.png', id: 'chara_8'},
    ];
    const memberManifest = this.createMemberManifest();
    queue.loadManifest(memberManifest, true, './assets/images/chara/deformer/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const container = new createjs.Container();
    const sprite = this.setBitmap('chara_8');
    const charaContainer = this.setMember();

    container.addChild(sprite, charaContainer);
    stage.addChild(container);
    stage.update();
  }

  createMemberManifest() {
    return this.members.map((id) => {
      return {
        src: `chara_${id}.png`,
        id: `chara_${id}`,
      }
    })
  }
    
  setBitmap(key) {
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.skewX = chara.width / 2;
    chara.skewY = chara.height / 2;
    chara.scaleX = 0.5;
    chara.scaleY = 0.5;
    return chara;
  }

  setMember() {
    const COLUMN_COUNT = 6;
    const charactorsContainer = new createjs.Container();
    const length = this.members.length;
    const lengthY = Math.ceil(length / COLUMN_COUNT);

    let i = 0;
    let t = 0;
    this.members.forEach((id) => {
      const charactorContainer = new createjs.Container();
      const charactor = new createjs.Bitmap(this.loaders[`chara_${id}`]);
      charactor.scaleX = window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.scaleY = window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.x = i * charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.y = t * charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;

      charactorContainer.addChild(charactor);
      charactorsContainer.addChild(charactorContainer);
  
      if (i < COLUMN_COUNT - 1) {
        i++;
      } else {
        i = 0;
        t++;
      }
    })

    charactorsContainer.y = 200;

    return charactorsContainer;
  }

  destroy() {
    stage.removeChild(this.field, this.squares, this.footer);
    stage.update();
  }
}

export default Party;
