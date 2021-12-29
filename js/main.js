/*----- constants -----*/

const boardDivs = [
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

const PLAYER_SHIPS = {
  aircraftCarrier: [1, 1, 1, 1, 1],
  battleship: [1, 1, 1, 1],
  cruiser: [1, 1, 1],
  firstDestroyer: [1, 1, 1],
  secondDestroyer: [1, 1, 1],
  firstSubmarine: [1, 1],
  secondSubmarine: [1, 1] //22
};
/*----- app's state (variables) -----*/

/*----- cached element references -----*/
const playerDivs = [];
const cpuDivs = [];
const playerBoardSection = document.querySelector(".player-board-section");
const cpuBoardSection = document.querySelector(".cpu-board-section");
/*----- event listeners -----*/
playerBoardSection.addEventListener("click", handleMove);
/*----- functions -----*/
render();

function render() {
  createBoard("player");
  createBoard("cpu");
  renderShips();
}

function createBoard(str) {
  boardDivs.forEach((indArr, outerIdx) => {
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

function renderShips() {
  let randomDiv;

  Object.values(PLAYER_SHIPS).forEach((arrEl) => {
    randomDiv = Math.floor(Math.random() * playerDivs.length);
    if (randomDiv + arrEl.length >= playerDivs.length) randomDiv -= arrEl.length;
    arrEl.forEach( () => {
      console.log(playerDivs[randomDiv]);
      playerDivs[randomDiv].classList.add("active-ship");
      playerDivs.splice(randomDiv, 1);
    
    });
  });
}



function handleMove(evt) {}
