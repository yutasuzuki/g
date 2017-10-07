class Stage {
  constructor(canvas) {
    this.stage = new createjs.Stage(canvas);
    window.addEventListener("resize",() => this.resizeHandler);
    this.resizeHandler();
    this.getWidth()
    return this.stage;
  }

  resizeHandler() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.stage.canvas.width = w;
    this.stage.canvas.height = h;
    this.stage.update();
  }

  getWidth() {
    return this.stage.canvas.width;
  }

  getHeight() {
    return this.stage.canvas.height;
  }
}

export default Stage;