import home from './home/home';
import battle from './battle/battle';
import map from './map/map';
import talk from './talk/talk';
import party from './party/party';

class Router {
  constructor() {
    this.loaders = [];
    this.loading = {
      circles: []
    };
    this.config = {
      home: {
        name: 'home',
        component: home
      },
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
      party: {
        name: 'party',
        component: party
      },
    }
    const queue = new createjs.LoadQueue();
    const fieldManifest = [
      {src: 'loading-ghost.png', id: 'ghost'},
    ];
    queue.loadManifest(fieldManifest, true, './assets/images/loading/');
    queue.addEventListener('fileload', (e) => this.loaders[e.item.id] = e.result);
    queue.addEventListener('complete', () => this.start());
  }

  start() {

  }

  load() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', stage);

    const data = {
      images: ['./assets/images/loading/loading-ghost.png'],
      frames: {width: 170, height: 170, regX: 0, regY: 0, scaleX: 0.5, scaleY: 0.5},
      animations: {
        ghost: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        }
      },
      framerate: 30
    };

    const spritesheet = new createjs.SpriteSheet(data);
    const sprite = new createjs.Sprite(spritesheet, 0);
    sprite.scaleX = 0.5;
    sprite.scaleY = 0.5;
    sprite.x = 100;
    sprite.y = 100;

    // sprite.gotoAndPlay('ghost');

    stage.addChild(sprite);
    stage.update();

    return new Promise((resolve, reject) => {})
  }

  to(scene) {
    this.load();
    const route = new this.config[scene].component();
    // route.start();
  }
}

const router = new Router();

export default router;
