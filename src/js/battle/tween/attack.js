class Attack {
  constructor() {
    this.attacker = {}
    this.defenser = {}
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

    return new Promise((resolve, reject) => {
      Promise.all([this._attack(), this._damage()]).then(() => {
        if (this.defenser.status.HP <= 0) {
          createjs.Tween.get(this.defenser)
            .to({
              alpha: 0
            }, 800);
        }
        complete();
        resolve();
      });
    })
  }
  
  _attack() {
    const x = this.attacker.x;
    let moveX = 40
    if (this.attacker.type === 'enemy') {
      moveX = -40
    }
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.attacker)
        .to({
          x: this.attacker.x + moveX
        }, 150)
        .to({
          x,
        }, 150)
        .call(() => {
          resolve();
        });
    })
  }
    
  _damage() {
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.defenser)
        .to({
          y: this.defenser.y + this.defenser.offsetY,
          x: this.defenser.x + this.defenser.offsetX,
          rotation: this.defenser.rotate,
          alpha: .25
        }, 200)
        .to({
          y: this.defenser.y,
          x: this.defenser.x,
          rotation: 0,
          alpha: 1
        }, 200)
        .call(() => {
          resolve();
        });
    })
  }
}

export default Attack