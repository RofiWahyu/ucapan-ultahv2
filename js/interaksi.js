(function () {
  "use strict";

  var HEARTS = ["\uD83D\uDC96", "\u2728", "\uD83D\uDC95", "\uD83C\uDF1F", "\uD83E\uDEC0"];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add("visible");
        window.setTimeout(function () { el.style.transitionDelay = "0s"; }, 900);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  document.querySelectorAll(".gallery .photo-card").forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.12) + "s";
  });

  function spawnHeart(x, y) {
    var heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.fontSize = rand(14, 30) + "px";
    heart.style.setProperty("--dx", rand(-70, 70) + "px");
    heart.style.animationDuration = rand(1.1, 1.9) + "s";
    document.body.appendChild(heart);
    window.setTimeout(function () { heart.remove(); }, 2000);
  }

  document.querySelectorAll(".note-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      for (var i = 0; i < 10; i++) {
        spawnHeart(e.clientX + rand(-20, 20), e.clientY + rand(-14, 14));
      }
    });
  });

  function activePhotos() {
    return Array.prototype.filter.call(
      document.querySelectorAll(".photo-card"),
      function (card) { return card.querySelector("img"); }
    );
  }

  var overlay = null;
  var lbImg = null;
  var lbCaption = null;
  var currentIndex = 0;

  function buildLightbox() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Pratinjau foto");
    overlay.innerHTML =
      '<button class="lb-close" aria-label="Tutup">\u00D7</button>' +
      '<button class="lb-prev" aria-label="Foto sebelumnya">\u2039</button>' +
      "<figure><img alt=\"\"><figcaption></figcaption></figure>" +
      '<button class="lb-next" aria-label="Foto berikutnya">\u203A</button>';
    lbImg = overlay.querySelector("img");
    lbCaption = overlay.querySelector("figcaption");

    overlay.querySelector(".lb-close").addEventListener("click", closeLightbox);
    overlay.querySelector(".lb-prev").addEventListener("click", function () {
      stepLightbox(-1);
    });
    overlay.querySelector(".lb-next").addEventListener("click", function () {
      stepLightbox(1);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.body.appendChild(overlay);
  }

  function showPhoto(index) {
    var photos = activePhotos();
    if (!photos.length) return;
    currentIndex = ((index % photos.length) + photos.length) % photos.length;
    var img = photos[currentIndex].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent =
      photos[currentIndex].querySelector("figcaption").textContent;
  }

  function openLightbox(card) {
    if (!overlay) buildLightbox();
    var photos = activePhotos();
    currentIndex = photos.indexOf(card);
    showPhoto(currentIndex);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    showPhoto(currentIndex + delta);
  }

  document.querySelectorAll(".photo-card").forEach(function (card) {
    card.addEventListener("click", function () {
      if (card.querySelector("img")) {
        openLightbox(card);
      } else {
        card.classList.remove("wiggle");
        void card.offsetWidth;
        card.classList.add("wiggle");
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
})();
