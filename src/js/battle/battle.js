class Battle {
  constructor() {
    this.stage = {};
    this.command = {};
    const preload = new createjs.LoadQueue();
    const loaders = {};
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
    preload.addEventListener('fileload', (e) => {
      loaders[e.item.id] = e.result;
      console.log(loaders);
    });
    preload.addEventListener('complete', (e) => {
      console.log(e.result);
      this.stage = new createjs.Stage('content');
      this.command = {
        attack: new createjs.Bitmap(loaders['attack']),
        magic: new createjs.Bitmap(loaders['magic']),
        skill: new createjs.Bitmap(loaders['skill']),
        skip: new createjs.Bitmap(loaders['skip']),
      };
      this.stage.addChild(new createjs.Bitmap(loaders['forest1']));
      this.stage.update();
      this.init();
    });
  }

  init() {
    const circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    this.stage.addChild(circle);
    this.stage.update();
  }

  handleFileComplete(event) {
    document.body.appendChild(event.result);
  }
}

export default Battle;