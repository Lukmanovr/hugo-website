// Homepage art panel: a slowly drifting vector flow field drawn on vanilla
// canvas (no libraries). Loaded lazily by home_info.html after idle; skipped
// entirely under prefers-reduced-motion (static gradient fallback remains).
(function () {
  var el = document.getElementById('art-panel');
  if (!el) return;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  el.appendChild(canvas);

  var W, H;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = el.clientWidth;
    H = el.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // 2D value noise (deterministic, seedless)
  function hash(x, y) {
    var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }
  function fade(t) {
    return t * t * (3 - 2 * t);
  }
  function noise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    var a = hash(xi, yi), b = hash(xi + 1, yi);
    var c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    var u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  var GRID = 21;   // px between strokes
  var LEN = 8;     // stroke half-length
  var SCALE = 190; // noise field zoom
  var t = 0;

  // palettes follow the site theme; the toggle flips html[data-theme].
  // "trail" is the translucent fade-fill that lets moving strokes leave
  // a short ghost behind them instead of being hard-cleared every frame.
  var PALETTES = {
    dark: { bg: '#16140f', trail: 'rgba(22, 20, 15, 0.16)', stroke: '209, 73, 47' },
    light: { bg: '#f2f0eb', trail: 'rgba(242, 240, 235, 0.16)', stroke: '176, 52, 30' },
  };

  function currentPalette() {
    var mode = document.documentElement.dataset.theme;
    if (mode !== 'dark' && mode !== 'light') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return PALETTES[mode];
  }

  function draw(fade) {
    var pal = currentPalette();
    ctx.fillStyle = fade ? pal.trail : pal.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    for (var y = GRID / 2; y < H; y += GRID) {
      for (var x = GRID / 2; x < W; x += GRID) {
        var n = noise(x / SCALE + t, y / SCALE - t * 0.6);
        var angle = n * Math.PI * 4;
        var depth = noise(x / SCALE + 40, y / SCALE + 40);
        var dx = Math.cos(angle) * LEN;
        var dy = Math.sin(angle) * LEN;
        ctx.strokeStyle = 'rgba(' + pal.stroke + ', ' + (0.3 + depth * 0.55).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      }
    }
  }

  var running = false;
  var last = 0;

  function frame(now) {
    if (!running) return;
    if (now - last > 40) { // ~25 fps is plenty for this drift
      t += 0.0016;
      draw(true); // fade-fill: strokes leave a short trail
      last = now;
    }
    requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
  }

  resize();
  draw();
  window.addEventListener('resize', function () {
    resize();
    draw();
  });

  // repaint immediately when the theme toggle flips html[data-theme]
  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // animate only while the panel is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }).observe(el);
  } else {
    start();
  }
})();
