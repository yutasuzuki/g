class Damage {
  constructor() {
    this.defenser = {}
  }

  tween(point, defenser) {
    this.defenser = defenser;

    const damageText = new createjs.Text(point, "18px serif", "white");
    
    damageText.x = defenser.x + 22;
    damageText.y = defenser.y + 22;
    stage.setChildIndex(damageText, 2);
    stage.addChild(damageText);
    stage.update();
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
        stage.removeChild(damageText);
        stage.update();
      });
  }
  
}

export default Damage