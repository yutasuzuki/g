class Damage {
  constructor() {
    this.defenser = {}
  }

  tween(point, defenser) {
    this.defenser = defenser;

    const damageText = new createjs.Text(point, "16px Roboto", "white");
    
    // damageText.x = defenser.x + defenser.getBounds().width / 4;
    // damageText.y = defenser.y - defenser.getBounds().width / 4;
    damageText.x = defenser.x - 5;
    damageText.y = defenser.y + 30;
    stage.setChildIndex(damageText, -1);
    stage.addChild(damageText);
    stage.update();
    createjs.Tween.get(damageText)
      .to({
        y: damageText.y - 10,
        alpha: 1
      }, 300)
      .to({
        y: damageText.y,
        alpha: 1
      }, 300)
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