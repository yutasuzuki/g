import _ from 'lodash';
import axios from 'axios';
import constants from './constants';
import Attack from './tween/attack';
import Magic from './tween/magic';
import Damage from './tween/damage';
import { random } from '../util';

const attack = new Attack();
const magic = {};
const damege = new Damage();

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
        count: 0,
        finish: true
      },
      battle: {
        finish: false
      }
    }
    console.log('battle!');
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
      {src: 'reflect.png', id: 'reflect'},
    ];
    const resultManifest = [
      {src: 'btn_back.png', id: 'btn_back'}
    ];
    this.state.self.charactors = MY_CHARACTOR;
    const myCharaManifest = this.createCharaManifest(this.state.self.charactors);
    this.state.enemy.charactors = await ayncGetChara(this.createEnemiesID());
    const enemyCharaManifest = this.createCharaManifest(this.state.enemy.charactors);
    queue.loadManifest(commandManifest, true, '/assets/images/battle/command/');
    queue.loadManifest(resultManifest, true, '/assets/images/battle/result/');
    queue.loadManifest(fieldManifest, true, '/assets/images/field/');
    queue.loadManifest(myCharaManifest, true, '/assets/images/chara/');
    queue.loadManifest(enemyCharaManifest, true, '/assets/images/chara/');
    queue.loadManifest(magicManifest, true, '/assets/images/battle/effect/magic/')
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.init());
  }
  
  createCharaManifest(charactors) {
    return charactors.map((charactor) => {
      return {
        src: `chara_${charactor.id}.png`,
        id: `chara_${charactor.id}`,
      }
    })
  }

  init() {
    this.field = this.setField();
    this.commands = this.setCommands();
    this.myCharactors = this.setCharactors(this.state.self.charactors);
    this.enemyCharactors = this.setCharactors(this.state.enemy.charactors, 'enemy');
    this.Flow = new Flow(this.myCharactors, this.enemyCharactors);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);
    stage.addChild(this.field, this.commands.attack, this.commands.defense, ...this.myCharactors, ...this.enemyCharactors);
    stage.update();
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
    this.state.turn.finish = true;
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
    if (!attcker || !defenser) return
    attcker.filters = [
      new createjs.ColorFilter(0.7, 0.7, 0.7, 1, 90, 90, 90, 0)
    ];
    attcker.cache(0, 0, 200, 200);
    defenser.filters = [
      new createjs.ColorFilter(0.7, 0.7, 0.7, 1, 60, 60, 0, 0)
    ];
    defenser.cache(0, 0, 200, 200);
    stage.setChildIndex(attcker, -1);
    stage.setChildIndex(defenser, -1);
    stage.addChild(attcker, defenser);
    stage.update();
  }

  resetCurrentMark() {
    const resetAllChara =  this.orderAllChara.map((charactor) => {
      charactor.filters = [];
      charactor.cache(0, 0, 200, 200);
      return charactor;
    })
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

  // アニメーション中はコマンドが選択できないようにする判定
  isCommandDisable() {
    let bool = false;
    if (!this.state.turn.finish || this.state.battle.finish) {
      bool = true;
    }
    return bool;
  }

  // 通常攻撃を選択
  attackHandler() {
    if (this.isCommandDisable()) return;
    this.state.turn.finish = false;

    const attacker = this.state.order.current;
    const diffencer = this.state.enemy.current;
    const commandType = this.choiceEnemyCommandType(diffencer);
    console.log(' - - - - - - - - - - - -');
    console.log('自分の選択(攻撃): ', 'ATK');
    console.log(`${diffencer.status.name}の選択(防御): `, commandType);
    console.log(' - - - - - - - - - - - -');
    const damagePoint = this.calcAttackDamage(commandType, attacker, diffencer);
    diffencer.damage(damagePoint);
    damege.tween(damagePoint, diffencer);

    attack.tween(attacker, diffencer).then(() => {
      this.decideBattlePhase(this.orderedEnemyChara);
    });
  }

  // 魔法攻撃を選択
  magicHandler() {
    if (this.isCommandDisable()) return;
    this.state.turn.finish = false;
    const attacker = this.state.order.current;
    const diffencers = this.orderedEnemyChara;
    const commandType = this.choiceEnemyCommandType(this.state.enemy.current);
    console.log(' - - - - - - - - - - - -');
    console.log('自分の選択(攻撃): ', 'MGC');
    console.log(`${this.state.enemy.current.status.name}の選択(防御): `, commandType);
    console.log(' - - - - - - - - - - - -');
    // ダメージの計算
    if (commandType !== 'MGC') {
      const magicPromises = [];
      diffencers.forEach((diffencer) => {
        if (0 < diffencer.status.HP) {
          const damage = this.calcMagicDamage(commandType, attacker, diffencer);
          diffencer.damage(damage);
          damege.tween(damage, diffencer);
          const magic = new Magic(this.loaders['air']);
          const magicPromise = magic.tween(attacker, diffencer);
          magicPromises.push(magicPromise);
        }
      });
      Promise.race(magicPromises).then(() => {
        this.decideBattlePhase(diffencers);
      }).catch((e) => {
        console.log(e);
      });
    } else {
      this.reflectMagic(this.state.enemy.current, this.state.self.current, this.orderedMyChara);
    }
  }

  // 敵の攻撃
  enemyAttack(diffenceType, attacker) {
    const commandType = this.choiceEnemyCommandType(attacker);
    console.log(' - - - - - - - - - - - -');
    console.log('自分の選択(防御): ', diffenceType);
    console.log(`${attacker.status.name}の選択(攻撃): `, commandType);
    console.log(' - - - - - - - - - - - -');
    if (commandType === 'ATK') {
      const diffencer = this.state.self.current;
      const damagePoint = this.calcAttackDamage(diffenceType, attacker, diffencer);
      diffencer.damage(damagePoint);
      damege.tween(damagePoint, diffencer);

      attack.tween(attacker, diffencer).then(() => {
        this.decideBattlePhase(this.orderedMyChara);
      });
    } else if (commandType === 'MGC') {
      if (diffenceType !== commandType) {
        const diffencers = this.orderedMyChara;
        const magicPromises = [];
        diffencers.forEach((diffencer) => {
          if (0 < diffencer.status.HP) {
            const damage = this.calcMagicDamage(diffenceType, attacker, diffencer);
            diffencer.damage(damage);
            damege.tween(damage, diffencer);
            const magic = new Magic(this.loaders['air']);
            const magicPromise = magic.tween(attacker, diffencer);
            magicPromises.push(magicPromise);
          }
        });
        Promise.race(magicPromises).then(() => {
          this.decideBattlePhase(this.orderedMyChara);
        }).catch((e) => {
          console.log(e);
        });
      } else {
        const attacker = this.state.self.current;
        const targetDiffencer = this.state.self.current;
        this.reflectMagic(attacker, targetDiffencer, this.orderedEnemyChara);
      }
    } else if (commandType === 'SP') {
      console.log('敵のSP');
      this.decideBattlePhase(this.orderedMyChara);
    } else if (commandType === 'SKIP') {
      console.log('敵がSKIP');
      this.decideBattlePhase(this.orderedMyChara);
    }
  }
  
  // 魔法防御が成功した時
  async reflectMagic(attacker, targetDiffencer, diffencers) {
    const commandType = 'REFLECT';
    console.log('- - - - 魔法を反射 - - - -');
    console.log('自分の選択(攻撃): ', 'MGC');
    console.log(`${this.state.enemy.current.status.name}の選択(防御): `, commandType);
    console.log(' - - - - - - - - - - - -');

    const m = new Magic(this.loaders['reflect']);

    await m.reflect(attacker);

    // ダメージの計算
    const magicPromises = [];
    diffencers.forEach((diffencer) => {
      if (0 < diffencer.status.HP) {
        const damage = this.calcMagicDamage(commandType, attacker, diffencer);
        console.log(`${diffencer.status.name}のダメージ`,damage);
        diffencer.damage(damage);
        damege.tween(damage, diffencer);
        const magic = new Magic(this.loaders['air']);
        const magicPromise = magic.tween(attacker, diffencer);
        magicPromises.push(magicPromise);
      }
    });
    Promise.race(magicPromises).then(() => {
      this.decideBattlePhase(diffencers);
    }).catch((e) => {
      console.log(e);
    });
  }

  // 防御
  defenseHandler() {
    if (this.isCommandDisable()) return;
    this.state.turn.finish = false;
    const diffencer = this.state.self.current;
    const attacker = this.state.order.current;
    if (diffencer.status.HP <= 0) return;

    this.enemyAttack('ATK', attacker);
  }

  // 魔法防御
  magicDefenseHandler() {
    if (this.isCommandDisable()) return;
    this.state.turn.finish = false;
    const attacker = this.state.enemy.current;
    const commandType = this.choiceEnemyCommandType(attacker);
    this.enemyAttack('MGC', attacker);
  }

  // 敵を倒したか、全滅したかの判定
  decideBattlePhase(charactors) {
    const msg = charactors[0].type === 'self'? '全滅した': '敵を倒した';
    if (this.getLivingCharas(charactors).length === 0) {
      this.state.battle.finish = true;
      console.log(msg);
      setTimeout(() => {
        this.showResult();
      }, 1200);
    } else {
      this.turnController();
    }
  } 

  showResult() {
    const result = new createjs.Container();
    const bg = new createjs.Shape();
    bg.graphics.beginFill('rgba(0, 0, 0, 0.5)');   
    bg.graphics.rect(0,0, window.innerWidth, window.innerHeight);

    const btnBack = new createjs.Bitmap(this.loaders['btn_back']);
    btnBack.x = window.innerWidth / 2 - btnBack.getBounds().width / 4;;
    btnBack.y = window.innerHeight - btnBack.getBounds().height + 30;
    btnBack.scaleX = 0.5;
    btnBack.scaleY = 0.5;
    btnBack.alpha = 1;
    btnBack.addEventListener('click', () => {
      route.to('map');
      this.destroy();
    })

    result.addChild(bg, btnBack);
    stage.addChild(result);
    stage.update();
  }

  getRandomChara(charactors) {
    const charas = this.getLivingCharas(charactors);
    const cnt = random(0, charas.length - 1);
    return charas[cnt];
  }

  getLivingCharas(charas) {
    return charas.filter((chara) =>  0 < chara.status.HP);
  }

  // 攻撃用のコマンドと防御用のコマンドをセット
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
    magicDefense.addEventListener('click', this.magicDefenseHandler.bind(this));
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

  // 敵が何を選択するのか決める関数
  choiceEnemyCommandType(chara) {
    const rates = chara.status.choice.rate;
    const rateArray = _.map(rates, (value, key) => value);
    const rateTotal = rateArray.reduce((a, b) => a += b);
    const choiceKey = random(0, rateTotal);

    if (0 < choiceKey && choiceKey < this.sumLimit(rateArray, 0)) {
      return 'ATK'
    } else if(this.sumLimit(rateArray, 0) < choiceKey && choiceKey < this.sumLimit(rateArray, 1)) {
      return 'MGC'
    } else if (this.sumLimit(rateArray, 1) < choiceKey && choiceKey < this.sumLimit(rateArray, 2)) {
      return 'SP'
    } else if (this.sumLimit(rateArray, 2) < choiceKey && choiceKey < this.sumLimit(rateArray, 3)) {
      return 'SKIP'
    } else {
      return 'SKIP'
    }
  }
  
  // 攻撃の計算ロジック（適当）
  calcAttackDamage(type, attacker, diffencer) {
    const coefficient = random(85, 115);
    const damage = Math.floor(attacker.status.ATK * coefficient / 100);
  
    let df = 0;
    switch (type) {
      case 'ATK':
        df = diffencer.status.DF * 0.15;
        return Math.floor(damage * 0.5 - df);
        break;
      case 'MGC':
        df = diffencer.status.DF * 0.20;
        return Math.floor(damage * 1.25 - df);
        break;
      case 'SP':
        df = diffencer.status.DF * 0.05;
        return Math.floor(damage - df);
        break;
      case 'SKIP':
        df = diffencer.status.DF * 0.1;
        return Math.floor(damage - df);
        break;
      default:
        break;
    }
  }
  
  // 魔法攻撃の計算ロジック（適当）
  calcMagicDamage(type, attacker, diffencer) {
    const coefficient = random(85, 115);
    const damage = Math.floor(attacker.status.MGC * coefficient / 100);

    let df = 0;
    let dmg = 0;
    switch (type) {
      case 'ATK':
        df = diffencer.status.DF * 0.1;
        dmg = Math.floor(damage * 0.5 - df);
        return 0 < dmg ? dmg : 1;
        break;
      case 'MGC':
        df = diffencer.status.DF * 0.3;
        dmg = Math.floor(damage * 0.5 - df);
        return 0 < dmg ? dmg : 1;
        break;
      case 'SP':
        df = diffencer.status.DF * 0.075;
        dmg = Math.floor(damage * 0.5 - df);
        return 0 < dmg ? dmg : 1;
        break;
      case 'SKIP':
        df = diffencer.status.DF * 0.05;
        dmg = Math.floor(damage * 0.5 - df);
        return 0 < dmg ? dmg : 1;
        break;
      case 'REFLECT':
        df = diffencer.status.DF * 0.05;
        dmg = Math.floor(damage * 0.75 - df);
        return 0 < dmg ? dmg : 1;
      default:
        break;
    }
  }

  sumLimit(array, x) {
    let value = 0;
    for (let i = 0; i <= x; i++) {
      value += array[i];
    }
    return value;
  }

  createEnemiesID() {
    const len = random(1, 5);
    let items = []
    for (let i = 0; i < len; i++) {
      items.push(random(1, 24));
    }
    return items;
  }

  setCharactors(charactors, type = 'self') {
    return charactors.map((charactor, index) => {
      const container = new createjs.Container();
      const chara = new createjs.Bitmap(this.loaders[`chara_${charactor.id}`]);
      const x = chara.getBounds().width / 2;
      const y = chara.getBounds().height / 2;
      chara.status = charactor;
      chara.type = type;
      chara.scaleX = 0.5;
      chara.scaleY = 0.5;
      chara.regX = x;
      chara.regY = y;
      if (type === 'enemy') {
        chara.scaleX = - 0.5;
        chara.regX = x + 80;
      }
      chara.x = constants[type].pos[index].x;
      chara.y = constants[type].pos[index].y;
      chara.damage = function(point) {
        chara.status.HP -= point;
      }
      container.addChild(chara);
      return chara;
    });
  }

  win() {

  }

  loose() {

  }

  destroy() {
    stage.removeChild(this.field, this.commands.attack, this.commands.defense, ...this.myCharactors, ...this.enemyCharactors);
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


// 本当はDBから取得するけど、今はjsonファイルから取得するように
function ayncGetChara(charactorsID) {

  return new Promise((resolve, reject) => {
    let charactors = charactorsID.map((value) => {
      return axios.get(`/assets/data/enemy/${value}.json`);
    });
    Promise.all(charactors).then((charas) => {
      const c = charas.map(chara => chara.data);
      resolve(c);
    })
  });
}

const MY_CHARACTOR = [
  {
    id: 8,
    name: 'ルシェ',
    MAX_HP: 50,
    HP: 50,
    ATK: 20,
    MGC: 30,
    DF: 25,
    SP: 20,
    choice: {
      rate: {
        ATK: 20,
        MGC: 50,
        SP: 40,
        OTHER: 10
      }
    }
  },
  {
    id: 13,
    name: '天穂',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    MGC: 18,
    DF: 22,
    SP: 32,
    choice: {
      rate: {
        ATK: 50,
        MGC: 10,
        SP: 30,
        OTHER: 10
      }
    }
  },
  {
    id: 17,
    name: 'ベルナドット',
    MAX_HP: 48,
    HP: 48,
    ATK: 14,
    MGC: 22,
    DF: 25,
    SP: 12,
    choice: {
      rate: {
        ATK: 30,
        MGC: 10,
        SP: 30,
        OTHER: 30
      }
    }
  },
  {
    id: 14,
    name: 'ネマーニャ',
    MAX_HP: 42,
    HP: 42,
    ATK: 12,
    MGC: 25,
    DF: 25,
    SP: 16,
    choice: {
      rate: {
        ATK: 10,
        MGC: 40,
        SP: 20,
        OTHER: 30
      }
    }
  },
  {
    id: 1,
    name: 'カフ',
    MAX_HP: 55,
    HP: 55,
    ATK: 16,
    MGC: 10,
    DF: 40,
    SP: 15,
    choice: {
      rate: {
        ATK: 10,
        MGC: 40,
        SP: 20,
        OTHER: 30
      }
    }
  }
]

export default Battle;