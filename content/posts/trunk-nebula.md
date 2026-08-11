---
aliases: ["/posts/trunk_nebula/"]
title: "Remaking the Vanta trunk effect in p5.js"
date: 2023-05-17T15:30:03+00:00
tags: ["generative-art", "p5js"]
author: "Rustam A. Lukmanov"
description: "Recreating the 'trunk' generative animation from Vanta.js in p5.js."
showToc: false
ShowReadingTime: true
---

A p5.js recreation of the Vanta.js "trunk" effect — concentric, noise-driven rings drawn one ring at a time. An earlier version of this site ran the original effect as its homepage background; the flow-field panel on the current homepage is its quieter successor. The demo below generates a new pattern on every load:

<div class="wrapper">
  <div class="iframe-container" style="padding-bottom: 75%; position: relative; overflow: hidden;">
    <iframe loading="lazy" src="/vanta_nebula.html" style="height:100%;width:100%;position:absolute;top:0;left:0;" title="p5.js recreation of the Vanta trunk effect"></iframe>
  </div>
</div>
