import _ from 'lodash';
import constants from './constants';

class Battle {
  constructor() {
    this.loaders = {};
    this.preload();
    this.status = {
      own: {
        chara: {}
      },
      enemy: {
        chara: {}
      }
    }
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
    this.myCharactors = await ayncGetChara(MY_CHARACTOR);
    const myCharaManifest = this.createCharaManifest(this.myCharactors);
    this.enemyCharactors = await ayncGetChara(ENEMY_CHARACTOR);
    const enemyCharaManifest = this.createCharaManifest(this.enemyCharactors);
    preload.loadManifest(commandManifest, true, '/assets/images/battle/');
    preload.loadManifest(fieldManifest, true, '/assets/images/field/');
    preload.loadManifest(myCharaManifest, true, '/assets/images/chara/');
    preload.loadManifest(enemyCharaManifest, true, '/assets/images/chara/');
    preload.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    preload.addEventListener('complete', () => this.init());
  }

  init() {
    const bg = this.setBackground();
    const command = this.setCommands();
    this.myTroops = this.setCharactors(this.myCharactors);
    this.enemyTroops = this.setCharactors(this.enemyCharactors, 'enemy');
    this.Flow = new Flow(this.myTroops, this.enemyTroops);
    this.turn();
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", Stage);
    Stage.addChild(bg, command, ...this.myTroops, ...this.enemyTroops);
    Stage.update();
  }

  turn() {
    const { orderedMyChara, orderedEnemyChara } = this.Flow.turn();
    this.orderedMyChara = orderedMyChara;
    this.orderedEnemyChara = orderedEnemyChara;
  }

  createCharaManifest(charactors) {
    return charactors.map((charactor) => {
      return {
        src: `chara_${charactor.id}.png`,
        id: `chara_${charactor.id}`,
      }
    })
  }

  setBackground() {
    const field = new createjs.Bitmap(this.loaders['field']);
    field.skewX = field.width / 2;
    field.skewY = field.height / 2;
    field.scaleX = 1.5;
    field.scaleY = 1.5;
    field.y = -250;
    return field;
  }

  setCommands() {
    const command = new createjs.Container();
    const attack = new createjs.Bitmap(this.loaders['attack']);
    attack.x = 0;
    attack.y = 0;
    attack.scaleX = .5;
    attack.scaleY = .5;
    let cnt = 0;
    attack.addEventListener('click', (e) => {
      const myCurrentChara = this.orderedMyChara[cnt];
      const enemyTargetChara = this.orderedEnemyChara[cnt];
      const x = myCurrentChara.x;
      const y = myCurrentChara.y;

      createjs.Tween.get(myCurrentChara)
        .to({
          x: enemyTargetChara.x,
          y: enemyTargetChara.y
        }, 150)
        .to({
          x,
          y,
        }, 150);

      const coefficient = getRandomCoefficient(85, 115);
      const damage = Math.floor(myCurrentChara.status.ATK * coefficient / 100);
      enemyTargetChara.damage(damage);

      createjs.Tween.get(enemyTargetChara)
        .to({
          alpha: .25
        }, 200)
        .to({
          alpha: 1
        }, 50);

      console.log(enemyTargetChara.status.HP);
      
      if (enemyTargetChara.status.HP <= 0) {
        createjs.Tween.get(enemyTargetChara)
          .to({
            alpha: .05
          }, 800)
      }
      
      if (cnt < 4) {
        cnt++;
      } else {
        cnt = 0;
      }
    });
    attack.alpha = 1;
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

  setCharactors(charactors, type = 'own') {
    return charactors.map((charactor, index) => {
      const chara = new createjs.Bitmap(this.loaders[`chara_${charactor.id}`]);
      chara.status = charactor;
      const x = chara.getBounds().width / 2;
      const y = chara.getBounds().height / 2;
      chara.scaleX = .5;
      chara.scaleY = .5;
      chara.regX = x;
      chara.regY = y;
      if (type === 'enemy') {
        chara.scaleX = -.5;
        chara.regX = x + 80;
      }
      chara.x = constants[type].pos[index].x;
      chara.y = constants[type].pos[index].y;
      chara.damage = function(point) {
        chara.status.HP -= point;
      }
      return chara;
    });
  }
}


class Flow {
  constructor(own, enemy) {
    this.current = 0;
    this.chara = {
      own,
      enemy
    }
  }

  getCurrent() {
    return this.current;
  }

  turn () {
    const orderedMyChara = this.setAttackOrder(_.clone(this.chara.own))
    const orderedEnemyChara = this.setAttackOrder(_.clone(this.chara.enemy));
    return {
      orderedMyChara,
      orderedEnemyChara
    }
  }

  next() {
    this.chara.own.map()
    this.current++;
  }
  
  setAttackOrder(charactors) {
    // 幅を設定
    const min = 85;
    const max = 115;
    
    const charas = charactors.map((charactor) => {
      const coefficient = getRandomCoefficient(min, max);
      charactor.status.SP = (charactor.status.SP * coefficient) / 100;
      return charactor;
    });
  
    return  _.sortBy(charas, c => c.SP).reverse();
  }
}

function getRandomCoefficient(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min)) + min;
}




function ayncGetChara(chara) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(chara);
    }, 50);
  });
}

const MY_CHARACTOR = [
  {
    id: 8,
    name: '女１',
    MAX_HP: 50,
    HP: 50,
    ATK: 20,
    DF: 20,
    SP: 12,
  },
  {
    id: 13,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 11,
  },
  {
    id: 17,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 12,
  },
  {
    id: 14,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 14,
  },
  {
    id: 1,
    name: '男１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 15,
  }
]

const ENEMY_CHARACTOR = [
  {
    id: 2,
    name: '女１',
    MAX_HP: 50,
    HP: 50,
    ATK: 20,
    DF: 20,
    SP: 12,
  },
  {
    id: 12,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 11,
  },
  {
    id: 22,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 12,
  },
  {
    id: 19,
    name: '女１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 14,
  },
  {
    id: 3,
    name: '男１',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    DF: 30,
    SP: 15,
  }
]


export default Battle;