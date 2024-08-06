const row = 10;
const column = 10;
const mine = 10;
let mineArray = [];
let gameOver = false;
const totalCells = row * column;
const totalMines = 10;
let cellsFullFill = 0;

function createCell() {
  return {
    mine: false,
    number: 0,
    displayNumber: false,
  };
}

function setArray() {
  mineArray = [];

  for (let r = 0; r < row; r++) {
    const rowArray = [];
    for (let c = 0; c < column; c++) {
      rowArray.push(createCell());
    }
    mineArray.push(rowArray);
  }

  placeMines();
  calculateNumbers();
  displayBox();
}

function placeMines() {
  let minesPlaced = 0;

  while (minesPlaced < mine) {
    const r = Math.floor(Math.random() * row);
    const c = Math.floor(Math.random() * column);

    if (!mineArray[r][c].mine) {
      mineArray[r][c].mine = true;
      minesPlaced++;
    }
  }
}

function calculateNumbers() {
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < column; c++) {
      if (mineArray[r][c].mine) continue;

      let mineCount = 0;

      if (c + 1 < column && mineArray[r][c + 1].mine) {
        mineCount++;
      }

      if (r + 1 < row && mineArray[r + 1][c].mine) {
        mineCount++;
      }

      if (c - 1 >= 0 && mineArray[r][c - 1].mine) {
        mineCount++;
      }

      if (r - 1 >= 0 && mineArray[r - 1][c].mine) {
        mineCount++;
      }

      if (r + 1 < row && c + 1 < column && mineArray[r + 1][c + 1].mine) {
        mineCount++;
      }

      if (r + 1 < row && c - 1 >= 0 && mineArray[r + 1][c - 1].mine) {
        mineCount++;
      }

      if (r - 1 >= 0 && c + 1 < column && mineArray[r - 1][c + 1].mine) {
        mineCount++;
      }

      if (r - 1 >= 0 && c - 1 >= 0 && mineArray[r - 1][c - 1].mine) {
        mineCount++;
      }

      mineArray[r][c].number = mineCount;
    }
  }
}

function displayBox() {
  const getBoxId = document.getElementById("boxes");
  getBoxId.innerHTML = "";

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < column; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      cell.setAttribute("dataR", r);
      cell.setAttribute("dataC", c);

      cell.addEventListener("click", handleClick);

      getBoxId.appendChild(cell);
    }
  }
}

function handleClick(event) {
  const cell = event.target;
  const r = parseInt(cell.getAttribute("dataR"));
  const c = parseInt(cell.getAttribute("dataC"));

  if (gameOver || mineArray[r][c].displayNumber) return;

  if (mineArray[r][c].mine) {
    cell.innerHTML = "M";
    cell.classList.add("mine");
    gameOver = true;
    alert("Sorry! Better Luck Next Time...");
    displayAllBox();
    return;
  }

  displayBoxNumber(r, c);

  if (checkWinCondition()) {
    gameOver = true;
    alert("Congratulations! You Are Winner...");
    displayAllBox();
  }
}

function displayBoxNumber(r, c) {
  const cellElement = document.querySelector(
    `.cell[dataR="${r}"][dataC="${c}"]`
  );
  cellElement.classList.add("displayBoxNumber");
  cellElement.textContent = mineArray[r][c].number || "0";
  mineArray[r][c].displayNumber = true;
  cellsFullFill++;

  if (mineArray[r][c].number === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = r + i;
        const newCol = c + j;

        if (
          newRow >= 0 &&
          newRow < mineArray.length &&
          newCol >= 0 &&
          newCol < mineArray[0].length &&
          !mineArray[newRow][newCol].displayNumber
        ) {
          displayBoxNumber(newRow, newCol);
        }
      }
    }
  }
}

function displayAllBox() {
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < column; c++) {
      const cellElement = document.querySelector(
        `.cell[dataR="${r}"][dataC="${c}"]`
      );
      if (mineArray[r][c].mine) {
        cellElement.innerHTML = "M";
        cellElement.classList.add("mine");
      } else {
        cellElement.classList.add("displayBoxNumber");
        cellElement.textContent = mineArray[r][c].number || "0";
      }
    }
  }
}

function checkWinCondition() {

  const noMines = totalCells - totalMines;
  return cellsFullFill === noMines;

}

function resetGame() {
  gameOver = false;
  setArray();
}

setArray();

document.getElementById("resetButton").addEventListener("click", resetGame);



