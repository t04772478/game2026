const ROWS = 4;
const COLS = 4;
const grid = document.getElementById("grid");

let board = [];

function init() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
  );
  addRandom();
  addRandom();
  render();
}

function addRandom() {
  const empty = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = 2;
}

function render() {
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${COLS}, 80px)`;
  grid.style.gap = "10px";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.style.width = "80px";
      cell.style.height = "80px";
      cell.style.borderRadius = "12px";
      cell.style.background = board[r][c] ? "#4da6ff" : "#1c1c2b";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.fontSize = "28px";
      cell.style.color = "#fff";
      if (board[r][c]) cell.textContent = board[r][c];
      grid.appendChild(cell);
    }
  }
}

document.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    move();
  }
});

function move() {
  addRandom();
  render();
}

init();
