// Homepage art panel: a drifting vector flow field on vanilla canvas.
// Curved streamline strokes with depth-based weight and colour, short motion
// trails, and a gentle swirl around the cursor. Loaded lazily by
// home_info.html after idle; reduced-motion visitors keep the static CSS
// gradient. Palettes follow the site theme (html[data-theme]).
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

  var GRID = 22;    // px between streamline seeds
  var SCALE = 190;  // noise field zoom
  var STEPS = 3;    // segments per streamline (curved strokes)
  var t = 0;

  // "trail" is the translucent fade-fill that lets moving strokes leave a
  // short ghost; deep/base/bright are the depth-graded stroke colours and
  // spark is the rare highlight.
  var PALETTES = {
    dark: {
      bg: '#16140f',
      trail: 'rgba(22, 20, 15, 0.16)',
      deep: [163, 52, 35],
      base: [209, 73, 47],
    },
    light: {
      bg: '#f2f0eb',
      trail: 'rgba(242, 240, 235, 0.16)',
      deep: [140, 42, 26],
      base: [176, 52, 30],
    },
  };

  function currentPalette() {
    var mode = document.documentElement.dataset.theme;
    if (mode !== 'dark' && mode !== 'light') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return PALETTES[mode];
  }

  function mix(a, b, k) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * k),
      Math.round(a[1] + (b[1] - a[1]) * k),
      Math.round(a[2] + (b[2] - a[2]) * k),
    ];
  }

  // gentle swirl around the cursor
  var mx = null, my = null;
  el.addEventListener('mousemove', function (e) {
    var r = el.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  el.addEventListener('mouseleave', function () {
    mx = null;
    my = null;
  });
  var SWIRL_R = 140;

  function draw(fadeFill) {
    var pal = currentPalette();
    ctx.fillStyle = fadeFill ? pal.trail : pal.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round';

    for (var gy = GRID / 2; gy < H; gy += GRID) {
      for (var gx = GRID / 2; gx < W; gx += GRID) {
        // deterministic jitter breaks the grid regularity
        var jx = hash(gx, gy), jy = hash(gy, gx);
        var x = gx + (jx - 0.5) * GRID * 0.8;
        var y = gy + (jy - 0.5) * GRID * 0.8;

        var depth = noise(x / SCALE + 40, y / SCALE + 40);
        var seg = (5 + depth * 5) * 2 / STEPS;

        var col = mix(pal.deep, pal.base, depth);
        var alpha = 0.4 + depth * 0.35;
        ctx.strokeStyle = 'rgba(' + col[0] + ', ' + col[1] + ', ' + col[2] + ', ' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1 + depth * 0.4;

        // walk a short streamline along the field: curved, not a straight tick
        ctx.beginPath();
        var px = x, py = y;
        ctx.moveTo(px, py);
        for (var s = 0; s < STEPS; s++) {
          var angle = noise(px / SCALE + t, py / SCALE - t * 0.6) * Math.PI * 4;
          if (mx !== null) {
            var dx0 = px - mx, dy0 = py - my;
            var dist = Math.sqrt(dx0 * dx0 + dy0 * dy0);
            if (dist < SWIRL_R) {
              angle += (1 - dist / SWIRL_R) * 1.3;
            }
          }
          px += Math.cos(angle) * seg;
          py += Math.sin(angle) * seg;
          ctx.lineTo(px, py);
        }
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

  // repaint opaquely the moment the theme toggle flips html[data-theme]
  new MutationObserver(function () {
    draw();
  }).observe(document.documentElement, {
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
