class Attack {
  constructor() {

  }

  tween(attacker, defenser, complete = () => {}) {

    const x = attacker.x;
    const y = attacker.y;
    let rotate = 20;
    let offsetY = -10;
    let offsetX = 10;
    if (attacker.type === 'enemy') {
      rotate = -20;
      offsetY = 0;
      offsetX = -10;
    }

    createjs.Tween.get(attacker)
      .to({
        x: defenser.x,
        y: defenser.y
      }, 150)
      .to({
        x,
        y,
      }, 150);
    
    createjs.Tween.get(defenser)
      .to({
        y: defenser.y + offsetY,
        x: defenser.x + offsetX,
        rotation: rotate,
        alpha: .25
      }, 200)
      .to({
        y: defenser.y,
        x: defenser.x,
        rotation: 0,
        alpha: 1
      }, 200)
      .call(() => {
        if (defenser.status.HP <= 0) {
          createjs.Tween.get(defenser)
            .to({
              alpha: 0
            }, 800);
        }
      });;
  }
}

export default Attack