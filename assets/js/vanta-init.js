// Initializes the Vanta "trunk" animation inside the homepage art panel.
// Loaded lazily by home_info.html after p5 + vanta.trunk are available.
(function () {
  var el = document.getElementById('vanta-background');
  if (!el || !window.VANTA || !window.VANTA.TRUNK) return;

  // Ring spacing scales with the panel's aspect ratio so the trunk fills the
  // card without clipping.
  var ratio = el.clientHeight / Math.max(el.clientWidth, 1);
  var spacing = Math.min(1.75, Math.max(0.8, ratio * 2.2));

  var effect = window.VANTA.TRUNK({
    el: el,
    mouseControls: true,
    touchControls: false,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.5,
    scaleMobile: 2.0,
    color: 0xc3402b,
    backgroundColor: 0x1b1814,
    chaos: 1.75,
    spacing: spacing,
  });

  window.addEventListener('pagehide', function () {
    if (effect) effect.destroy();
  });
})();
