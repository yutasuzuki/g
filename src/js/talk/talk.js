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
    name: '男たち',
    text: 'こんにちは!!'
  },
  {
    type: 1,
    name: 'ルシェ',
    text: 'こちらはなんですか？'
  },
  {
    type: 0,
    name: '男たち',
    text: 'ここは宿屋です'
  },
  {
    type: 0,
    name: '男たち',
    text: 'ここは宿屋です!!'
  },
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
      {src: 'castle.jpg', id: 'castle'},
      {src: 'chara_8.png', id: 'main_chara'},
      {src: 'king.png', id: 'king'},
      {src: 'person.png', id: 'person'},
    ];
    queue.loadManifest(charaManifest, true, '/assets/images/talk/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    this.background = this.setBackground('castle');
    this.mainChara = this.setMainCharactor('main_chara');
    this.otherChara = this.setOtherCharactor('person');
    this.comment = this.setCommentBox();

    stage.addChild(this.background, this.otherChara, this.mainChara, this.comment);
    stage.update();
  }

  setBackground(key) {
    const bg = new createjs.Bitmap(this.loaders[key]);
    bg.x = - bg.getBounds().width / 2 + 50;
    bg.y = 0;
    bg.scaleX = 1.5;
    bg.scaleY = 1.5;

    return bg;
  }

  setMainCharactor(key) {
    const container = new createjs.Container();
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.x = -100;
    chara.y = 140;
    chara.scaleX = 0.9;
    chara.scaleY = 0.9;

    container.addChild(chara);
    return container;
  }

  setOtherCharactor(key) {
    const container = new createjs.Container();
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.x = 100;
    chara.y = 140;
    chara.scaleX = 0.9;
    chara.scaleY = 0.9;

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
          this.mainChara.cache(0, 0, 480, 480);
          this.otherChara.filters = [
            new createjs.ColorFilter(0.6, 0.6, 0.6, 1, 0, 0, 0, 0)
          ];
          this.otherChara.cache(0, 0, 480, 480);
        }  else {
          stage.setChildIndex(this.mainChara, stage.getNumChildren() + 1);
          stage.setChildIndex(this.otherChara, stage.getNumChildren() - 1);
          this.mainChara.filters = [
            new createjs.ColorFilter(0.6, 0.6, 0.6, 1, 0, 0, 0, 0)
          ];
          this.mainChara.cache(0, 0, 480, 480);
          this.otherChara.filters = [];
          this.otherChara.cache(0, 0, 480, 480);
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
