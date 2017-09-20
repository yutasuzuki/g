class Battle {
  constructor() {
    this.stage = {};
    this.command = {
      attack: new createjs.Shape(),
      magic: new createjs.Shape(),
      skill: new createjs.Shape(),
      skip: new createjs.Shape(),
    };
    const preload = new createjs.LoadQueue(false);
    const fieldManifest = [
      {src: "forest1.jpg", id: "forest1"},
    ];
    const commandManifest = [
      {src: "command_attack.png", id: "attack"},
      {src: "command_magic.png", id: "magic"},
      {src: "command_skill.png", id: "skill"},
      {src: "command_skip.png", id: "skip"},
    ];
    preload.loadManifest(commandManifest, true, "/assets/images/battle/");
    preload.loadManifest(fieldManifest, true, "/assets/images/field/");
    preload.addEventListener('complete', () => {
      this.stage = new createjs.Stage("content");
      const w = this.stage.canvas.width;
      const h = this.stage.canvas.height;
      const field = new createjs.Shape();
      field.graphics.beginBitmapFill(preload.getResult("forest1")).drawRect(0, 0, w, h);
      this.command.attack.graphics.beginBitmapFill(preload.getResult("attack")).drawRect(0, 0, w, 200);
      this.command.attack.scaleX = 0.5;
      this.command.attack.scaleY = 0.15;
      this.command.magic.graphics.beginBitmapFill(preload.getResult("magic")).drawRect(0, 0, w, h);
      this.command.skill.graphics.beginBitmapFill(preload.getResult("skill")).drawRect(0, 0, w, h);
      this.command.skip.graphics.beginBitmapFill(preload.getResult("skip")).drawRect(0, 0, w, h);
      this.stage.addChild(field, this.command.attack);
      this.stage.update();
      this.init();
    });
  }

  init() {
    // const circle = new createjs.Shape();
    // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    // circle.x = 100;
    // circle.y = 100;
    // this.stage.addChild(circle);
    // this.stage.update();
  }

  handleFileComplete(event) {
    document.body.appendChild(event.result);
  }
}

export default Battle;