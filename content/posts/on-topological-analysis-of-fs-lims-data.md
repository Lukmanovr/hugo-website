---
title: "On Topological Analysis of fs-LIMS Data"
date: 2021-08-23T11:30:03+00:00
tags: ["papers", "frontiers", "machine-learning"]
author: "Rustam A. Lukmanov"
description: "Our paper in Frontiers in Artificial Intelligence: topological methods for in-situ planetary mass spectrometry."
showToc: false
ShowReadingTime: true
cover:
  image: /images/Frontiers/On_topological.webp
  alt: "Subsampled spectral similarity networks"
  hiddenInSingle: true
---

{{< figure src="/images/Frontiers/On_topological.webp" alt="Subsampled spectral similarity networks" caption="A randomly selected 70% subset of spectral similarity networks, used to estimate the robustness of the covering algorithm. A Rand index of 92% shows the network segregates confidently into two communities." >}}

### [Paper](https://www.frontiersin.org/articles/10.3389/frai.2021.668163/full) / [PDF](/PDF/frai-04-668163.pdf)

### TL;DR

In this paper we present:

- A large-scale collection of time-of-flight mass spectra from a miniature space-type mass spectrometer.
- New preprocessing routines for robust baseline removal, noise suppression, and spot-to-spot time-of-flight calibration — two orders of magnitude improvement in SNR over the raw spectra, with large-scale baseline stability and no artefactual variance in the processed data.
- A fast spectral decomposition based on Simpson integration, reducing dimensionality from 64,000 to 300 with virtually no loss in the quality of pairwise distances.
- Multi-element mass-spectrometric imaging of the two-billion-year-old Gunflint chert, using a femtosecond ultraviolet laser for ion generation.
- Linear (PCA, to 100 components) followed by nonlinear dimensionality reduction (to 6) and classification of the fs-LIMS imaging dataset.
- Subsampling of the coarsened similarity network to estimate the robustness of the Louvain clustering results.
