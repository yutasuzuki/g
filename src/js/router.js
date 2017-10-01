import battle from './battle/battle';
import map from './map/map';

class Router {
  constructor() {
    this.loaders = [];
    this.config = {
      battle: {
        name: 'battle',
        component: battle
      },
      map: {
        name: 'map',
        component: map
      }
    }
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'loadingBG.png', id: 'loadingBG'},
    ];
    queue.loadManifest(fieldManifest, true, '/assets/images/loading/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.load());
  }

  load() {
    this.loading = new createjs.Bitmap(this.loaders['loadingBG']);
    this.loading.skewX = this.loading.width / 2;
    this.loading.skewY = this.loading.height / 2;
    this.loading.scaleX = 1;
    this.loading.scaleY = 1;
    this.loading.x = 0;
    this.loading.y = 0;
    this.loading.alpha = 1;

    stage.addChild(this.loading);
    stage.update();

    return new Promise((resolve, reject) => {})
  }

  to(scene) {
    this.load();

    setTimeout(() => {
      const route = new this.config[scene].component();
      route.start();
    }, 1500);
  }
}

const router = new Router();

export default router;
