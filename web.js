const canvas = document.getElementById("dotGrid");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
let rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
canvas.style.width = rect.width + "px";
canvas.style.height = rect.height + "px";
ctx.scale(dpr, dpr);

ctx.imageSmoothingEnabled = false;
ctx.antialiasing = "subpixel";

const spacing = 45;
const dots = [];
const mouse = { x: 0, y: 0 };

for (let x = 0; x < rect.width; x += spacing) {
  for (let y = 0; y < rect.height; y += spacing) {
    dots.push({
      x: x,
      y: y,
      baseX: x,
      baseY: y,
      vx: 0,
      vy: 0,
      baseSize: 2.5
    });
  }
}

window.addEventListener("mousemove", e => {
  rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

window.addEventListener("resize", () => {
  const dpr = window.devicePixelRatio || 1;
  rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.scale(dpr, dpr);
});

function draw() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, rect.width, rect.height);

  for (let dot of dots) {
    const dx = mouse.x - dot.baseX;
    const dy = mouse.y - dot.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 140;

    if (dist < maxDist) {
      const angle = Math.atan2(dy, dx);
      const force = 1 - (dist / maxDist);
      const pushForce = force * 30;
      
      dot.vx = -Math.cos(angle) * pushForce;
      dot.vy = -Math.sin(angle) * pushForce;
    } else {
      dot.vx *= 0.9;
      dot.vy *= 0.9;
    }

    dot.x = dot.baseX + dot.vx;
    dot.y = dot.baseY + dot.vy;

    let size = dot.baseSize;
    if (dist < maxDist) {
      const proximity = 1 - (dist / maxDist);
      size = dot.baseSize + proximity * 3;
    }

    let t = Math.max(0, 1 - (dist / maxDist));
    let alpha = 0.3 + t * 0.7;
    ctx.fillStyle = `rgba(74, 144, 226, ${alpha})`;

    
    ctx.beginPath();
    ctx.arc(Math.round(dot.x), Math.round(dot.y), size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();

draw();

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.border');
  const navLinks = document.querySelectorAll('.nav-right a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 70) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});