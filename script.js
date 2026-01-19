// === CONFIG ===
const ROWS = 4;
const COLS = 5;

// === DOM ===
const grid = document.getElementById("grid");
const emptyBtn = document.getElementById("emptyBtn");
const x2Btn = document.getElementById("x2Btn");
const donateBtn = document.getElementById("donateBtn");
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");

// === STATE ===
let board = [];
let score = 0;

// === INIT ===
init();
render();

// === FUNCTIONS ===
function init() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
  );

  addTile();
  addTile();
}

function addTile() {
  const empty = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (!empty.length) return;

  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = 2;
}

function render() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (board[r][c] !== 0) {
        cell.textContent = board[r][c];
        cell.classList.add("tile");
        cell.style.fontSize = Math.max(16, 48 - String(board[r][c]).length * 6) + "px";
      }

      grid.appendChild(cell);
    }
  }
}

// === BUTTONS ===
emptyBtn.onclick = () => {
  addTile();
  render();
};

x2Btn.onclick = () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== 0) {
        board[r][c] *= 2;
        render();
        return;
      }
    }
  }
};

donateBtn.onclick = () => {
  alert("Donat uchun rahmat ❤️ (keyin reklama ulanadi)");
};

helpBtn.onclick = () => {
  helpModal.classList.remove("hidden");
};

closeHelp.onclick = () => {
  helpModal.classList.add("hidden");
};
