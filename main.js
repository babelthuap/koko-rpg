const board = document.getElementById('game-board');
const tiles = [];

function setup() {
  for (let y = 0; y < 9; y++) {
    const row = [];
    for (let x = 0; x < 15; x++) {
      const tile = document.createElement('div');
      tile.addEventListener('click', () => selectTile(y, x));
      row.push(tile);
      board.appendChild(tile);
    }
    tiles.push(row);
  }
}

function selectTile(y, x) {
  console.log('(y, x) =', y, x);
}

const Tile = {
  GRASS: 0,
  WATER: 1,
  TREE: 2,
};
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const player = {
  name: 'Koko',
  position: {x: 7, y: 4},
  base: {
    strength: 10,
    dexterity: 5,
    athletics: 3,
    constitution: 7,
    focus: 10,
    willpower: 1,
  },
  resources: {
    get block() {
      return player.resources.armor + player.base.dexterity +
          player.base.strength / 2;
    },
    get dodge() {
      return player.base.dexterity + player.base.athletics +
          player.resources.armor;
    },
    get health() {
      return player.base.constitution * 3 + player.base.strength;
    },
    armor: 10,
    toxicity: 0,
    get stamina() {
      return 10 + player.base.constitution * 3 + player.base.athletics;
    },
    mana: 10,
  },
  offense: {
    attack: 10,
    accuracy: 10,
    damage: 10,
  },
  resistances: {},
  abilities: [
    'Feint',
    'War Axe Hack',
  ],
};

console.log(prettyPrint(player));

function prettyPrint(obj, indent = '') {
  if (Array.isArray(obj)) {
    let out = '';
    for (const el of obj) {
      out += `${indent}  ${prettyPrint(el, indent + '  ')},\n`;
    }
    return out === '' ? '[]' : `[\n${out}${indent}]`;
  }
  if (typeof obj === 'object') {
    let out = '';
    for (const key in obj) {
      out += `${indent}  ${key}: ${prettyPrint(obj[key], indent + '  ')},\n`;
    }
    return out === '' ? '{}' : `{\n${out}${indent}}`;
  }
  return JSON.stringify(obj);
}

const COLOR = {
  [Tile.GRASS]: 'darkgreen',
  [Tile.WATER]: 'darkblue',
  [Tile.TREE]: 'darkgreen',
};
const IMAGE = {
  [Tile.GRASS]: '',
  [Tile.WATER]: '',
  [Tile.TREE]: 'url(./art/tree.png)',
};
function render() {
  const {x, y} = player.position;

  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -7; dx <= 7; dx++) {
      const tile = tiles[4 + dy][7 + dx];
      const mapRow = map[y + dy];
      if (mapRow === undefined) {
        tile.style.backgroundColor = COLOR[Tile.WATER];
        continue;
      }
      const tileContent = mapRow[x + dx];
      if (tileContent === undefined) {
        tile.style.backgroundColor = COLOR[Tile.WATER];
        continue;
      }
      tile.style.backgroundColor = COLOR[tileContent];
      tile.style.backgroundImage = IMAGE[tileContent];
    }
  }

  tiles[4][7].style.backgroundImage = 'url(./art/berserk.gif)';
}

setup();
render();

window.addEventListener('keydown', ({key}) => {
  console.log(key);

  const newPos = {y: player.position.y, x: player.position.x};
  switch (key) {
    case 'w':
    case 'ArrowUp':
      newPos.y--;
      break;
    case 'a':
    case 'ArrowLeft':
      newPos.x--;
      break;
    case 's':
    case 'ArrowDown':
      newPos.y++;
      break;
    case 'd':
    case 'ArrowRight':
      newPos.x++;
      break;
  }
  if (map[newPos.y] && map[newPos.y][newPos.x] === Tile.GRASS) {
    player.position = newPos;
    render();
  }
});
