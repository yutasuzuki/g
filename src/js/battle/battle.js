import constants from './constants';

class Battle {
  constructor() {
    this.loaders = {};
    this.preload();
  }

  async preload() {
    const preload = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    const commandManifest = [
      {src: 'command_attack.png', id: 'attack'},
      {src: 'command_magic.png', id: 'magic'},
      {src: 'command_skill.png', id: 'skill'},
      {src: 'command_skip.png', id: 'skip'},
    ];
    const charactors = await ayncGetChara();
    const myCharaManifest = this.createMyCharaManifest(charactors);
    preload.loadManifest(commandManifest, true, '/assets/images/battle/');
    preload.loadManifest(fieldManifest, true, '/assets/images/field/');
    preload.loadManifest(myCharaManifest, true, '/assets/images/chara/');
    preload.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    preload.addEventListener('complete', () => this.init());
  }

  init() {
    const bg = this.setBackground();
    const command = this.setCommand();
    const myCharactor = this.setMyCharactor();
    Stage.addChild(bg, command, myCharactor);
    Stage.update();
  }

  createMyCharaManifest(charactors) {
    return charactors.map((charactor) => {
      return {
        src: `chara_${charactor.id}.png`,
        id:  `chara_${charactor.id}`,
      }
    })
  }

  setBackground() {
    const field = new createjs.Bitmap(this.loaders['field']);
    field.skewX = field.width / 2;
    field.skewY = field.height / 2;
    field.scaleX = 1.45;
    field.scaleY = 1.45;
    field.y = -200;
    return field;
  }

  setCommand() {
    const command = new createjs.Container();
    const attack = new createjs.Bitmap(this.loaders['attack']);
    attack.x = 0;
    attack.y = 0;
    attack.scaleX = .5;
    attack.scaleY = .5;
    const magic = new createjs.Bitmap(this.loaders['magic']);
    magic.x = window.innerWidth / 2;
    magic.y = 0;
    magic.scaleX = .5;
    magic.scaleY = .5;
    const skill = new createjs.Bitmap(this.loaders['skill']);
    skill.x = 0;
    skill.y = 100;
    skill.scaleX = .5;
    skill.scaleY = .5;
    const skip = new createjs.Bitmap(this.loaders['skip']);
    skip.x = window.innerWidth / 2;
    skip.y = 100;
    skip.scaleX = .5;
    skip.scaleY = .5;
     
    command.addChild(attack, magic, skill, skip);
    command.y = window.innerHeight - 200;

    return command;
  }

  setMyCharactor() {
    
  }
}



function ayncGetChara() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(CHARACTOR);
    }, 500);
  });
}

const CHARACTOR = [
  {
    id: 8,
    name: '女１',
    HP: 50,
    ATK: 20,
    DF: 20,
    SP: 12,
  },
  {
    id: 13,
    name: '女１',
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 11,
  },
  {
    id: 17,
    name: '女１',
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 12,
  },
  {
    id: 14,
    name: '女１',
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 14,
  },
  {
    id: 1,
    name: '男１',
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 15,
  }
]


export default Battle;