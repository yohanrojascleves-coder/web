let current = 0;
const pages = document.querySelectorAll(".page");
let typingInterval;

function showPage(index){
    pages.forEach(p => p.classList.remove("active"));
    pages[index].classList.add("active");

    const text = pages[index].querySelector(".type");
    if(text) typeText(text);

    createHeartBurst(30);

    const book = document.querySelector(".book");
    book.style.animation = "pageFlipBounce 0.6s ease-in-out";
    setTimeout(()=>{ book.style.animation = "bookBreath 8s ease-in-out infinite"; }, 600);
}

function nextPage(){ if(current < pages.length-1){ current++; showPage(current); } }
function prevPage(){ if(current > 0){ current--; showPage(current); } }

function typeText(element){
    clearInterval(typingInterval);
    const text = element.dataset.text || element.innerHTML;
    element.dataset.text = text;
    element.innerHTML = "";
    let i = 0;
    typingInterval = setInterval(()=>{
        element.innerHTML += text[i];
        i++;
        if(i >= text.length) clearInterval(typingInterval);
    }, 20);
}

/* ===== CANVAS ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
resize(); window.addEventListener("resize",resize);

let particles=[]; let hearts=[]; 
let colors=["#8a2be2","#9400d3","#ff00ff","#ff1493","#000000","#888888","#ffffff"];
let floatParticles=[];

// Partículas estáticas
for(let i=0;i<100;i++){ particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,color:colors[Math.floor(Math.random()*colors.length)],baseX:null,baseY:null}); }
particles.forEach(p=>{p.baseX=p.x; p.baseY=p.y;});

// Partículas flotantes nuevas
for(let i=0;i<60;i++){ floatParticles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+2,color:colors[Math.floor(Math.random()*colors.length)],dx:(Math.random()-0.5)*0.3,dy:(Math.random()-0.5)*0.3});}

// Movimiento partículas y corazones con mouse
canvas.addEventListener("mousemove",e=>{
    let mouseX=e.clientX, mouseY=e.clientY;
    particles.forEach(p=>{ let dx=(mouseX-p.baseX)*0.02, dy=(mouseY-p.baseY)*0.02; p.x=p.baseX+dx; p.y=p.baseY+dy; });
    hearts.push({x:mouseX,y:mouseY,size:Math.random()*15+10,speed:Math.random()*0.5+0.3,color:colors[Math.floor(Math.random()*colors.length)],alpha:1});
});

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Fondo nebulosa
    let grad=ctx.createRadialGradient(canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width);
    grad.addColorStop(0,"#8a2be2");
    grad.addColorStop(0.3,"#ff1493");
    grad.addColorStop(0.6,"#000000");
    grad.addColorStop(1,"#ffffff");
    ctx.fillStyle=grad; ctx.fillRect(0,0,canvas.width,canvas.height);

    // Partículas estáticas
    particles.forEach(p=>{ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill();});

    // Partículas flotantes
    floatParticles.forEach(fp=>{
        fp.x+=fp.dx; fp.y+=fp.dy;
        if(fp.x<0) fp.x=canvas.width; if(fp.x>canvas.width) fp.x=0;
        if(fp.y<0) fp.y=canvas.height; if(fp.y>canvas.height) fp.y=0;
        ctx.beginPath(); ctx.arc(fp.x,fp.y,fp.r,0,Math.PI*2); ctx.fillStyle=fp.color; ctx.fill();
    });

    // Corazones
    hearts.forEach((h,i)=>{
        ctx.save(); ctx.globalAlpha=h.alpha; ctx.translate(h.x,h.y); ctx.scale(h.size/20,h.size/20);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(0,-3,-5,-15,-10,-15); ctx.bezierCurveTo(-20,-15,-20,0,-20,0); ctx.bezierCurveTo(-20,15,0,25,0,35); ctx.bezierCurveTo(0,25,20,15,20,0); ctx.bezierCurveTo(20,-15,10,-15,10,-15); ctx.bezierCurveTo(5,-15,0,-3,0,0); ctx.closePath(); ctx.fillStyle=h.color; ctx.fill(); ctx.restore();
        h.alpha-=0.01; h.y-=h.speed; if(h.alpha<=0) hearts.splice(i,1);
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();

function createHeartBurst(amount=10){ for(let i=0;i<amount;i++){hearts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*15+10,speed:Math.random()*0.5+0.3,color:colors[Math.floor(Math.random()*colors.length)],alpha:1});}}
showPage(current);
