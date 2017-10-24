import Stage from './stage';
import router from './router';
import Battle from './battle/battle';

const MyParty = [
  {
    id: 8,
    name: 'ルシェ',
    MAX_HP: 50,
    HP: 50,
    ATK: 20,
    MGC: 30,
    DF: 25,
    SP: 20,
    leader: true,
    choice: {
      rate: {
        ATK: 20,
        MGC: 50,
        SP: 40,
        OTHER: 10
      }
    }
  },
  {
    id: 13,
    name: '天穂',
    MAX_HP: 45,
    HP: 45,
    ATK: 18,
    MGC: 18,
    DF: 22,
    SP: 32,
    leader: false,
    choice: {
      rate: {
        ATK: 50,
        MGC: 10,
        SP: 30,
        OTHER: 10
      }
    }
  },
  {
    id: 17,
    name: 'ベルナドット',
    MAX_HP: 48,
    HP: 48,
    ATK: 14,
    MGC: 22,
    DF: 25,
    SP: 12,
    leader: false,
    choice: {
      rate: {
        ATK: 30,
        MGC: 10,
        SP: 30,
        OTHER: 30
      }
    }
  },
  {
    id: 14,
    name: 'ネマーニャ',
    MAX_HP: 42,
    HP: 42,
    ATK: 12,
    MGC: 25,
    DF: 25,
    SP: 16,
    leader: false,
    choice: {
      rate: {
        ATK: 10,
        MGC: 40,
        SP: 20,
        OTHER: 30
      }
    }
  },
  {
    id: 1,
    name: 'カフ',
    MAX_HP: 55,
    HP: 55,
    ATK: 16,
    MGC: 10,
    DF: 40,
    SP: 15,
    leader: false,
    choice: {
      rate: {
        ATK: 10,
        MGC: 40,
        SP: 20,
        OTHER: 30
      }
    }
  }
]

window.stage = new Stage('content');
createjs.Touch.enable(stage);
window.route = router;
window.state = {
  party: MyParty,
  gold: 0,
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

route.to('home');
