import _ from 'lodash';
import { random } from '../util';

const talkscript = [
  {
    type: 1,
    name: 'ルシェ',
    text: 'こんにちは'
  },
  {
    type: 0,
    name: '宿屋',
    text: 'いらっしゃいませ！'
  },
  {
    type: 1,
    name: 'ルシェ',
    text: 'こちらはなんですか？'
  },
  {
    type: 0,
    name: '宿屋',
    text: 'ここは宿屋です！'
  },
  {
    type: 1,
    name: 'ルシェ',
    text: '今日泊まりたいのだけれども・・・'
  },
  {
    type: 0,
    name: '宿屋',
    text: 'お好きな部屋をお使いください！'
  },
  {
    type: 1,
    name: 'ルシェ',
    text: 'ありがとう'
  }
]


class Talk {
  constructor(type) {
    this.loaders = [];
    this.talk = {
      current: 0,
      type: {},
      name: {},
      text: {}
    }
    console.log(state)
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const charaManifest = [
      {src: 'inn.jpg', id: 'inn'},
      {src: 'castle.jpg', id: 'castle'},
      {src: 'chara_8.png', id: 'main_chara'},
      {src: 'king.png', id: 'king'},
      {src: 'person_2.png', id: 'person'},
    ];
    queue.loadManifest(charaManifest, true, '/assets/images/talk/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    this.mainChara = this.setMainCharactor('main_chara');

    if (state.map.currentType === 2) {
      this.background = this.setBackground('inn');
      this.otherChara = this.setOtherCharactor('person');
    } else if (state.map.currentType === 3) {
      this.background = this.setBackground('castle');
      this.otherChara = this.setOtherCharactor('king');
    }
    this.comment = this.setCommentBox();

    stage.addChild(this.background, this.otherChara, this.mainChara, this.comment);
    stage.update();
  }

  setBackground(key) {
    const bg = new createjs.Bitmap(this.loaders[key]);
    console.log(window.innerWidth);
    console.log(bg.getBounds().width);
    bg.x = window.innerWidth / 2 - bg.getBounds().width / 2;
    bg.y = 0;
    bg.scaleX = 1;
    bg.scaleY = 1;

    return bg;
  }

  setMainCharactor(key) {
    const container = new createjs.Container();
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.x = -100;
    chara.y = window.innerHeight - chara.getBounds().height * 0.7 - 240;
    chara.scaleX = 0.8;
    chara.scaleY = 0.8;

    container.addChild(chara);
    return container;
  }

  setOtherCharactor(key) {
    const container = new createjs.Container();
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.x = 100;
    chara.y = window.innerHeight - chara.getBounds().height * 0.7 - 240;
    chara.scaleX = 0.8;
    chara.scaleY = 0.8;

    container.addChild(chara);
    return container;
  }

  setCommentBox() {
    const commentBoxHeight = 200;
    const container = new createjs.Container();
    container.y = window.innerHeight - commentBoxHeight;

    const bg = new createjs.Shape();
    bg.graphics.beginFill('rgba(0, 0, 0, 1)');   
    bg.graphics.rect(0,0, window.innerWidth, commentBoxHeight);
    
    this.talk.name = new createjs.Text('', '20px Roboto', '#fff');
    this.talk.name.x = 20;
    this.talk.name.y = 20;

    this.talk.text = new createjs.Text('', '16px Roboto', '#fff');
    this.talk.text.x = 20;
    this.talk.text.y = 60;

    bg.addEventListener('click', () => {
      const item = talkscript[this.talk.current];
      if (item) {
        if (item.type) {
          stage.setChildIndex(this.mainChara, stage.getNumChildren() - 1);
          stage.setChildIndex(this.otherChara, stage.getNumChildren() + 1);
          this.mainChara.filters = [];
          this.mainChara.cache(0, 0, 960, 960);
          this.otherChara.filters = [
            new createjs.ColorFilter(0.6, 0.6, 0.6, 1, 0, 0, 0, 0)
          ];
          this.otherChara.cache(0, 0, 960, 960);
        } else {
          stage.setChildIndex(this.mainChara, stage.getNumChildren() + 1);
          stage.setChildIndex(this.otherChara, stage.getNumChildren() - 1);
          this.mainChara.filters = [
            new createjs.ColorFilter(0.6, 0.6, 0.6, 1, 0, 0, 0, 0)
          ];
          this.mainChara.cache(0, 0, 960, 960);
          this.otherChara.filters = [];
          this.otherChara.cache(0, 0, 960, 960);
        }
        stage.setChildIndex(this.comment, stage.getNumChildren() - 1);
        this.talk.name.text = item.name;
        this.talk.text.text = item.text;
        stage.update();
        this.talk.current++;
      } else {
        route.to('map');
        this.destroy();
      }
    });

    container.addChild(bg, this.talk.name, this.talk.text);
    return container;
  }

  destroy() {
    stage.removeChild(this.background, this.otherChara, this.mainChara, this.comment);
    stage.update();
  }
}

export default Talk;
