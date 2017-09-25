class Stage {
  constructor(canvas) {
    this.stage = new createjs.Stage(canvas);
    window.addEventListener("resize",() => this.resizeHandler);
    this.resizeHandler();
    return this.stage;
  }

  resizeHandler() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.stage.canvas.width = w;
    this.stage.canvas.height = h;
    this.stage.update();
  }
}

export default Stage;