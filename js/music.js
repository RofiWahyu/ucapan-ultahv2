(function () {
  "use strict";

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  var ctx = new AudioCtx();
  var master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  var NOTES = {
    G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25,
    F5: 698.46, G5: 783.99
  };

  var MELODY = [
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
    ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3]
  ];

  var BEAT = 0.42;
  var PAUSE_AFTER = 1.4;

  function playNote(freq, start, dur) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.28, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.92);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + dur);
  }

  function scheduleMelody(t0) {
    var t = t0;
    for (var i = 0; i < MELODY.length; i++) {
      var note = MELODY[i];
      playNote(NOTES[note[0]], t, note[1] * BEAT * 0.95);
      t += note[1] * BEAT;
    }
    return t - t0;
  }

  function loop() {
    if (!muted) {
      var total = scheduleMelody(ctx.currentTime + 0.05);
      window.setTimeout(loop, (total + PAUSE_AFTER) * 1000);
    } else {
      window.setTimeout(loop, 500);
    }
  }

  var muted = false;

  function tryStart() {
    if (ctx.state === "running") return true;
    ctx.resume();
    if (ctx.state === "running") return true;
    return false;
  }

  function onFirstInteraction() {
    document.removeEventListener("pointerdown", onFirstInteraction);
    document.removeEventListener("keydown", onFirstInteraction);
    if (ctx.state !== "running") ctx.resume();
    if (!started) {
      started = true;
      loop();
    }
  }

  var started = false;
  var btn = document.getElementById("musicToggle");

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    muted = !muted;
    master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
    btn.textContent = muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    btn.setAttribute("aria-label", muted ? "Nyalakan musik" : "Matikan musik");
    if (!muted && !started) onFirstInteraction();
  });

  if (tryStart()) {
    started = true;
    loop();
  } else {
    document.addEventListener("pointerdown", onFirstInteraction);
    document.addEventListener("keydown", onFirstInteraction);
  }
})();
