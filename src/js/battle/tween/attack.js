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

    Promise.all([this._attack(), this._damage()]).then(() => {
      if (this.defenser.status.HP <= 0) {
        createjs.Tween.get(this.defenser)
          .to({
            alpha: 0
          }, 800);
      }
    });
    
  }
  
  _attack() {
    const x = this.attacker.x;
    const y = this.attacker.y;
    return new Promise((resolve, reject) => {
      createjs.Tween.get(this.attacker)
        .to({
          x: this.defenser.x,
          y: this.defenser.y
        }, 150)
        .to({
          x,
          y,
        }, 150)
        .call((a) => {
          console.log(1, a);
          resolve(a);
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
        .call((a) => {
          console.log(2, a);
          resolve(a);
        });
    })
  }
}

export default Attack