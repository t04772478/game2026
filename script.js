const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

const size = 4;
let cells = [];
let score = 0;
let energy = 50;
let selectedIndex = null;

// ---------------- INIT ----------------
function init() {
  cells = Array(size * size).fill(0);
  score = 0;
  energy = 50;

  addRandom2();
  addRandom2();
  render();
}

function addRandom2() {
  const empty = cells
    .map((v, i) => v === 0 ? i : null)
    .filter(v => v !== null);

  if (empty.length === 0) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  cells[index] = 2;
}

// ---------------- RENDER ----------------
function render() {
  board.innerHTML = "";

  cells.forEach((value, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.dataset.index = index;

    if (value > 0) {
      div.textContent = value;
      div.dataset.value = value;
    }

    if (index === selectedIndex) {
      div.style.outline = "2px solid #fff";
    }

    div.onclick = () => onCellClick(index);
    board.appendChild(div);
  });

  scoreEl.textContent = score;
  energyEl.textContent = energy;
}

// ---------------- GAME LOGIC ----------------
function onCellClick(index) {
  if (cells[index] === 0) {
    selectedIndex = null;
    render();
    return;
  }

  if (selectedIndex === null) {
    selectedIndex = index;
  } else if (selectedIndex === index) {
    selectedIndex = null;
  } else {
    if (cells[selectedIndex] === cells[index]) {
      cells[index] *= 2;
      cells[selectedIndex] = 0;
      score += cells[index];
      addRandom2(); // HAR DOIM YANGI 2 CHIQADI
    }
    selectedIndex = null;
  }
  render();
}

// ---------------- BUTTONS ----------------
document.getElementById("emptyBtn").onclick = () => {
  alert("Bu funksiya keyin reklama bilan qo‘shiladi");
};

document.getElementById("x2Btn").onclick = () => {
  alert("x2 bonus keyin qo‘shiladi");
};

document.getElementById("donateBtn").onclick = () => {
  alert("Donat bonuslar keyin qo‘shiladi");
};

// ---------------- START ----------------
init();

