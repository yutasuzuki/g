import Stage from './stage';
import router from './router';
import Battle from './battle/battle';

window.stage = new Stage('content');
window.route = router;

route.to('battle');
