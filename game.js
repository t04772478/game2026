const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");

let grid = Array(16).fill(0);
let score = 0;

function init() {
  addNumber();
  addNumber();
  render();
}

function addNumber() {
  const empty = grid
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  if (empty.length === 0) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  grid[index] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  gridEl.innerHTML = "";
  grid.forEach(value => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value === 0 ? "" : value;
    gridEl.appendChild(cell);
  });
  scoreEl.textContent = score;
}

/* HOZIRCHA HARAKAT YO‘Q — KEYINGI BOSQICHDA */
init();
