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
    name: "Aircraft Carrier",
    length: 5,
    health: 5,
    key: "player-ac",
  },
  battleship: {
    name: "Battleship",
    length: 4,
    health: 4,
    key: "player-bs",
  },
  cruiser: {
    name: "cruiser",
    length: 3,
    health: 3,
    key: "player-cr",
  },
  firstDestroyer: {
    name: "First Destroyer",
    length: 3,
    health: 3,
    key: "player-fd",
  },
  secondDestroyer: {
    name: "Second Destroyer",
    length: 3,
    health: 3,
    key: "player-sd",
  },
  firstSubmarine: {
    name: "First Submarine",
    length: 2,
    health: 2,
    key: "player-fs",
  },
  secondSubmarine: {
    name: "Second Submarine",
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
const playAgainBtn = document.createElement("button");
/*----- variables -----*/
let turn = 1;
let winner = null;
let lastHitColumn = null;
let lastHitRow = null;
let suitableIndex = null;
let verticalCheckbox = false;
let shipCounter = 0;
/*----- cached element references -----*/
const PLAYER_BOARD_SECTION = document.querySelector(".player-board-section");
const CPU_BOARD_SECTION = document.querySelector(".cpu-board-section");
const activePlayerEl = document.querySelector("h2");
const verticalCheckboxEl = document.querySelector("input");
const verticalLabelEl = document.querySelector("label");
/*----- event listeners -----*/
CPU_BOARD_SECTION.addEventListener("click", handleMove);
PLAYER_BOARD_SECTION.addEventListener("click", playerMouseClick);
playAgainBtn.addEventListener("click", resetGame);
verticalCheckboxEl.addEventListener("change", (e) => {
  if (e.target.checked) {
    verticalCheckbox = true;
  } else {
    verticalCheckbox = false;
  }
});
/*----- functions -----*/
render();

//Initial rendering of the divs and header.
function render() {
  createBoard("player");
  createBoard("cpu");
  renderShips(CPU_BOARD);
  activeTurn();
}

//Resetting the game to its base state after the match has ended
function resetGame() {
  playerShips = JSON.parse(JSON.stringify(BASE_PLAYER_SHIP_STATES));
  cpuShips = JSON.parse(JSON.stringify(BASE_CPU_SHIP_STATES));
  turn = 1;
  winner = null;
  LOCATIONS.clear();
  resetBoard(PLAYER_BOARD, PLAYER_DIVS);
  resetBoard(CPU_BOARD, CPU_DIVS);
  if (document.body.contains(playAgainBtn))
    document.querySelector("body").removeChild(playAgainBtn);
  render();
}

//Creating the game board
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
        ? PLAYER_BOARD_SECTION.prepend(div)
        : CPU_BOARD_SECTION.appendChild(div);
    });
  });
}

//Handling the player clicks for placing ships
function playerMouseClick(evt) {
  if (evt.target.tagName === "INPUT" || evt.target.tagName === "LABEL" || shipCounter > 6 || evt.target === PLAYER_BOARD_SECTION) return;
  let clickedDiv = PLAYER_DIVS.indexOf(evt.target);
  let rows = parseInt(clickedDiv.toString().charAt(0));
  let columns = parseInt(clickedDiv.toString().charAt(1));
  if (isNaN(columns)) {
    columns = rows;
    rows = 0;
  }
  let shipCanBePlaced;
  shipCanBePlaced = canBePlaced(
    PLAYER_BOARD,
    rows,
    columns,
    verticalCheckbox === true ? "vertical" : "horizontal",
    Object.values(playerShips)[shipCounter]
  );
  if (shipCanBePlaced === true) {
    placeShips(
      PLAYER_BOARD,
      rows,
      columns,
      verticalCheckbox === true ? "vertical" : "horizontal",
      Object.values(playerShips)[shipCounter]
    );
    shipCounter++;
  }
  activeTurn();
}

//Rendering the ships on the game board
function renderShips(board) {
  let shipCanBePlaced;
  let rows;
  let columns;
  let idx = Math.round(Math.random());
  const vertOrHoriz = ["vertical", "horizontal"];

  Object.values(cpuShips).forEach((shipObj) => {
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
  });
}

//Modifying the header based on the current games state
function activeTurn() {
  if (shipCounter <= 6) {
    activePlayerEl.innerHTML = `Place your ${
      Object.values(playerShips)[shipCounter].name
    } ${Object.values(playerShips)[shipCounter].length} Tiles `;
  } else if (winner !== null) {
    playAgainBtn.innerHTML = "Play Again";
    activePlayerEl.innerHTML = `${winner === 1 ? "PLAYER WINS!" : "CPU WINS!"}`;
    document.body.appendChild(playAgainBtn);
    return;
  } else {
    verticalLabelEl.style.display = "none";
    activePlayerEl.innerHTML = `${turn === 1 ? "PLAYER'S TURN" : "CPU'S turn"}`;
  }
  return sleep(700);
}

//Checking if the ship can be placed on the selected div
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

//Actually placing the ships after confirming that they can be placed
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

