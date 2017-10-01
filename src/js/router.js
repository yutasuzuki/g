import battle from './battle/battle';
import map from './map/map';

class Router {
  constructor() {
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
  }

  to(scene) {
    const route = new this.config[scene].component();
    route.start();
  }
}

const router = new Router();

export default router;
