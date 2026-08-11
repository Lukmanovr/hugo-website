---
title: "Depth vs recursion: outperforming transformers in jigsaw reconstruction"
date: 2026-04-26T10:00:00+03:00
tags: ["papers", "workshops", "AI", "recursion"]
author: "Rustam A. Lukmanov"
description: "Our short paper with students at the ICLR 2026 Workshop on AI with Recursive Self-Improvement: tiny recursive models beat much larger transformers on spatial reasoning."
showToc: false
ShowReadingTime: true
---

A short paper written with my students at the Data Science and AI Institute, presented at the [ICLR 2026 Workshop on AI with Recursive Self-Improvement](https://recursive-workshop.github.io/) in Rio de Janeiro.

The question is simple to state: when a model needs to reason, is it better to stack more layers, or to think longer with the layers it has? We compare Tiny Recursive Models (TRM) — which refine a latent "thought" vector over repeated passes — against standard encoder-only transformers on jigsaw puzzle reconstruction, a task that demands global spatial reasoning.

### [Paper](https://openreview.net/forum?id=1zDG1o16xB)

### TL;DR

In this paper we present:

- A head-to-head benchmark of Tiny Recursive Models against encoder-only transformers on jigsaw reconstruction of increasing grid sizes.
- On trivial grids (up to 3×3) the architectures are comparable; as complexity grows, transformer performance collapses while TRM keeps scaling — on a tight parameter budget.
- TRMs show "abrupt learning" phase transitions during training: performance jumps discontinuously once the recursive computation clicks into place.
- The takeaway: latent recursion buys a qualitative leap in reasoning depth that simply stacking transformer layers does not.
