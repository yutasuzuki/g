import _ from 'lodash';
import { random, wrapText } from '../util';

const castleTalk = {
  talk: [
    {
      type: 2,
      name: '王様',
      text: 'よく参られた！'
    },
    {
      type: 1,
      name: 'ルシェ',
      text: 'こんにちは'
    },
    {
      type: 2,
      name: '王様',
      text: '今回は城の周りをモンスターをよくぞ討伐してくれた'
    },
    {
      type: 2,
      name: '王様',
      text: '後ほど褒美を取らせよう！'
    },
    {
      type: 1,
      name: 'ルシェ',
      text: 'こちらの口座に振り込んでください'
    },
    {
      type: 0,
      name: '',
      text: 'ルシェはカバンから通帳を取り出した'
    }
  ],
  next: 'home'
};

const innTalk = {
  talk: [ 
    {
      type: 1,
      name: 'ルシェ',
      text: 'こんにちは'
    },
    {
      type: 2,
      name: '宿屋',
      text: 'いらっしゃいませ！'
    },
    {
      type: 2,
      name: '宿屋',
      text: '宿屋へようこそ！'
    },
    {
      type: 0,
      name: '',
      text: '（沈黙）'
    },
    {
      type: 1,
      name: 'ルシェ',
      text: '今日泊まりたいのだけれども・・・'
    },
    {
      type: 2,
      name: '宿屋',
      text: 'お好きな部屋をお使いください！'
    },
    {
      type: 1,
      name: 'ルシェ',
      text: 'ありがとう'
    }
  ],
  next: 'map'
};


class Talk {
  constructor(type) {
    this.loaders = [];
    this.talk = {
      current: 0,
      type: {},
      name: {},
      text: {}
    }
    this.talkscript = [];
    this.setting = {
      mask: [0.6, 0.6, 0.6, 1, 0, 0, 0, 0],
      cache: [0, 0, 960, 960]
    }
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const talkManifest = [
      {src: 'inn.jpg', id: 'inn'},
      {src: 'castle.jpg', id: 'castle'},
      {src: 'king.png', id: 'king'},
      {src: 'person_2.png', id: 'person'}
    ];
    const charaManifest = [
      {src: 'chara_8.png', id: 'main_chara'}
    ];
    queue.loadManifest(talkManifest, true, './assets/images/talk/');
    queue.loadManifest(charaManifest, true, './assets/images/chara/talk/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    return new Promise((resolve, reject) => {
      queue.addEventListener('complete', async () => {
        const res = await this.init();
        resolve(res);
      });
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      this.mainChara = this.setMainCharactor('main_chara');
      if (state.map.currentType === 2) {
        this.background = this.setBackground('inn');
        this.otherChara = this.setOtherCharactor('person');
        this.talkscript = innTalk;
      } else if (state.map.currentType === 3) {
        this.background = this.setBackground('castle');
        this.otherChara = this.setOtherCharactor('king');
        this.talkscript = castleTalk;
      }
      this.comment = this.setCommentBox();

      this.mainChara.filters = [
        new createjs.ColorFilter(...this.setting.mask)
      ];
      this.mainChara.cache(...this.setting.cache);
      this.otherChara.filters = [
        new createjs.ColorFilter(...this.setting.mask)
      ];
      this.otherChara.cache(...this.setting.cache);

      stage.addChild(this.background, this.otherChara, this.mainChara, this.comment);
      stage.update();
      resolve('talk');
    });
  }

  setBackground(key) {
    const bg = new createjs.Bitmap(this.loaders[key]);
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
    this.talk.text.lineWidth = window.innerWidth - 40;
    this.talk.text.lineHeight = 24;
    this.talk.text.x = 20;
    this.talk.text.y = 60;

    bg.addEventListener('click', () => {
      const item = this.talkscript.talk[this.talk.current];
      if (item) {
        if (item.type === 0) {
          this.mainChara.filters = [
            new createjs.ColorFilter(...this.setting.mask)
          ];
          this.mainChara.cache(...this.setting.cache);
          this.otherChara.filters = [
            new createjs.ColorFilter(...this.setting.mask)
          ];
          this.otherChara.cache(...this.setting.cache);
        } else if (item.type === 1) {
          stage.setChildIndex(this.mainChara, -1);
          stage.setChildIndex(this.otherChara, 1);
          this.mainChara.filters = [];
          this.mainChara.cache(...this.setting.cache);
          this.otherChara.filters = [
            new createjs.ColorFilter(...this.setting.mask)
          ];
          this.otherChara.cache(...this.setting.cache);
        } else if (item.type === 2) {
          stage.setChildIndex(this.mainChara, 1);
          stage.setChildIndex(this.otherChara, -1);
          this.mainChara.filters = [
            new createjs.ColorFilter(...this.setting.mask)
          ];
          this.mainChara.cache(...this.setting.cache);
          this.otherChara.filters = [];
          this.otherChara.cache(...this.setting.cache);
        }
        stage.setChildIndex(this.comment, -1);
        this.talk.name.text = item.name;
        this.talk.text.text = wrapText(this.talk.text, item.text);
        stage.update();
        this.talk.current++;
      } else {
        route.to(this.talkscript.next);
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
