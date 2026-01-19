// DOM
const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");
const clearBtn = document.getElementById("clear");
const boostBtn = document.getElementById("boost");
const donateBtn = document.getElementById("donate");

// State
let grid = Array(16).fill(0);
let score = 0;
let energy = 50;
let selected = null;
let clearMode = false;

// INIT
function init() {
  grid.fill(0);
  score = 0;
  energy = 50;
  spawn();
  spawn();
  render();
}

// SPAWN 2 or 4 ALWAYS
function spawn() {
  const empty = grid
    .map((v, i) => (v === 0 ? i : null))
    .filter(v => v !== null);

  if (!empty.length) return;

  const pos = empty[Math.floor(Math.random() * empty.length)];
  grid[pos] = Math.random() < 0.7 ? 2 : 4;
}

// RENDER
function render() {
  gridEl.innerHTML = "";
  grid.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (v) {
      cell.textContent = v;
      cell.setAttribute("v", v);
      cell.onclick = () => onCellClick(i);
    }

    if (i === selected) cell.classList.add("active");
    gridEl.appendChild(cell);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}

// CELL CLICK
function onCellClick(i) {
  if (clearMode) {
    grid[i] = 0;
    clearMode = false;
    spawn();
    render();
    return;
  }

  if (energy <= 0) {
    watchAd(5, () => {
      energy += 20;
      render();
    });
    return;
  }

  if (selected === null) {
    selected = i;
  } else {
    if (grid[selected] === grid[i] && selected !== i) {
      grid[i] *= 2;
      score += grid[i];
      grid[selected] = 0;
      energy--;
      spawn();
    }
    selected = null;
  }
  render();
}

// FAKE AD
function watchAd(seconds, cb) {
  alert(`Reklama: ${seconds} soniya`);
  setTimeout(cb, seconds * 1000);
}

// CLEAR BUTTON
clearBtn.onclick = () => {
  if (grid.includes(0)) return;
  watchAd(5, () => {
    clearMode = true;
    alert("Bo‘shatmoqchi bo‘lgan katakni tanlang");
  });
};

// BOOST BUTTON
boostBtn.onclick = () => {
  if (selected === null) return;
  watchAd(5, () => {
    watchAd(5, () => {
      grid[selected] *= 2;
      score += grid[selected];
      spawn();
      selected = null;
      render();
    });
  });
};

// DONATE
donateBtn.onclick = () => {
  watchAd(12, () => {
    energy += 50;
    render();
  });
};

// START
init();
