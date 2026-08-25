(function () {
  "use strict";

  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");

  var COLORS = ["#f6d365", "#fda085", "#fbc2eb", "#a18cd1", "#ffffff"];

  var W, H;
  var pieces = [];
  var running = false;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pickColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function newPiece(x, y, spreadX) {
    var angle = rand(-Math.PI * 0.92, -Math.PI * 0.08);
    var speed = rand(7, 15);
    return {
      x: x + rand(-spreadX, spreadX),
      y: y,
      w: rand(6, 12),
      h: rand(8, 15),
      color: pickColor(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.14, 0.14),
      gravity: rand(0.16, 0.26)
    };
  }

  function burst(x, y, count, spreadX) {
    for (var i = 0; i < count; i++) pieces.push(newPiece(x, y, spreadX));
    startLoop();
  }

  function update(p) {
    p.vy += p.gravity;
    p.vx *= 0.992;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var j = pieces.length - 1; j >= 0; j--) {
      update(pieces[j]);
      draw(pieces[j]);
      if (pieces[j].y > H + 40 || pieces[j].x < -60 || pieces[j].x > W + 60) {
        pieces.splice(j, 1);
      }
    }
    if (pieces.length) {
      window.requestAnimationFrame(loop);
    } else {
      running = false;
    }
  }

  function startLoop() {
    if (!running) {
      running = true;
      window.requestAnimationFrame(loop);
    }
  }

  function celebration() {
    burst(W / 2, H * 0.72, 16, 30);
    window.setTimeout(function () { burst(W * 0.16, H * 0.85, 12, 24); }, 300);
    window.setTimeout(function () { burst(W * 0.84, H * 0.85, 12, 24); }, 600);
    window.setTimeout(function () { burst(W / 2, H * 0.55, 14, 40); }, 1100);
  }

  window.confettiCelebration = celebration;
})();
