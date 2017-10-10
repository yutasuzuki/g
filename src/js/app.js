import Stage from './stage';
import router from './router';
import Battle from './battle/battle';

window.stage = new Stage('content');
createjs.Touch.enable(stage);
window.route = router;
window.state = {
  map: {
    currentType: 3,
    piece: {
      pos: { x: 1, y: 0 }
    },
    squares: {
      pos: { x: 0, y: 0 }
    }
  }
};

route.to('talk');
