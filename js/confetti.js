(function () {
  "use strict";

  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");

  var COLORS = ["#f6d365", "#fda085", "#fbc2eb", "#a18cd1", "#ffffff"];
  var RAIN_COUNT = 26;
  var BURST_COUNT = 16;

  var W, H;
  var pieces = [];

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

  function rainPiece(fromTop) {
    return {
      type: "rain",
      x: rand(0, W),
      y: fromTop ? rand(-H * 0.2, -20) : rand(-H, H),
      w: rand(6, 13),
      h: rand(8, 16),
      color: pickColor(),
      vy: rand(0.8, 2.4),
      vx: rand(-0.6, 0.6),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.08, 0.08),
      swayPhase: rand(0, Math.PI * 2),
      swaySpeed: rand(0.01, 0.03),
      swayAmp: rand(0.4, 1.4)
    };
  }

  function burstPiece() {
    var angle = rand(-Math.PI, 0);
    var speed = rand(6, 15);
    return {
      type: "burst",
      x: W / 2,
      y: H * 0.38,
      w: rand(6, 13),
      h: rand(8, 16),
      color: pickColor(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.15, 0.15),
      gravity: rand(0.12, 0.22)
    };
  }

  function burst() {
    for (var i = 0; i < BURST_COUNT; i++) pieces.push(burstPiece());
  }

  for (var i = 0; i < RAIN_COUNT; i++) pieces.push(rainPiece(false));
  burst();

  function update(p) {
    p.swayPhase += p.swaySpeed;
    p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.type === "burst") {
      p.vy += p.gravity;
      p.vx *= 0.985;
      if (p.vy > 0 && p.y > H + 30) replace(p);
    } else if (p.y > H + 30) {
      replace(p);
    }
  }

  function replace(p) {
    var fresh = rainPiece(true);
    p.type = fresh.type;
    p.x = fresh.x;
    p.y = fresh.y;
    p.color = fresh.color;
    p.w = fresh.w;
    p.h = fresh.h;
    p.vy = fresh.vy;
    p.vx = fresh.vx;
    p.rot = fresh.rot;
    p.vr = fresh.vr;
    p.swayPhase = fresh.swayPhase;
    p.swaySpeed = fresh.swaySpeed;
    p.swayAmp = fresh.swayAmp;
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  var hidden = false;

  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
  });

  function frame() {
    if (!hidden) {
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < pieces.length; j++) {
        update(pieces[j]);
        draw(pieces[j]);
      }
    }
    window.requestAnimationFrame(frame);
  }

  frame();

  window.setInterval(function () {
    if (!hidden) burst();
  }, 24000);
})();
