const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");

let grid = Array(16).fill(0);
let score = 0;

/* === INIT === */
function init() {
  grid = Array(16).fill(0);
  score = 0;
  addNumber();
  addNumber();
  render();
}

/* === ADD NUMBER === */
function addNumber() {
  const empty = grid
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  if (empty.length === 0) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  grid[index] = Math.random() < 0.9 ? 2 : 4;
}

/* === RENDER === */
function render() {
  gridEl.innerHTML = "";
  grid.forEach(v => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = v === 0 ? "" : v;
    gridEl.appendChild(cell);
  });
  scoreEl.textContent = score;
}

/* === MERGE LOGIC === */
function slide(row) {
  row = row.filter(v => v !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(v => v !== 0);
}

/* === MOVE === */
function move(dir) {
  let old = grid.join();

  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 4; j++) {
      let index =
        dir === "l" ? i * 4 + j :
        dir === "r" ? i * 4 + (3 - j) :
        dir === "u" ? j * 4 + i :
                      (3 - j) * 4 + i;
      row.push(grid[index]);
    }

    row = slide(row);
    while (row.length < 4) row.push(0);

    for (let j = 0; j < 4; j++) {
      let index =
        dir === "l" ? i * 4 + j :
        dir === "r" ? i * 4 + (3 - j) :
        dir === "u" ? j * 4 + i :
                      (3 - j) * 4 + i;
      grid[index] = row[j];
    }
  }

  if (old !== grid.join()) {
    addNumber();
    render();
  }
}

/* === KEYBOARD === */
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("l");
  if (e.key === "ArrowRight") move("r");
  if (e.key === "ArrowUp") move("u");
  if (e.key === "ArrowDown") move("d");
});

/* === TOUCH + MOUSE SWIPE === */
let startX = 0, startY = 0;

function startSwipe(x, y) {
  startX = x;
  startY = y;
}

function endSwipe(x, y) {
  const dx = x - startX;
  const dy = y - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move("r");
    if (dx < -30) move("l");
  } else {
    if (dy > 30) move("d");
    if (dy < -30) move("u");
  }
}

/* Touch */
document.addEventListener("touchstart", e =>
  startSwipe(e.touches[0].clientX, e.touches[0].clientY)
);
document.addEventListener("touchend", e =>
  endSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
);

/* Mouse */
document.addEventListener("mousedown", e =>
  startSwipe(e.clientX, e.clientY)
);
document.addEventListener("mouseup", e =>
  endSwipe(e.clientX, e.clientY)
);

/* START */
init();
