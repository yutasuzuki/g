import Stage from './stage';
import router from './router';
import Battle from './battle/battle';

window.stage = new Stage('content');
window.route = router;
window.state = {
  map: {
    piece: {
      pos: { x: 0, y: 0 }
    },
    squares: {
      pos: { x: 0, y: 0 }
    }
  }
};

route.to('battle');
