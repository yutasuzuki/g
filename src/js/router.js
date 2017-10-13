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
      {src: 'loadingBG.png', id: 'loadingBG'},
    ];
    queue.loadManifest(fieldManifest, true, './assets/images/loading/');
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
    const circleSetting = {
      width: 10,
      x: 40,
      y: 40 
    };
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // while (false) {
      // setTimeout(() => {
      //   var circle = new createjs.Shape();
        
      //   circle.graphics.beginFill('DeepSkyBlue').drawCircle(0,0, circleSetting.width);
      //   circle.x = circleSetting.x;
      //   circle.y = circleSetting.y;
      //   circle.alpha = 0;
        
      //   stage.addChild(circle);
      //   var filter = new createjs.ColorFilter(1, 1, 1, 1); 
      //   circle.filters = [filter];
      //   circle.cache(-20, -20, 40, 40);

      //   createjs.Ticker.setFPS(60);
      //   createjs.Ticker.addEventListener("tick", function(event){
      //     circle.updateCache();
      //     stage.update(event);
      //   });
        
      //   createjs.Tween.get(filter, { loop: false })
      //     .to({}, 500)
      //     .to({redMultiplier: 1, greenMultiplier: 1, blueMultiplier: 1, alphaMultiplier: 1, redOffset: 255, greenOffset: 255, blueOffset: 255, alphaOffset: 1 }, 500);
        
      //   createjs.Tween.get(circle)
      //     .to({alpha: 1}, 500)
      //     .to({ scaleX: 40, scaleY: 40 }, 500);
      // }, 500);
    // }
    
    const route = new this.config[scene].component();
    route.start();

    // setTimeout(() => {
    // }, 1500);
  }
}

const router = new Router();

export default router;
