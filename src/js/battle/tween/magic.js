class Magic {
  constructor() {
    this.attacker = {};
    this.defenser = {};
    this.effect = {};
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

    Promise.all([this._attack(), this._damage()]).then(() => {
      if (this.defenser.status.HP <= 0) {
        createjs.Tween.get(this.defenser)
          .to({
            alpha: 0
          }, 800);
      }
    });
    
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
          console.log(1, a);
          resolve(a);
        });
    })
  }

  _effect() {
    return new Promise((resolve, reject) => {
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
        }, 200)
        .call((a) => {
          console.log(2, a);
          resolve(a);
        });
    })
  }

  _damage() {
    return new Promise((resolve, reject) => {
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
          stage.removeChild(magic);
        });
    })
  }
}

export default Magic