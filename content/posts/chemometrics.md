---
title: "Towards empirical biosignatures using LIMS"
date: 2021-03-23T11:30:03+00:00
tags: ["papers", "chemometrics", "machine-learning"]
author: "Rustam A. Lukmanov"
description: "Our paper in the Journal of Chemometrics: weighted mass-correlation networks separate Precambrian kerogen from its host mineral."
showToc: false
ShowReadingTime: true
cover:
  image: /images/Frontiers/image26.webp
  alt: "Weighted mass-correlation network of a two-entity inclusion"
  hidden: true
---

{{< figure src="/images/Frontiers/chemometrics.webp" alt="Weighted mass-correlation network of a two-entity inclusion" caption="Ion yields from a two-entity inclusion, extracted from the chemical depth profile. Colour groupings identify elements with high affinity — CH-rich kerogen and the silicate chert; the loosely connected molecular ions at the periphery are plasma-chemistry byproducts formed on the way to the detector." >}}

{{< figure src="/images/Frontiers/pca_cube.webp" alt="Decision boundaries plotted over PCA-reduced spectra" caption="Decision boundaries on PCA-reduced spectra." >}}

### [Paper](https://doi.org/10.1002/cem.3370) / [PDF](/PDF/Chemometrics_Lukmanov.pdf)

### TL;DR

In this paper we present:

- Weighted mass-correlation networks (WMCN) that identify inclusions within the bulk of the analyte material.
- A sliding-window centrality measure, and a divergence of the modularity score wherever a spot contains more than one chemical entity.
- Kernel density estimation over ion-intensity regions for specific compounds.
- The Van Krevelen metric for separating organic and inorganic materials.
- PCA scores and loadings for the chemical compounds identified in the sample.
- A competitive test of 25 supervised machine-learning models, reaching 99% accuracy in separating bio-organic Precambrian kerogen from the inorganic host mineral.