//Handling the player clicking the CPU board to fire
async function handleMove(evt) {
  let clickedDiv = evt.target;
  if (
    shipCounter <= 6 ||
    clickedDiv.classList.contains("miss") ||
    clickedDiv.classList.contains("hit-ship") ||
    clickedDiv.classList.contains("sunken-ship") ||
    turn === -1 ||
    winner !== null
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
  if (clickedDiv.classList.contains("cpu-ship")) {
    currentShip = findCorrectShip(CPU_BOARD, clickedDiv);
    if (!clickedDiv.classList.contains("hit-ship")) currentShip.health--;
    checkIfSunk(CPU_BOARD, currentShip, clickedDiv);
    CPU_DIVS[divIdx].classList.add("hit-ship");
    CPU_BOARD[rows][columns] = 2;
  }
  turn = -1;
  await activeTurn();

  cpuFire(PLAYER_BOARD);
}

//Generating the CPU firing locations
function cpuFire(board) {
  let randomDivIdx;

  if (lastHitRow !== null && lastHitColumn !== null) {
    suitableIndex = parseInt(getSuitableIndex(board));
  }
  if (
    suitableIndex === null ||
    isNaN(suitableIndex) ||
    LOCATIONS.has(suitableIndex)
  ) {
    do {
      randomDivIdx = getRandomNum(0, 99);
    } while (LOCATIONS.has(randomDivIdx));
  } else randomDivIdx = suitableIndex;

  LOCATIONS.add(randomDivIdx);
  let randomDiv = PLAYER_DIVS[randomDivIdx];
  let rows = parseInt(randomDivIdx.toString().charAt(0));
  let columns = parseInt(randomDivIdx.toString().charAt(1));

  if (isNaN(columns)) {
    columns = rows;
    rows = 0;
  }
  let currentShip;

  if (PLAYER_DIVS[randomDivIdx].classList.contains("player-ship")) {
    currentShip = findCorrectShip(PLAYER_BOARD, randomDiv);
    if (!PLAYER_DIVS[randomDivIdx].classList.contains("hit-ship"))
      currentShip.health--;
    lastHitColumn = columns;
    lastHitRow = rows;
    checkIfSunk(PLAYER_BOARD, currentShip, randomDiv);
    PLAYER_DIVS[randomDivIdx].classList.add("hit-ship");
    PLAYER_BOARD[rows][columns] = 2;
  }
  if (PLAYER_BOARD[rows][columns] === 0) {
    randomDiv.classList.add("miss");
    PLAYER_BOARD[rows][columns] = 3;
  }
  turn = 1;
  activeTurn();
}

//Finding if there is an index around the last hit div that can be fired at again
function getSuitableIndex(board) {
  if (
    lastHitColumn + 1 !== 10 &&
    board[lastHitRow][lastHitColumn + 1] !== 2 &&
    board[lastHitRow][lastHitColumn + 1] !== 3
  ) {
    return `${lastHitRow}${lastHitColumn + 1}`;
  } else if (
    lastHitRow + 1 !== 10 &&
    board[lastHitRow + 1][lastHitColumn] !== 2 &&
    board[lastHitRow + 1][lastHitColumn] !== 3
  ) {
    return `${lastHitRow + 1}${lastHitColumn}`;
  } else if (
    lastHitColumn - 1 !== -1 &&
    board[lastHitRow][lastHitColumn - 1] !== 2 &&
    board[lastHitRow][lastHitColumn - 1] !== 3
  ) {
    return `${lastHitRow}${lastHitColumn - 1}`;
  } else if (
    lastHitRow - 1 !== -1 &&
    board[lastHitRow - 1][lastHitColumn] !== 2 &&
    board[lastHitRow - 1][lastHitColumn] !== 3
  ) {
    return `${lastHitRow - 1}${lastHitColumn}`;
  } else return null;
}

//Get the correct ship object from the clicked div
function findCorrectShip(board, div) {
  let correctShip;
  Object.values(board === PLAYER_BOARD ? playerShips : cpuShips).forEach(
    (obj) => {
      if (obj.key === div.id) correctShip = obj;
    }
  );
  return correctShip;
}

//Checking if the ship that was hit has been sunk
function checkIfSunk(board, ship, div) {
  let currentPlayer = board === PLAYER_BOARD ? PLAYER_DIVS : CPU_DIVS;
  if (ship.health === 0 && [...div.classList].includes("horizontal")) {
    for (let i = 0; i < ship.length; i++) {
      currentPlayer[parseInt(ship.firstIndex) + i].classList.add("sunken-ship");
    }
    if (board === PLAYER_BOARD) {
      suitableIndex = null;
      lastHitRow = null;
      lastHitColumn = null;
    }
  }
  if (ship.health === 0 && [...div.classList].includes("vertical")) {
    for (let i = 0; i < ship.length * 10; i += 10) {
      currentPlayer[parseInt(ship.firstIndex) + i].classList.add("sunken-ship");
    }
    if (board === PLAYER_BOARD) {
      suitableIndex = null;
      lastHitRow = null;
      lastHitColumn = null;
    }
  }
  getWinner(board);
}
//Checking if a winner has been found
function getWinner(board) {
  let sunkShipsCounter = 0;
  let currentPlayer = board == PLAYER_BOARD ? playerShips : cpuShips;
  Object.values(currentPlayer).forEach((obj) => {
    obj.health === 0 ? sunkShipsCounter++ : sunkShipsCounter;
  });
  if (sunkShipsCounter === Object.keys(currentPlayer).length) {
    winner = currentPlayer === cpuShips ? 1 : -1;
    activeTurn();
  }
}

//Removing the existing divs
function resetBoard(board, divs) {
  board.forEach((arrEl) => {
    arrEl.forEach((el, innerIdx) => {
      arrEl[innerIdx] = 0;
    });
  });
  divs.forEach((div) => {
    div.remove();
  });
  divs.length = 0;
  shipCounter = 0;
  verticalLabelEl.style.display = "flex";
}


function getRandomNum(x, y) {
  return Math.floor(Math.random() * (x - y) + y);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}