// Initializes the Vanta "trunk" homepage background.
// Loaded lazily by home_info.html after p5 + vanta.trunk are available.
(function () {
  var el = document.getElementById('vanta-background');
  if (!el || !window.VANTA || !window.VANTA.TRUNK) return;

  // Ring spacing scales with the viewport aspect ratio (portrait screens get
  // a tighter trunk so it stays inside the visible area).
  var ratio = window.innerHeight / window.innerWidth;
  var spacing = Math.min(1.75, Math.max(1, ratio));

  var effect = window.VANTA.TRUNK({
    el: el,
    mouseControls: true,
    touchControls: false,
    gyroControls: false,
    minHeight: 400.0,
    minWidth: 400.0,
    scale: 1.5,
    scaleMobile: 2.0,
    color: 0xff3000,
    backgroundColor: 0x1d1e20,
    chaos: 2,
    spacing: spacing,
  });

  window.addEventListener('pagehide', function () {
    if (effect) effect.destroy();
  });
})();
