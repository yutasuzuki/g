class Magic {
  constructor(magic) {
    this.queue = new createjs.LoadQueue();
    this.attacker = {};
    this.defenser = {};
    this.effect = {};
    this.magic = magic;
  }

  setMagicEffect(type) {
    const data = {
      images: ['./assets/images/battle/effect/magic/air.png'],
      frames: {width: 96, height: 256, regX: 0, regY: 0},
      animations: {
        walk: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        },
        stop: {
          frames: [0],
        }
      },
      framerate: 15
    };
    
    const spritesheet = new createjs.SpriteSheet(data);
    const sprite = new createjs.Sprite(spritesheet, 0);
    sprite.x = 48;
    sprite.y = 128 + 40;
    if (type === 'self') {
      sprite.x = window.innerWidth - 48;
    }
    sprite.regX = 96 / 2;
    sprite.regY = 256 / 2;

    return sprite;
  }

  tween(attacker, defenser, complete = () => {}) {
    this.attacker = attacker;
    this.defenser = defenser;
    this.defenser.rotate = 20;
    this.defenser.offsetY = -10;
    this.defenser.offsetX = 10;

    if (this.attacker.type === 'enemy') {
      this.defenser.rotate = -20;
      this.defenser.offsetY = 0;
      this.defenser.offsetX = -10;
    }

    this.effect = this.setMagicEffect(attacker.type);
    stage.addChild(this.effect);
    stage.update();

    return new Promise((resolve, reject) => {
      Promise.all([this._start(), this._effect(), this._damage()]).then(() => {
        if (this.defenser.status.HP <= 0) {
          createjs.Tween.get(this.defenser)
            .to({
              alpha: 0
            }, 800);
        }
        resolve();
      });
    })
  }
  
  _start() {
    const x = this.attacker.x;
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.attacker)
        .to({
          x: this.attacker.x + 40
        }, 100)
        .to({
          x,
        }, 100)
        .call(() => {
          resolve();
        });
    })
  }

  _effect() {
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.effect)
        .to({
          scaleX: 1,
          scaleY: 1
        }, 500)
        .to({}, 300)
        .to({
          scaleX: 1.25,
          scaleY: 1.25,
          alpha: 0
        }, 300)
        .call(() => {
          resolve();
        });
    })
  }

  _damage() {
    if (this.defenser.type) {

    }
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.defenser)
        .to({
          alpha: .5,
        }, 100)
        .to({
          y: this.defenser.y + this.defenser.offsetY,
          x: this.defenser.x + this.defenser.offsetX,
          rotation: this.defenser.rotate,
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
          y: this.defenser.y,
          x: this.defenser.x,
          rotation: 0
        }, 100)
        .call(() => {
          stage.removeChild(this.effect);
          resolve();
        });
    })
  }

  reflect(attacker) {
    console.log('attacker : ', attacker.status.name);
    const reflect = new createjs.Bitmap(this.magic);
    reflect.skewX = reflect.width / 2;
    reflect.skewY = reflect.height / 2;
    reflect.scaleX = 0.2;
    reflect.scaleY = 0.2;
    reflect.x = attacker.x - 50;
    reflect.y = attacker.y - 50;
    if (attacker.type === 'enemy') {
      reflect.x = attacker.x - 50;
    }
    reflect.alpha = 0;

    stage.addChild(reflect);
    stage.update();

    return new Promise((resolve, reject) => {
      createjs.Tween.get(reflect)
      .to({
        alpha: 0.15,
      }, 200)
      .to({
        alpha: 0.75,
      }, 300)
      .to({
        alpha: 0,
      }, 200)
      .call(() => {
        stage.removeChild(reflect);
        stage.update();
        resolve();
      });
    });
  }
}

export default Magic



// class Magic {
//   constructor(magic) {
//     this.queue = new createjs.LoadQueue();
//     this.attacker = {};
//     this.defenser = {};
//     this.effect = {};
//     this.magic = magic;
//   }

