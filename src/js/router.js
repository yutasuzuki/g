import battle from './battle/battle';
import map from './map/map';
import talk from './talk/talk';

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
      },
      talk: {
        name: 'talk',
        component: talk
      },
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
    let shapes = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    stage.update();

    return new Promise((resolve, reject) => {})
  }

  to(scene) {

    const route = new this.config[scene].component();
    route.start();

    // setTimeout(() => {
    // }, 1500);
  }
}

const router = new Router();

export default router;
