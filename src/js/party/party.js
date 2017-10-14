import _ from 'lodash';
import { random } from '../util';

class Party {
  constructor() {
    this.loaders = [];
    this.members = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    this.selected = {
      main: {},
      sub: {},
    }
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const memberManifest = this.createMemberManifest();
    const homeManifest = [
      {src: 'header.png', id: 'header'},
    ];
    queue.loadManifest(memberManifest, true, './assets/images/chara/icon/');
    queue.loadManifest(homeManifest, true, './assets/images/home//');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const container = new createjs.Container();
    const header = this.setHeader()
    const party = this.setParty();
    const charaContainer = this.setMember();

    container.addChild(charaContainer, party);
    stage.addChild(container, header);
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

  setParty() {
    const container = new createjs.Container();
    const ids = state.party.map(value => value.id)

    let i = 0;
    ids.forEach((id) => {
      const charactorContainer = new createjs.Container();
      const charactor = new createjs.Bitmap(this.loaders[`chara_${id}`]);
      charactor.scaleX = window.innerWidth / charactor.getBounds().width / 5;
      charactor.scaleY = window.innerWidth / charactor.getBounds().width / 5;
      charactor.x = i * charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / 5;
      charactor.y = charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / 5;
      charactor.charaID = id;
      charactorContainer.addChild(charactor);
      charactorContainer.addEventListener('click', (e) => {
        if (this.selected.main.charaID !== e.target.charaID) {
          
          if (Object.keys(this.selected.main).length) {
            this.selected.main.filters = [];
            this.selected.main.cache(0, 0, 960, 960);
          }
          e.target.filters = [
            new createjs.ColorFilter(0.4, 0.4, 0.4, 1, 60, 10, 10, 0)
          ];
          e.target.cache(0, 0, 960, 960);
          this.selected.main = e.target;
        } else {
          this.selected.main = {};
          e.target.filters = [];
          e.target.cache(0, 0, 960, 960);
        }
        console.log(this.selected)
        stage.update();
      })
      container.addChild(charactorContainer);
      i++;
    })

    return container;
  }

  setMember() {
    const COLUMN_COUNT = 6;
    const container = new createjs.Container();
    const length = this.members.length;
    const lengthY = Math.ceil(length / COLUMN_COUNT);
  
    let i = 0;
    let t = 0;
    this.members.forEach((id) => {
      const charactorContainer = new createjs.Container();
      let historyCharactor = '';
      const charactor = new createjs.Bitmap(this.loaders[`chara_${id}`]);
      charactor.scaleX = window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.scaleY = window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.x = i * charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.y = t * charactor.getBounds().width * window.innerWidth / charactor.getBounds().width / COLUMN_COUNT;
      charactor.charaID = id;

      charactorContainer.charaID = id;
      charactorContainer.addChild(charactor);
      
      charactorContainer.addEventListener('click', (e) => {
        if (state.party.map(value => value.id).indexOf(e.target.charaID) !== -1) return;

        if (this.selected.sub.charaID !== e.target.charaID) {

          if (Object.keys(this.selected.sub).length) {
            this.selected.sub.filters = [];
            this.selected.sub.cache(0, 0, 960, 960);
          }
          e.target.filters = [
            new createjs.ColorFilter(0.4, 0.4, 0.4, 1, 10, 10, 60, 0)
          ];
          e.target.cache(0, 0, 960, 960);
          this.selected.sub = e.target;
        } else {
          this.selected.sub = {};
          e.target.filters = [];
          e.target.cache(0, 0, 960, 960);
        }
        console.log(this.selected)
        stage.update();
      });

      // main partyに入っているキャラはグレイアウト
      if (state.party.map(value => value.id).indexOf(id) !== -1) {
        charactorContainer.filters = [
          new createjs.ColorFilter(0.5, 0.5, 0.5, 1, 0, 0, 0, 0)
        ];
        charactorContainer.cache(0, 0, 960, 960);
      }

  
      if (i < COLUMN_COUNT - 1) {
        i++;
      } else {
        i = 0;
        t++;
      }

      container.addChild(charactorContainer);
    })

    container.y = 200;

    return container;
  }
  
  setHeader() {
    const container = new createjs.Container();
    const header = new createjs.Bitmap(this.loaders['header']);
    header.scaleX = window.innerWidth / header.getBounds().width;
    header.scaleY = window.innerWidth / header.getBounds().width;
    header.x = 0;
    header.y = 0;
    header.addEventListener('click', e => route.to('home'))

    container.addChild(header);
    return container;
  }

  destroy() {
    stage.removeChild(this.field, this.squares, this.footer);
    stage.update();
  }
}

export default Party;
