---
title: "On Topological Analysis of fs-LIMS Data"
date: 2021-08-23T11:30:03+00:00
# weight: 1
# aliases: ["/first"]
tags: ["Papers", "Frontiers"]
author: "Rustam A. Lukmanov"
# author: ["Me", "You"] # multiple authors
showToc: false
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Our paper published in Frontiers in Artificial Intelligence"
disableHLJS: false # to disable highlightjs
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowPostNavLinks: true
cover:
    image: /images/Frontiers/On_topological.webp # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: true # only hide on current single page

---

<div class="wrapper" style="display: flex; justify-content: left; align-items: center;">
    <img src="/images/Frontiers/On_topological.webp" alt="Topo paper" width="700" style="padding: 5px; box-shadow: 0 5px 5px rgba(0,0,0,0.45);">
</div>
  A randomly selected subset (70%) of spectral similarity networks used for an estimation of the robustness of the covering algorithm. A 92% Rand Index shows that network can be confidently segregated into two communities.

### [Paper](https://www.frontiersin.org/articles/10.3389/frai.2021.668163/full) / [PDF](/PDF/frai-04-668163.pdf)

### TL;DR

In this paper we present:

- a large-scale time-of-flight mass-spectra collection using the tiny space-type mass spectrometer
- a new preprocessing routines for robust baseline removal, noise suppression and spot-to-spot time-of-flight calibration. Overall we achieved a stunning 2 orders of magnitude SNR improvement over the raw spectra and large-scale baseline stability that showed no significant over and undershoots (thus, no artefactual variance in the processed data).
- fast spectral decomposition technique based on Simpson integration that allowed to reduce the dimensionality of the data from 64'000 down to 300 with virtually no loss in quality of pairwise distances.
- mass-spectrometric multi-element imaging of the Gunflint chert (2 billions years old) sample using a fs-ultraviolet laser for ion generation;
- first linear (PCA down to 100 pc's) and later non-linear dimensionality reduction (down to 6) and classification of the fs laser ablation ionization mass spectrometry (LIMS) imaging dataset.
- subsampling of the coarsened similarity network for robustness estimations of the Louvaine clustering results.
