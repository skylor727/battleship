/*----- constants -----*/

const PLAYER_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const CPU_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let playerShips = {
  aircraftCarrier: {
    length: 5,
    health: 5,
    key: "player-ac",
  },
  battleship: {
    length: 4,
    health: 4,
    key: "player-bs",
  },
  cruiser: {
    length: 3,
    health: 3,
    key: "player-cr",
  },
  firstDestroyer: {
    length: 3,
    health: 3,
    key: "player-fd",
  },
  secondDestroyer: {
    length: 3,
    health: 3,
    key: "player-sd",
  },
  firstSubmarine: {
    length: 2,
    health: 2,
    key: "player-fs",
  },
  secondSubmarine: {
    length: 2,
    health: 2,
    key: "player-ss",
  },
};
let cpuShips = {
  aircraftCarrier: {
    length: 5,
    health: 5,
    key: "cpu-ac",
  },
  battleship: {
    length: 4,
    health: 4,
    key: "cpu-bs",
  },
  cruiser: {
    length: 3,
    health: 3,
    key: "cpu-cr",
  },
  firstDestroyer: {
    length: 3,
    health: 3,
    key: "cpu-fd",
  },
  secondDestroyer: {
    length: 3,
    health: 3,
    key: "cpu-sd",
  },
  firstSubmarine: {
    length: 2,
    health: 2,
    key: "cpu-fs",
  },
  secondSubmarine: {
    length: 2,
    health: 2,
    key: "cpu-ss",
  },
};
const BASE_PLAYER_SHIP_STATES = JSON.parse(JSON.stringify(playerShips));
const BASE_CPU_SHIP_STATES = JSON.parse(JSON.stringify(cpuShips));
const LENGTH = CPU_BOARD[0].length;
const HEIGHT = CPU_BOARD.length;
const PLAYER_DIVS = [];
const CPU_DIVS = [];
const LOCATIONS = new Set();
/*----- variable -----*/
let turn = 1;
let winner;
let isHit;
let isSunk;
let lastHitIdx;
let missCtr = 0;
let hitCtr = 0;
let missAfterHit;
let lastHitShip;
/*----- cached element references -----*/
const PLAYER_BOARD_SECTION = document.querySelector(".player-board-section");
const CPU_BOARD_SECTION = document.querySelector(".cpu-board-section");
/*----- event listeners -----*/
document
  .querySelector(".cpu-board-section")
  .addEventListener("click", handleMove);
/*----- functions -----*/
render();

function resetGame() {
  playerShips = BASE_PLAYER_SHIP_STATES;
  cpuShips = BASE_CPU_SHIP_STATES;
  turn = 1;
}

function render() {
  createBoard("player");
  createBoard("cpu");
  renderShips(PLAYER_BOARD);
  renderShips(CPU_BOARD);
  activeTurn();
}

function createBoard(str) {
  PLAYER_BOARD.forEach((indArr, outerIdx) => {
    indArr.forEach((arrEl, innerIdx) => {
      const div = document.createElement("DIV");
      div.innerHTML = "";
      //Used to start at row A and increment to the next character in the alphabet
      div.className = `board ${String.fromCharCode(
        "a".charCodeAt(0) + innerIdx
      )}${outerIdx + 1}`;
      //Placing an active game space into an array to be accessed
      if (parseInt(div.innerHTML) !== outerIdx + 1) {
        str === "player" ? PLAYER_DIVS.push(div) : CPU_DIVS.push(div);
      }
      // Checking if the createBoard function was called for the player or the board to append the divs to the correct grid
      str === "player"
        ? PLAYER_BOARD_SECTION.appendChild(div)
        : CPU_BOARD_SECTION.appendChild(div);
    });
  });
}

function renderShips(board) {
  let shipCanBePlaced;
  let rows;
  let columns;
  let idx = Math.round(Math.random());
  const vertOrHoriz = ["vertical", "horizontal"];
  Object.values(board === PLAYER_BOARD ? playerShips : cpuShips).forEach(
    (shipObj) => {
      do {
        rows = getRandomNum(0, HEIGHT);
        columns = getRandomNum(0, LENGTH);
        shipCanBePlaced = canBePlaced(
          board,
          rows,
          columns,
          vertOrHoriz[idx],
          shipObj
        );
      } while (!shipCanBePlaced);
      placeShips(board, rows, columns, vertOrHoriz[idx], shipObj);
      idx = Math.round(Math.random());
    }
  );
}

