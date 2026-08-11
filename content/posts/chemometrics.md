---
title: "Towards empirical biosignatures using LIMS"
date: 2021-03-23T11:30:03+00:00
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
description: "Our paper published in the Wiley Chemometrics journal"
disableHLJS: false # to disable highlightjs
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowPostNavLinks: true
cover:
    image: /images/Frontiers/image26.webp # image path/url
    alt: "Correlation graph from measured inclusions" # alt text
    caption: "Correlation graph from measured inclusions" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: true # only hide on current single page

---

<div class="wrapper" style="display: flex; justify-content: left; align-items: center;">
    <img src="/images/Frontiers/chemometrics.webp" width="700" style="padding: 5px; border-radius: 10px; drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5));">
</div>
Ion yields measured from the two-entity inclusion extracted from the chemical depth profile. Color groupings identifies elements with high affinity (i.e., CH-rich kerogen and silicate chert. Molecular ions loosely connected on the sides identifies the plasma chemistry byproducts originated on the way to the detector. Second image - decision borderlines on PCA reduced spectra.  
<div class="wrapper" style="display: flex; justify-content: left; align-items: center;">
    <img src="/images/Frontiers/pca_cube.webp" width="700" style="padding: 5px; border-radius: 10px; box-shadow: 0 5px 5px rgba(0,0,0,0.45);">
</div>

### [Paper](https://analyticalsciencejournals.onlinelibrary.wiley.com/doi/full/10.1002/cem.3370) / [PDF](/PDF/Chemometrics_Lukmanov.pdf)

### TL;DR

In this paper we present:

- weighted mass correlation networks (WMCN) identified for inclusions in the bulk of the analyte material
- sliding window centrality measure and a divergence of the modularity score on spots with more that one chemical entities present
- kernel density estimation on ion-intensity regions for specific compounds
- Van-Krevelen metric for organic vs. inorganic materials
- PCA scores and loadings for chemical compounds identified in the sample
- We performed a competitive test of 25 supervised machine learning models to achieve a 99% accuracy rates for identification of investigated materials (bio-organic Precambrian kerogen vs. inorganic host mineral)
