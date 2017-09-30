import battle from './battle/battle';

class Router {
  constructor() {
    this.config = {
      battle: {
        name: 'battle',
        module: battle
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