function activeTurn() {
  const h2 = document.querySelector("h2");
  h2.innerHTML = `${turn === 1 ? "PLAYER'S TURN" : "CPU'S turn"}`;
  return sleep(1000);
}

function canBePlaced(board, rows, columns, vertOrHoriz, ship) {
  if (vertOrHoriz === "horizontal") {
    for (let i = columns; i < columns + ship.length; i++) {
      if (i >= LENGTH || board[rows][i] !== 0) return false;
    }
  } else {
    for (let i = rows; i < rows + ship.length; i++) {
      if (i >= LENGTH || board[i][columns] !== 0) return false;
    }
  }
  return true;
}

function placeShips(board, rows, columns, vertOrHoriz, ship) {
  if (vertOrHoriz === "horizontal") {
    for (let i = columns; i < columns + ship.length; i++) {
      board === PLAYER_BOARD
        ? PLAYER_DIVS[rows * LENGTH + i].classList.add(
            "player-ship",
            "horizontal"
          )
        : CPU_DIVS[rows * LENGTH + i].classList.add("cpu-ship", "horizontal");
      board === PLAYER_BOARD
        ? (PLAYER_DIVS[rows * LENGTH + i].id = `${ship.key}`)
        : (CPU_DIVS[rows * LENGTH + i].id = `${ship.key}`);
      ship.firstIndex = `${rows}${columns}`;
      board[rows][i] = 1;
    }
  } else {
    for (let i = rows; i < rows + ship.length; i++) {
      board === PLAYER_BOARD
        ? PLAYER_DIVS[i * LENGTH + columns].classList.add(
            "player-ship",
            "vertical"
          )
        : CPU_DIVS[i * LENGTH + columns].classList.add("cpu-ship", "vertical");
      board === PLAYER_BOARD
        ? (PLAYER_DIVS[i * LENGTH + columns].id = `${ship.key}`)
        : (CPU_DIVS[i * LENGTH + columns].id = `${ship.key}`);
      ship.firstIndex = `${rows}${columns}`;
      board[i][columns] = 1;
    }
  }
}

async function handleMove(evt) {
  let clickedDiv = evt.target;
  if (
    clickedDiv.classList.contains("hit-ship" || "miss" || "sunken-ship") ||
    turn === -1
  )
    return;
  let divIdx = CPU_DIVS.indexOf(clickedDiv);
  let rows = parseInt(divIdx.toString().charAt(0));
  let columns = parseInt(divIdx.toString().charAt(1));
  let currentShip;
  if (isNaN(columns)) {
    columns = rows;
    rows = 0;
  }
  if (CPU_BOARD[rows][columns] === 0) CPU_DIVS[divIdx].classList.add("miss");
  if ([...clickedDiv.classList].includes("cpu-ship")) {
    currentShip = findCorrectShip(CPU_BOARD, clickedDiv);
    if (![...clickedDiv.classList].includes("hit-ship")) currentShip.health--;
    checkIfSunk(CPU_BOARD, currentShip, clickedDiv);
    CPU_DIVS[divIdx].classList.add("hit-ship");
    CPU_BOARD[rows][columns] = 2;
  }
  turn = -1;
  await activeTurn();

  cpuFire(PLAYER_BOARD);
}

