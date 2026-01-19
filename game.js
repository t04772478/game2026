let grid = Array(16).fill(0);
let score = 0;
let energy = 50;
let selected = null;
let clearMode = false;

/* INIT */
function init(){
  grid.fill(0);
  score = 0;
  energy = 50;
  autoSpawn();
  autoSpawn();
  render();
}

/* AUTO SPAWN ALWAYS */
function autoSpawn(){
  let empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);
  if(!empty.length) return;
  const pos = empty[Math.floor(Math.random()*empty.length)];
  grid[pos] = Math.random()<0.7 ? 2 : 4;
}

/* RENDER */
function render(){
  gridEl.innerHTML="";
  grid.forEach((v,i)=>{
    const c=document.createElement("div");
    c.className="cell";
    if(v){
      c.textContent=v;
      c.setAttribute("v",v);
      c.onclick=()=>cellClick(i);
    }
    if(i===selected) c.classList.add("active");
    gridEl.appendChild(c);
  });
  scoreEl.textContent=score;
  energyEl.textContent=energy;
}

/* CELL CLICK */
function cellClick(i){
  if(clearMode){
    grid[i]=0;
    clearMode=false;
    autoSpawn();
    render();
    return;
  }

  if(energy<=0) return;

  if(selected===null){
    selected=i;
  }else{
    if(grid[selected]===grid[i] && selected!==i){
      grid[i]*=2;
      score+=grid[i];
      grid[selected]=0;
      energy--;
      autoSpawn();
    }
    selected=null;
  }
  render();
}

/* FAKE AD */
function watchAd(seconds, cb){
  alert(`Reklama: ${seconds} soniya`);
  setTimeout(cb, seconds*1000);
}

/* ENERGY AD */
if(energy<=0){
  watchAd(5,()=>{
    energy+=20;
    render();
  });
}

/* CLEAR BUTTON */
clear.onclick=()=>{
  if(grid.includes(0)) return;
  watchAd(5,()=>{ clearMode=true; alert("Bo‘shatmoqchi bo‘lgan katakni tanlang"); });
};

/* BOOST BUTTON */
boost.onclick=()=>{
  if(selected===null) return;
  watchAd(5,()=>{
    watchAd(5,()=>{
      grid[selected]*=2;
      score+=grid[selected];
      autoSpawn();
      selected=null;
      render();
    });
  });
};

/* DONATE */
donate.onclick=()=>{
  watchAd(12,()=>{
    energy+=50;
    render();
  });
};

init();
