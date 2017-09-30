class Magic {
  constructor() {
    this.queue = new createjs.LoadQueue();
    this.attacker = {};
    this.defenser = {};
    this.effect = {};
    this.loaders = [];
    this.magicManifest = [
      {src: 'air.png', id: 'air'},
    ];
    this.queue.loadManifest(this.magicManifest, true, '/assets/images/battle/effect/magic/')
    this.queue.addEventListener('fileload', (e) => {
      console.log(e);
      this.loaders[e.item.id] = e.result
    });
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

  tween(attacker, defenser, complete = () => {}) {
    this.attacker = attacker;
    this.defenser = defenser;
    this.effect = this.setMagicEffect();
    stage.addChild(this.effect);
    stage.update();

    return new Promise((resolve, reject) => {
      Promise.all([this._start(), this._effect(), this._damage()]).then(() => {
        if (this.defenser.status.HP <= 0) {
          createjs.Tween.get(this.defenser)
            .to({
              alpha: 0
            }, 800)
            .call(() => {
              resolve(false);
            });
        } else {
          resolve(true);
        }
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
        .call((a) => {
          resolve(a);
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
        .call((a) => {
          resolve(a);
        });
    })
  }

  _damage() {
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.defenser)
        .to({
          alpha: .5,
        }, 100)
        .to({
          y: this.defenser.y - 10,
          x: this.defenser.x + 10,
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
          y: this.defenser.y,
          x: this.defenser.x,
          rotation: 0
        }, 100)
        .call(() => {
          if (this.defenser.status.HP <= 0) {
            createjs.Tween.get(this.defenser)
              .to({
                alpha: 0
              }, 800);
          }
          resolve();
          stage.removeChild(this.effect);
        });
    })
  }
}

export default Magic