function cpuFire(board) {
  let randomDivIdx;
  do {
    randomDivIdx = cpuHit(isHit, isSunk, lastHitIdx);
  } while (LOCATIONS.has(randomDivIdx));
  LOCATIONS.add(randomDivIdx);
  let randomDiv = PLAYER_DIVS[randomDivIdx];
  let rows = parseInt(randomDivIdx.toString().charAt(0));
  let columns = parseInt(randomDivIdx.toString().charAt(1));
  if (isNaN(columns)) {
    columns = rows;
    rows = 0;
  }
  console.log(rows + " -rows-columns- " + columns);
  let currentShip;
  if (PLAYER_DIVS[randomDivIdx].classList.contains("player-ship")) {
    isHit = true;
    currentShip = findCorrectShip(PLAYER_BOARD, randomDiv);
    if (!PLAYER_DIVS[randomDivIdx].classList.contains("hit-ship"))
      currentShip.health--;
    lastHitIdx = randomDivIdx;
    isSunk = checkIfSunk(PLAYER_BOARD, currentShip, randomDiv) ? true : false;
    PLAYER_DIVS[randomDivIdx].classList.add("hit-ship");
    missCtr = 0;
    missAfterHit = false;
    PLAYER_BOARD[rows][columns] = 2;
  }
  if (PLAYER_BOARD[rows][columns] === 0) {
    randomDiv.classList.add("miss");
    console.log("isHit " + isHit + " miss ctr " + missCtr);
    if (isHit === true && missCtr <= lastHitShip.length) {
      missAfterHit = true;
      missCtr++;
    } else {
      isHit = false;
    }
  }
  turn = 1;
  activeTurn();
}

function cpuHit(isHit, isSunk, lastHitIdx, ship) {
  let randomNum;
  let isSameLine;
  if (typeof lastHitIdx !== "undefined") {
    let div = PLAYER_DIVS[lastHitIdx];
    lastHitShip = findCorrectShip(PLAYER_BOARD, div);

    let vertOrHoriz = missCtr >= lastHitShip.length ? "vertical" : "horizontal";
    if (isSunk === false && isHit === true) {
      hitCtr++;
      let rows = parseInt(lastHitIdx.toString().charAt(0));
      let columns = parseInt(lastHitIdx.toString().charAt(1));
      do {
        if (vertOrHoriz === "horizontal") {
          for (let i = columns; i < columns + hitCtr; i++) {
            if (i >= LENGTH) isSameLine = false;
          }
        } else {
          for (let i = rows; i < rows + hitCtr; i++) {
            if (i >= LENGTH) isSameLine = false;
          }
        }
        randomNum = getRandomNum(
          lastHitIdx - lastHitShip.length >= 0
            ? lastHitIdx - lastHitShip.length
            : lastHitIdx - lastHitIdx,
          lastHitIdx + lastHitShip.length <= 99
            ? lastHitIdx + lastHitShip.length
            : lastHitIdx + (99 - lastHitIdx)
        );
        isSameLine = true;
      } while (!isSameLine);
    }
  } else {
    randomNum = getRandomNum(0, 99);
  }
  return randomNum;
}

function findCorrectShip(board, div) {
  let correctShip;
  Object.values(board === PLAYER_BOARD ? playerShips : cpuShips).forEach(
    (obj) => {
      if (obj.key === div.id) correctShip = obj;
    }
  );
  return correctShip;
}

function checkIfSunk(board, ship, div) {
  let currentPlayer = board === PLAYER_BOARD ? PLAYER_DIVS : CPU_DIVS;
  if (ship.health === 0 && [...div.classList].includes("horizontal")) {
    for (let i = 0; i < ship.length; i++) {
      currentPlayer[parseInt(ship.firstIndex) + i].classList.add("sunken-ship");
      getWinner(board);
    }
    if (board === PLAYER_BOARD) {
      missCtr = 0;
      hitCtr = 0;
      isHit = false;
      lastHitShip = null;
    }
    return true;
  }
  if (ship.health === 0 && [...div.classList].includes("vertical")) {
    for (let i = 0; i < ship.length * 10; i += 10) {
      currentPlayer[parseInt(ship.firstIndex) + i].classList.add("sunken-ship");
      getWinner(board);
    }
    if (board === PLAYER_BOARD) {
      missCtr = 0;
      hitCtr = 0;
      isHit = false;
      lastHitShip = null;
    }

    return true;
  }
  return false;
}

function getWinner(board) {
  let sunkShipsCounter = 0;
  let currentPlayer = board == PLAYER_BOARD ? playerShips : cpuShips;
  Object.values(currentPlayer).forEach((obj) => {
    obj.health === 0 ? sunkShipsCounter++ : sunkShipsCounter;
  });
  if (sunkShipsCounter === Object.keys(currentPlayer).length)
    winner = currentPlayer === cpuShips ? 1 : -1;
}

function getRandomNum(x, y) {
  return Math.floor(Math.random() * (x - y) + y);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
