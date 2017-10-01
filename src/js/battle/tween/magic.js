class Magic {
  constructor(magic) {
    this.queue = new createjs.LoadQueue();
    this.attacker = {};
    this.defenser = {};
    this.effect = {};
    this.magic = magic;
  }

  setMagicEffect(type) {
    const air = new createjs.Bitmap(this.magic);
    air.skewX = air.width / 2;
    air.skewY = air.height / 2;
    air.scaleX = 0.5;
    air.scaleY = 0.5;
    air.x = -240;
    air.y = 60;
    if (type === 'self') {
      air.x = -10;
      air.y = 60;
    }
    air.alpha = 0;
    return air;
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
          alpha: 0.15,
          x: this.effect.x + 10
        }, 200)
        .to({
          alpha: 0.25,
          x: this.effect.x
        }, 1000)
        .to({
          alpha: 0,
          x: this.effect.x + 15
        }, 200)
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
}

export default Magic
