import home from './home/home';
import battle from './battle/battle';
import map from './map/map';
import talk from './talk/talk';
import party from './party/party';

class Router {
  constructor() {
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
    queue.addEventListener('complete', () => this.start());
  }

  start() {

  }

  load() {
    return new Promise((resolve, reject) => {
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener('tick', stage);

      this.container = new createjs.Container();
      const bg = new createjs.Shape();
      bg.graphics.beginFill("black");

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
      const loading = new createjs.Sprite(spritesheet, 0);
      loading.scaleX = 0.5;
      loading.scaleY = 0.5;
      loading.x = 100;
      loading.y = 100;
      loading.gotoAndPlay('ghost');

      this.container.addChild(bg, loading)
      stage.addChild(this.container);
      stage.update();
      resolve();
    })
  }

  to(scene) {
    this.load().then((res) => {
      const route = new this.config[scene].component();
      return route.start();
    }).then((res) => {
      console.log(2, res)
      stage.removeChild(this.container);
      stage.update();
    });
  }
}

const router = new Router();

export default router;
