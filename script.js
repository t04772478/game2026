/***********************
 * 2026 – FINAL LOGIC
 ***********************/

const SIZE = 4;
const TOTAL = SIZE * SIZE;

let grid = [];
let score = 0;
let energy = 50;
let selectedIndex = null;

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  grid = Array(TOTAL).fill(0);
  startGame();
});

/* START */
function startGame() {
  grid.fill(0);
  score = 0;
  energy = 50;
  selectedIndex = null;

  spawnTwos(2);
  render();
}

/* SPAWN LOGIC */
function spawnTwos(count) {
  const empty = grid
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  const spawnCount = Math.min(count, empty.length);

  for (let i = 0; i < spawnCount; i++) {
    const index = empty.splice(
      Math.floor(Math.random() * empty.length), 1
    )[0];
    grid[index] = 2;
  }
}

/* CLICK */
function onCellClick(index) {
  if (grid[index] === 0) return;

  if (selectedIndex === null) {
    selectedIndex = index;
    render();
    return;
  }

  if (selectedIndex === index) {
    selectedIndex = null;
    render();
    return;
  }

  tryMerge(selectedIndex, index);
}

/* MERGE */
function tryMerge(a, b) {
  if (grid[a] !== grid[b]) {
    selectedIndex = null;
    render();
    return;
  }

  const newVal = grid[b] * 2;
  grid[b] = newVal;
  grid[a] = 0;

  score += newVal;
  energy = Math.max(energy - 1, 0);
  selectedIndex = null;

  const emptyCount = grid.filter(v => v === 0).length;

  if (emptyCount >= 2) {
    spawnTwos(2);
  } else if (emptyCount === 1) {
    spawnTwos(1);
  }

  render();
}

/* EMPTY CELL TOOL */
function useEmptyCell() {
  if (selectedIndex === null) {
    alert("Avval katak tanlang");
    return;
  }

  const choices = [2, 4, 8, 16, 32, 64];
  const newValue = prompt(
    "Qaysi songa almashtiramiz?\n" + choices.join(", ")
  );

  const num = Number(newValue);
  if (!choices.includes(num)) return;

  grid[selectedIndex] = num;
  selectedIndex = null;
  render();
}

/* X2 */
function useX2() {
  if (selectedIndex === null) {
    alert("Katak tanlang");
    return;
  }

  grid[selectedIndex] *= 2;
  selectedIndex = null;
  render();
}

/* DONATE */
function donate() {
  alert("Reklama 1/3");
  setTimeout(() => {
    alert("Reklama 2/3");
    setTimeout(() => {
      alert("Reklama 3/3\nRahmat ❤️");
    }, 800);
  }, 800);
}

/* RENDER */
function render() {
  const board = document.getElementById("board");
  const scoreEl = document.getElementById("score");
  const energyEl = document.getElementById("energy");

  board.innerHTML = "";

  grid.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (v > 0) {
      cell.textContent = v;
      cell.classList.add("v" + v);
    }

    if (i === selectedIndex) {
      cell.classList.add("selected");
    }

    cell.onclick = () => onCellClick(i);
    board.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}
