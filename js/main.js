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
      if (innerIdx === 0) {
        div.innerHTML = 'c' + (outerIdx+1);
      } else
        div.innerHTML = `c${outerIdx + 1}r${String.fromCharCode(
          "a".charCodeAt(0) + innerIdx - 1
        )}`;
      str === "player"
        ? playerBoardSection.appendChild(div)
        : cpuBoardSection.appendChild(div);
    });
  });
}
