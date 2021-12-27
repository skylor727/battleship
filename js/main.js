/*----- constants -----*/

const boardDivs = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

/*----- app's state (variables) -----*/
/*----- cached element references -----*/
const playerBoardSection = document.querySelector(".player-board-section");
const cpuBoardSection = document.querySelector(".cpu-board-section");
/*----- event listeners -----*/
/*----- functions -----*/
render();

function render() {
  createBoard("player");
  createBoard("cpu");
}

function createBoard(str) {
  boardDivs.forEach((indArr, outerIdx) => {
    indArr.forEach((arrEl, innerIdx) => {
      const div = document.createElement("DIV");
      div.className = "board";
      // If it is the first row of the first column don't add the row value as it is just used for alignment
      if (innerIdx === 0) {
        div.innerHTML = 'c' + (outerIdx+1);
        // labeling all other columns with row numbers as they are active spaces for the game
      } else 
        div.innerHTML = `c${outerIdx + 1}r${String.fromCharCode( 
          "a".charCodeAt(0) + innerIdx - 1 //Used to start at row A and increment to the next character in the alphabet
        )}`;
      str === "player" // Checking if the createBoard function was called for the player or the board to append the divs to the correct grid
        ? playerBoardSection.appendChild(div)
        : cpuBoardSection.appendChild(div);
    });
  });
}