//   setMagicEffect(type) {
//     const air = new createjs.Bitmap(this.magic);
//     air.skewX = air.width / 2;
//     air.skewY = air.height / 2;
//     air.scaleX = 0.5;
//     air.scaleY = 0.5;
//     air.x = -240;
//     air.y = 60;
//     if (type === 'self') {
//       air.x = -10;
//       air.y = 60;
//     }
//     air.alpha = 0;
//     return air;
//   }

//   tween(attacker, defenser, complete = () => {}) {
//     this.attacker = attacker;
//     this.defenser = defenser;
//     this.defenser.rotate = 20;
//     this.defenser.offsetY = -10;
//     this.defenser.offsetX = 10;

//     if (this.attacker.type === 'enemy') {
//       this.defenser.rotate = -20;
//       this.defenser.offsetY = 0;
//       this.defenser.offsetX = -10;
//     }

//     this.effect = this.setMagicEffect(attacker.type);
//     stage.addChild(this.effect);
//     stage.update();

//     return new Promise((resolve, reject) => {
//       Promise.all([this._start(), this._effect(), this._damage()]).then(() => {
//         if (this.defenser.status.HP <= 0) {
//           createjs.Tween.get(this.defenser)
//             .to({
//               alpha: 0
//             }, 800);
//         }
//         resolve();
//       });
//     })
//   }
  
//   _start() {
//     const x = this.attacker.x;
//     return new Promise((resolve, reject) => {
//       createjs.Tween.get(this.attacker)
//         .to({
//           x: this.attacker.x + 40
//         }, 100)
//         .to({
//           x,
//         }, 100)
//         .call(() => {
//           resolve();
//         });
//     })
//   }

//   _effect() {
//     return new Promise((resolve, reject) => {
//       createjs.Tween.get(this.effect)
//         .to({
//           alpha: 0.15,
//           x: this.effect.x + 10
//         }, 200)
//         .to({
//           alpha: 0.25,
//           x: this.effect.x
//         }, 1000)
//         .to({
//           alpha: 0,
//           x: this.effect.x + 15
//         }, 200)
//         .call(() => {
//           resolve();
//         });
//     })
//   }

//   _damage() {
//     if (this.defenser.type) {

//     }
//     return new Promise((resolve, reject) => {
//       createjs.Tween.get(this.defenser)
//         .to({
//           alpha: .5,
//         }, 100)
//         .to({
//           y: this.defenser.y + this.defenser.offsetY,
//           x: this.defenser.x + this.defenser.offsetX,
//           rotation: this.defenser.rotate,
//           alpha: .5
//         }, 100)
//         .to({
//           alpha: .5
//         }, 500)
//         .to({
//           alpha: .5
//         }, 500)
//         .to({
//           alpha: 1,
//         }, 300)
//         .to({
//           y: this.defenser.y,
//           x: this.defenser.x,
//           rotation: 0
//         }, 100)
//         .call(() => {
//           stage.removeChild(this.effect);
//           resolve();
//         });
//     })
//   }

//   reflect(attacker) {
//     console.log('attacker : ', attacker.status.name);
//     const reflect = new createjs.Bitmap(this.magic);
//     reflect.skewX = reflect.width / 2;
//     reflect.skewY = reflect.height / 2;
//     reflect.scaleX = 0.2;
//     reflect.scaleY = 0.2;
//     reflect.x = attacker.x - 50;
//     reflect.y = attacker.y - 50;
//     if (attacker.type === 'enemy') {
//       reflect.x = attacker.x - 50;
//     }
//     reflect.alpha = 0;

//     stage.addChild(reflect);
//     stage.update();

//     return new Promise((resolve, reject) => {
//       createjs.Tween.get(reflect)
//       .to({
//         alpha: 0.15,
//       }, 200)
//       .to({
//         alpha: 0.75,
//       }, 300)
//       .to({
//         alpha: 0,
//       }, 200)
//       .call(() => {
//         stage.removeChild(reflect);
//         stage.update();
//         resolve();
//       });
//     });
//   }
// }

// export default Magic
