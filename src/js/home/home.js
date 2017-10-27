import _ from 'lodash';
import { random, partyFullRecovery } from '../util';

class Home {
  constructor(type) {
    this.loaders = [];
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const homeManifest = [
      {src: 'bg.jpg', id: 'bg'},
      {src: 'header.png', id: 'header'},
      {src: 'btn_quest.png', id: 'btn_quest'},
      {src: 'btn_party.png', id: 'btn_party'},
    ];
    const charaManifest = [
      {src: 'chara_8.png', id: 'main_chara'}
    ];
    queue.loadManifest(charaManifest, true, './assets/images/chara/stand/');
    queue.loadManifest(homeManifest, true, './assets/images/home/');
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
      this.container = new createjs.Container();
      const bg = this.setBackground('bg');
      const mainCharactor = this.setMainCharactor('main_chara');
      this.header = this.setHeader();
      this.footer = this.setFooter();
      this.container.addChild(bg, mainCharactor);
      this.container.y = - 100;
      stage.addChild(this.container, this.header, this.footer);
      stage.update();
      partyFullRecovery();
      resolve('home');
    });
  }

  setBackground(key) {
    const bg = new createjs.Bitmap(this.loaders[key]);
    bg.x = window.innerWidth / 2 - bg.getBounds().width / 2;
    bg.y = window.innerHeight - bg.getBounds().height;
    bg.scaleX = 1;
    bg.scaleY = 1;

    return bg;
  }

  setMainCharactor(key) {
    const container = new createjs.Container();
    const chara = new createjs.Bitmap(this.loaders[key]);
    chara.y = window.innerHeight - chara.getBounds().height / 2;
    chara.scaleX = 0.5;
    chara.scaleY = 0.5;

    container.addChild(chara);
    return container;
  }

  setFooter() {
    const container = new createjs.Container();
    container.y = window.innerHeight - 100;

    const btnQuest = new createjs.Bitmap(this.loaders['btn_quest']);
    btnQuest.x = 0;
    btnQuest.y = 10;
    btnQuest.addEventListener('click', () => {
      // スタートする位置
      state.map.piece.pos.x = 0;
      state.map.piece.pos.y = 0;
      route.to('map');
      this.destroy()
    })

    const btnParty = new createjs.Bitmap(this.loaders['btn_party']);
    btnParty.x = window.innerWidth / 2;
    btnParty.y = 10;
    btnParty.addEventListener('click', () => {
      route.to('party');
      this.destroy()
    })
    
    container.addChild(btnQuest, btnParty);
    return container;
  }

  setHeader() {
    const container = new createjs.Container();
    const header = new createjs.Bitmap(this.loaders['header']);
    header.scaleX = window.innerWidth / header.getBounds().width;
    header.scaleY = window.innerWidth / header.getBounds().width;
    header.x = 0;
    header.y = 0;

    const gold = new createjs.Text(`${state.gold} G`, "12px Roboto", "white");
    gold.textAlign = "left";
    console.log(gold.getBounds().width)
    gold.regX = gold.getBounds().width;
    gold.x = window.innerWidth - 10;
    gold.y = header.getBounds().height - 34;

    container.addChild(header, gold);
    return container;
  }

  destroy() {
    stage.removeChild(this.container, this.header, this.footer);
  }
}

export default Home;
