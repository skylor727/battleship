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

const LENGTH = CPU_BOARD[0].length;
const HEIGHT = CPU_BOARD.length;

const PLAYER_SHIPS = {
  aircraftCarrier: {
    length: 5,
  },
  battleship: {
    length: 4,
  },

  cruiser: {
    length: 3,
  },
  firstDestroyer: {
    length: 3,
  },
  secondDestroyer: {
    length: 3,
  },
  firstSubmarine: {
    length: 2,
  },
  secondSubmarine: {
    length: 2,
  },
};

const CPU_SHIPS = {
  aircraftCarrier: {
    length: 5,
  },
  battleship: {
    length: 4,
  },

  cruiser: {
    length: 3,
  },
  firstDestroyer: {
    length: 3,
  },
  secondDestroyer: {
    length: 3,
  },
  firstSubmarine: {
    length: 2,
  },
  secondSubmarine: {
    length: 2,
  },
};
/*----- app's state (variables) -----*/

/*----- cached element references -----*/
const playerDivs = [];
const cpuDivs = [];
const playerBoardSection = document.querySelector(".player-board-section");
const cpuBoardSection = document.querySelector(".cpu-board-section");
/*----- event listeners -----*/
document.querySelector(".board-wrapper").addEventListener("click", handleMove);
/*----- functions -----*/
render();

function render() {
  createBoard("player");
  createBoard("cpu");
  renderShips(PLAYER_BOARD);
  renderShips(CPU_BOARD);
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
        str === "player" ? playerDivs.push(div) : cpuDivs.push(div);
      }
      // Checking if the createBoard function was called for the player or the board to append the divs to the correct grid
      str === "player"
        ? playerBoardSection.appendChild(div)
        : cpuBoardSection.appendChild(div);
    });
  });
}

function renderShips(board) {
  let shipCanBePlaced;
  let rows;
  let columns;
  let idx = Math.round(Math.random());
  const vertOrHoriz = ["vertical", "horizontal"];
  Object.values(PLAYER_SHIPS).forEach((shipObj) => {
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

function handleMove(evt) {
  let clickedDiv = evt.target;
  if ([...clickedDiv.classList].includes("cpu-ship")) {
    let divIdx = cpuDivs.indexOf(clickedDiv);
    let firstBoardIdx = parseInt(divIdx.toString().charAt(0));
    let secondBoardIdx = parseInt(divIdx.toString().charAt(1));
    let vertOrHoriz = [...clickedDiv.classList].includes('vertical') ? 'vertical' : 'horizontal';
    cpuDivs[divIdx].classList.add("hit-ship");
    CPU_BOARD[firstBoardIdx][secondBoardIdx] = 2;
    checkIfSunk(CPU_BOARD, firstBoardIdx, secondBoardIdx,)
  }
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
        ? playerDivs[rows * LENGTH + i].classList.add("player-ship", "horizontal")
        : cpuDivs[rows * LENGTH + i].classList.add("cpu-ship", "horizontal");

      board[rows][i] = 1;
    }
  } else {
    for (let i = rows; i < rows + ship.length; i++) {
      board === PLAYER_BOARD
        ? playerDivs[i * LENGTH + columns].classList.add("player-ship", "vertical")
        : cpuDivs[i * LENGTH + columns].classList.add("cpu-ship", "vertical");
      board[i][columns] = 1;
    }
  }
}

function checkIfSunk(board, rows, columns, vertOrHoriz) {

}
function getRandomNum(x, y) {
  return Math.floor(Math.random() * (x - y) + y);
}
