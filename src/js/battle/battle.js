import _ from 'lodash';
import constants from './constants';

class Battle {
  constructor() {
    this.loaders = {};
    this.commands = {
      attack: {},
      defense: {}
    };
    this.state = {
      self: {
        charactors: {},
        current: {},
      },
      enemy: {
        charactors: {},
        current: {},
      },
      order: {
        current: {},
        self: 0,
        enemy: 0,
        total: 0
      },
      turn: {
        count: 0
      },
    }
  }

  async start() {
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'forest1.jpg', id: 'field'},
    ];
    const commandManifest = [
      {src: 'command_attack.png', id: 'attack'},
      {src: 'command_magic.png', id: 'magic'},
      {src: 'command_skill.png', id: 'skill'},
      {src: 'command_skip.png', id: 'skip'},
      {src: 'command_defense.png', id: 'defense'},
      {src: 'command_magic_defense.png', id: 'magic_defense'},
      {src: 'command_counter.png', id: 'counter'},
      {src: 'command_recovery.png', id: 'recovery'},
    ];
    const magicManifest = [
      {src: 'air.png', id: 'air'},
    ];
    this.state.self.charactors = await ayncGetChara(MY_CHARACTOR);
    const myCharaManifest = this.createCharaManifest(this.state.self.charactors);
    this.state.enemy.charactors = await ayncGetChara(ENEMY_CHARACTOR);
    const enemyCharaManifest = this.createCharaManifest(this.state.enemy.charactors);
    queue.loadManifest(commandManifest, true, '/assets/images/battle/command/');
    queue.loadManifest(magicManifest, true, '/assets/images/battle/effect/magic/');
    queue.loadManifest(fieldManifest, true, '/assets/images/field/');
    queue.loadManifest(myCharaManifest, true, '/assets/images/chara/');
    queue.loadManifest(enemyCharaManifest, true, '/assets/images/chara/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }

  init() {
    const field = this.setField();
    this.commands = this.setCommands();
    this.myCharactors = this.setCharactors(this.state.self.charactors);
    this.enemyCharactors = this.setCharactors(this.state.enemy.charactors, 'enemy');
    this.Flow = new Flow(this.myCharactors, this.enemyCharactors);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", Stage);
    Stage.addChild(field, this.commands.attack, this.commands.defense, ...this.myCharactors, ...this.enemyCharactors);
    Stage.update();
    this.turn();
  }

  turn() {
    const { orderedMyChara, orderedEnemyChara, orderedAllChara} = this.Flow.turn();
    this.orderedMyChara = this.getLivingCharas(orderedMyChara);
    this.orderedEnemyChara = this.getLivingCharas(orderedEnemyChara);
    this.orderAllChara = this.getLivingCharas(orderedAllChara);
    this.switchCommand();
  }
  
  turnController() {
    if (this.state.order.total < this.orderAllChara.length - 1) {
      if (this.state.order.current.type === 'self') {
        this.state.order.self++;
      } else {
        this.state.order.enemy++;
      }
      this.state.order.total++;
      this.switchCommand();
    } else {
      this.state.order.self = 0;
      this.state.order.enemy = 0;
      this.state.order.total = 0;
      this.state.turn.count++;
      this.turn();
    }
  }

  switchCommand() {
    this.state.order.current = this.orderAllChara[this.state.order.total];
    if (0 < this.state.order.current.status.HP) {
      if (this.state.order.current.type === 'self') {
        this.state.self.current = this.state.order.current;
        this.state.enemy.current = this.getRandomChara(this.orderedEnemyChara);
        this.commands.attack.y = window.innerHeight - 200;
        this.commands.defense.y = window.innerHeight;
        this.setCurrentMark(this.state.self.current, this.state.enemy.current);
      } else {
        this.state.enemy.current = this.state.order.current;
        this.state.self.current = this.getRandomChara(this.orderedMyChara);
        this.commands.attack.y = window.innerHeight;
        this.commands.defense.y = window.innerHeight - 200;
        this.setCurrentMark(this.state.enemy.current, this.state.self.current);
      }
    } else {
      this.resetCurrentMark();
      this.turnController();
    }
  }

  setCurrentMark(attcker, defenser) {
    this.resetCurrentMark();
    attcker.filters = [
      new createjs.ColorFilter(0.7, 0.7, 0.7, 1, 90, 90, 90, 0)
    ];
    attcker.cache(0, 0, 200, 200);
    defenser.filters = [
      new createjs.ColorFilter(0.7, 0.7, 0.7, 1, 60, 60, 0, 0)
    ];
    defenser.cache(0, 0, 200, 200);
    Stage.addChild(attcker, defenser);
    Stage.update();
  }

  resetCurrentMark() {
    const resetAllChara =  this.orderAllChara.map((charactor) => {
      charactor.filters = [];
      charactor.cache(0, 0, 200, 200);
      return charactor;
    })
  }

  createCharaManifest(charactors) {
    return charactors.map((charactor) => {
      return {
        src: `chara_${charactor.id}.png`,
        id: `chara_${charactor.id}`,
      }
    })
  }

  setMagicEffect() {
    const air = new createjs.Bitmap(this.loaders['air']);
    air.skewX = air.width / 2;
    air.skewY = air.height / 2;
    air.scaleX = 0.5;
    air.scaleY = 0.5;
    air.x = -10;
    air.y = 60;
    air.alpha = 0;
    return air;
  }

  setField() {
    const field = new createjs.Bitmap(this.loaders['field']);
    field.skewX = field.width / 2;
    field.skewY = field.height / 2;
    field.scaleX = 1.5;
    field.scaleY = 1.5;
    field.y = -250;
    return field;
  }

  attackTween(mainCharactor, targetCharactor) {
    const x = mainCharactor.x;
    const y = mainCharactor.y;
    let rotate = 20;
    let offsetY = -10;
    let offsetX = 10;
    if (mainCharactor.type === 'enemy') {
      rotate = -20;
      offsetY = 0;
      offsetX = -10;
    }

    createjs.Tween.get(mainCharactor)
      .to({
        x: targetCharactor.x,
        y: targetCharactor.y
      }, 150)
      .to({
        x,
        y,
      }, 150);
    
    createjs.Tween.get(targetCharactor)
      .to({
        y: targetCharactor.y + offsetY,
        x: targetCharactor.x + offsetX,
        rotation: rotate,
        alpha: .25
      }, 200)
      .to({
        y: targetCharactor.y,
        x: targetCharactor.x,
        rotation: 0,
        alpha: 1
      }, 200)
      .call(() => {
        if (targetCharactor.status.HP <= 0) {
          createjs.Tween.get(targetCharactor)
            .to({
              alpha: 0
            }, 800);
        }
      });;
  }

  magicTween(mainCharactor, targetCharactor) {
    const x = mainCharactor.x;
    const y = mainCharactor.y;
    const magic = this.setMagicEffect();
    Stage.addChild(magic);
    Stage.update();

    createjs.Tween.get(mainCharactor)
      .to({
        x: mainCharactor.x + 40
      }, 100)
      .to({
        x,
      }, 100);
      
    createjs.Tween.get(magic)
      .to({
        alpha: 0.15,
        x: magic.x + 10
      }, 200)
      .to({
        alpha: 0.25,
        x: magic.x
      }, 1000)
      .to({
        alpha: 0,
        x: magic.x + 15
      }, 200);
      
    createjs.Tween.get(targetCharactor)
      .to({
        alpha: .5,
      }, 100)
      .to({
        y: targetCharactor.y - 10,
        x: targetCharactor.x + 10,
        rotation: 20,
        alpha: .5
      }, 100)
      .to({
        alpha: .5
      }, 500)
      .to({
        alpha: .5
      }, 500)
      .to({
        alpha: 1,
      }, 300)
      .to({
        y: targetCharactor.y,
        x: targetCharactor.x,
        rotation: 0
      }, 100)
      .call(() => {
        if (targetCharactor.status.HP <= 0) {
          createjs.Tween.get(targetCharactor)
            .to({
              alpha: 0
            }, 800);
        }
        Stage.removeChild(magic);
      });
    
  }

  attackHandler() {
    const mainCharactor = this.state.order.current;
    const targetCharactor = this.state.enemy.current;
    // ダメージの計算
    const coefficient = random(85, 115);
    const damage = Math.floor(mainCharactor.status.ATK * coefficient / 100);
    const damageText = new createjs.Text(damage, "18px serif", "white");
    targetCharactor.damage(damage);
    damageText.x = targetCharactor.x + 22;
    damageText.y = targetCharactor.y + 22;
    Stage.setChildIndex(damageText, 1);
    Stage.addChild(damageText);
    Stage.update();
    createjs.Tween.get(damageText)
      .to({
        y: damageText.y - 10,
        alpha: 1
      }, 400)
      .to({
        y: damageText.y,
        alpha: 1
      }, 400)
      .to({
        y: damageText.y,
        alpha: 0
      }, 200)
      .call(() => {
        Stage.removeChild(damageText);
        Stage.update();
      });

    this.attackTween(mainCharactor, targetCharactor);

    if (this.getLivingCharas(this.orderedEnemyChara).length === 0) {
      console.log('敵を倒した')
    } else {
      this.turnController();
    }    
  }

  magicHandler() {
    const mainCharactor = this.state.order.current;
    const targetCharactors = this.orderedEnemyChara;
    // ダメージの計算
    targetCharactors.forEach((charactor) => {
      const coefficient = random(85, 115);
      const damage = Math.floor(mainCharactor.status.ATK * coefficient / 100);
      console.log(charactor);
      charactor.damage(damage);
      this.magicTween(mainCharactor, charactor);
    })
    console.log(targetCharactors);
    if (this.getLivingCharas(this.orderedEnemyChara).length === 0) {
      console.log('敵を倒した')
    } else {
      this.turnController();
    }    
  }

  defenseHandler() {
    const mainCharactor = this.state.order.current;
    const targetCharactor = this.state.self.current;
    if (targetCharactor.status.HP <= 0) return;

    // ダメージの計算
    const coefficient = random(85, 115);
    const damage = Math.floor(targetCharactor.status.ATK * coefficient / 100);
    targetCharactor.damage(damage);
    
    this.attackTween(mainCharactor, targetCharactor);

    if (this.getLivingCharas(this.orderedMyChara).length === 0) {
      console.log('全滅した')
    } else {
      this.turnController();
    }
  }

  getRandomChara(charactors) {
    const charas = this.getLivingCharas(charactors);
    const cnt = random(0, charas.length - 1);
    return charas[cnt];
  }

  getLivingCharas(charas) {
    return charas.filter((chara) =>  0 < chara.status.HP);
  }

  setCommands() {
    const attackCommand = new createjs.Container();
    const attack = new createjs.Bitmap(this.loaders['attack']);
    attack.x = 0;
    attack.y = 0;
    attack.scaleX = .5;
    attack.scaleY = .5;
    attack.alpha = 1;
    attack.cursor = "pointer";
    attack.addEventListener('click', this.attackHandler.bind(this));
    const magic = new createjs.Bitmap(this.loaders['magic']);
    magic.x = window.innerWidth / 2;
    magic.y = 0;
    magic.scaleX = .5;
    magic.scaleY = .5;
    magic.addEventListener('click', this.magicHandler.bind(this));
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
     
    attackCommand.addChild(attack, magic, skill, skip);
    attackCommand.y = window.innerHeight - 200;


    const defenseCommand = new createjs.Container();
    const defense = new createjs.Bitmap(this.loaders['defense']);
    defense.x = 0;
    defense.y = 0;
    defense.scaleX = .5;
    defense.scaleY = .5;
    defense.alpha = 1;
    defense.cursor = "pointer";
    defense.addEventListener('click', this.defenseHandler.bind(this));
    const magicDefense = new createjs.Bitmap(this.loaders['magic_defense']);
    magicDefense.x = window.innerWidth / 2;
    magicDefense.y = 0;
    magicDefense.scaleX = .5;
    magicDefense.scaleY = .5;
    const counter = new createjs.Bitmap(this.loaders['counter']);
    counter.x = 0;
    counter.y = 100;
    counter.scaleX = .5;
    counter.scaleY = .5;
    const recovery = new createjs.Bitmap(this.loaders['recovery']);
    recovery.x = window.innerWidth / 2;
    recovery.y = 100;
    recovery.scaleX = .5;
    recovery.scaleY = .5;
     
    defenseCommand.addChild(defense, magicDefense, counter, recovery);
    defenseCommand.y = window.innerHeight - 100;

    return {
      attack: attackCommand,
      defense: defenseCommand
    };
  }

  setCharactors(charactors, type = 'self') {
    return charactors.map((charactor, index) => {
      const chara = new createjs.Bitmap(this.loaders[`chara_${charactor.id}`]);
      const x = chara.getBounds().width / 2;
      const y = chara.getBounds().height / 2;
      chara.status = charactor;
      chara.type = type;
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
  constructor(self, enemy) {
    this.current = 0;
    this.chara = {
      self,
      enemy
    }
  }

  getCurrent() {
    return this.current;
  }

  turn () {
    const orderedMyChara = this.setAttackOrder(_.clone(this.chara.self));
    const orderedEnemyChara = this.setAttackOrder(_.clone(this.chara.enemy));
    return {
      orderedMyChara,
      orderedEnemyChara,
      orderedAllChara: _.sortBy([...orderedMyChara, ...orderedEnemyChara], c => c.status.SP).reverse()
    }
  }

  next() {
    this.chara.self.map()
    this.current++;
  }
  
  setAttackOrder(charactors) {
    // 幅を設定
    const min = 85;
    const max = 115;
    
    const charas = charactors.map((charactor) => {
      const coefficient = random(min, max);
      charactor.status.SP = (charactor.status.SP * coefficient) / 100;
      return charactor;
    });
  
    return  _.sortBy(charas, c => c.status.SP).reverse();
  }
}

function random(min = 0, max = 100) {
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