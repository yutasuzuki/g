import battle from './battle/battle';
import map from './map/map';

class Router {
  constructor() {
    this.config = {
      battle: {
        name: 'battle',
        module: battle
      },
      map: {
        name: 'map',
        module: map
      }
    }
  }

  to(scene) {
    const route = new this.config[scene].module();
    route.start();
  }
}

const router = new Router();

export default router;
