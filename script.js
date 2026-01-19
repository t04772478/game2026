const COLS = 4;
const ROWS = 5;
const gridEl = document.getElementById("grid");
const energyEl = document.getElementById("energy");

let energy = 50;
let grid = [];
let selected = null;

/* ---------- INIT ---------- */
function init() {
  grid = Array(ROWS * COLS).fill(0);
  spawn2();
  spawn2();
  render();
}
init();

/* ---------- SPAWN ---------- */
function spawn2() {
  const empty = grid
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  if (empty.length === 0) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  grid[idx] = 2;
}

/* ---------- RENDER ---------- */
function render() {
  gridEl.innerHTML = "";
  grid.forEach((value, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (value !== 0) {
      cell.textContent = value;
      cell.style.fontSize = Math.max(16, 36 - String(value).length * 4) + "px";
      cell.onclick = () => selectCell(i);
      if (selected === i) cell.classList.add("active");
    }
    gridEl.appendChild(cell);
  });
  energyEl.textContent = energy;
}

/* ---------- SELECT & MERGE ---------- */
function selectCell(index) {
  if (grid[index] === 0) return;

  if (selected === null) {
    selected = index;
  } else {
    if (selected !== index && grid[selected] === grid[index]) {
      grid[index] *= 2;
      grid[selected] = 0;
      selected = null;
      spawn2();
    } else {
      selected = index;
    }
  }
  render();
}

/* ---------- HELP ---------- */
document.getElementById("helpBtn").onclick = () =>
  document.getElementById("helpModal").classList.remove("hidden");

document.getElementById("closeHelp").onclick = () =>
  document.getElementById("helpModal").classList.add("hidden");

/* ---------- BUTTON STUBS (tayyor joylar) ---------- */
document.getElementById("energyPlus").onclick = () => {
  // 👉 bu yerga reklama kodi qo‘yiladi
  energy += 20;
  render();
};

document.getElementById("emptyBtn").onclick = () => {
  // 👉 reklama evaziga tanlangan katakni bo‘shatish
};

document.getElementById("x2Btn").onclick = () => {
  // 👉 24 soatda 3 marta x2 logikasi shu yerda
};

document.getElementById("donateBtn").onclick = () => {
  // 👉 3 ta reklama = donat
};

