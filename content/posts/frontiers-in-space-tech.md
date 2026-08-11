---
title: "High Mass Resolution fs-LIMS Imaging and Manifold Learning"
date: 2022-05-03T11:30:03+00:00
tags: ["papers", "frontiers", "machine-learning"]
author: "Rustam A. Lukmanov"
description: "Our paper in Frontiers in Space Technologies: unsupervised analysis of 40,000 mass spectra from the Gunflint chert."
showToc: false
ShowReadingTime: true
cover:
  image: /images/Frontiers/Eigenvector_centrality_40K_mapper-FA2.webp
  alt: "Spectral proximity network coloured by eigenvector centrality"
  hiddenInSingle: true
---

{{< figure src="/images/Frontiers/Averaged_image_degree1.webp" alt="Spectral proximity network coloured by node degree" caption="Spectral proximity network of the partially averaged mass-spectrometric image (40,000 mass spectra, 260 unit masses), coloured by node degree — the number of edges connected to each node." >}}

### [Paper](https://www.frontiersin.org/articles/10.3389/frspt.2022.718943/full) / [PDF](/PDF/frspt-03-718943.pdf)

### TL;DR

In this paper we present:

- Multi-element imaging of the two-billion-year-old Gunflint chert.
- Unsupervised analysis of 40,000 mass spectra — downsampled from a 100,000-spectrum databank — using nonlinear dimensionality reduction and topological coarsening.
- Hierarchical density-based clustering on node-coordinate embeddings to quantify the chemical entities present.
- Mineralogical interpretation of the ionization profiles of the resulting clusters.
