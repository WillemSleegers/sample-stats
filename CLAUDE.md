# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sample Stats is a Next.js 16 application for visualizing statistical distributions through interactive real-time sampling. Users can sample from various distributions (Normal, Uniform, Log-Normal, PERT, Beta, Metalog) and see histograms update dynamically with optional theoretical PDF curves and descriptive statistics.

The application uses **webR** - R compiled to WebAssembly - to leverage R's battle-tested statistical distribution functions directly in the browser.

**Tech Stack:**
- Next.js 16 with Turbopack (default bundler)
- React 19 with React Compiler
- Recharts 3.x for data visualization
- webR for statistical computing
- Shadcn/ui components with Tailwind CSS

## Architecture

### Core Sampling Flow

The application follows an interval-based sampling architecture:

1. **WebR Initialization** (hooks/use-webr.ts): Singleton webR instance initialized on app load using React hooks
2. **State Management** (app/page.tsx): Main component manages distribution parameters, sampling state, and UI preferences
3. **Sample Generation** (lib/draw.ts): Async function that calls R's distribution functions via webR (rnorm, runif, rlnorm, rbeta, etc.)
4. **Visualization** (components/graphs/histogram.tsx): Recharts-based histogram with optional theoretical PDF overlay
5. **Statistics** (lib/utils.ts): Single-pass calculation of descriptive statistics (mean, median, std dev, percentiles)

### Key Architectural Patterns

**Interval-Based Sampling**: Two separate intervals control the app:

- Sampling interval: Adds new samples at configurable speeds (50ms-1000ms) via `addSamples()`
- Statistics interval: Updates stats every 1000ms via `updateStats()`

**React Compiler Optimization**: The project uses React 19's compiler (enabled in next.config.mjs with `reactCompiler: true`). Avoid manual `useMemo` - the compiler automatically optimizes expensive computations.

**Type-Safe Distribution Parameters**: Each distribution has its own parameter type (ParamsNormal, ParamsUniform, etc.) unified via the `Parameters` discriminated union in lib/types.ts.

**WebR Integration**: The app uses a singleton pattern for webR initialization to ensure only one instance runs across the app. The `draw()` function is async and properly manages R object lifecycles with try/finally blocks.

### Distribution Implementation

The `draw()` function in lib/draw.ts uses webR to execute R code for sampling:

- **Normal, Uniform, Log-Normal, Beta**: Direct R function calls (`rnorm`, `runif`, `rlnorm`, `rbeta`)
- **PERT**: Implemented using R's `rbeta` with PERT-specific parameter transformations
- **Metalog** (lib/distributions/rmetalog.ts): Custom JavaScript implementation using three-point quantile parameterization with optional bounds (unbounded, semi-lower, semi-upper, or bounded)

All webR results are properly converted to JavaScript arrays using `toArray()` and R objects are destroyed after use to prevent memory leaks.

### PDF Calculation

The lib/pdf.ts module provides async PDF calculations using webR:

- `calculatePdfValues(webR, xValues, params)`: Async function that evaluates PDF at multiple x values using R's density functions (dnorm, dunif, dlnorm, dbeta)
- PERT distribution uses R's `dbeta` with transformed parameters
- Metalog uses custom numerical differentiation of the quantile function (no native R implementation)
- The histogram component calculates PDF values asynchronously via useEffect and updates when parameters change

### Histogram PDF Overlay

The histogram component (components/graphs/histogram.tsx) uses a **dual-chart overlay approach** to display both histogram bars and smooth PDF curves:

**Architecture:**
- **Bottom layer**: BarChart with categorical X-axis for histogram bars
- **Top layer**: LineChart with numeric X-axis for smooth PDF curve, positioned absolutely with CSS

**Why this approach:**
- Recharts cannot effectively mix categorical (bars) and numeric (smooth lines) on a single X-axis
- Categorical axis: Proper bar width, but can't do fractional positioning for smooth curves
- Numeric axis: Smooth curves, but bars render incorrectly

**Implementation:**
- Histogram: Simple data `[{index: 0, count: 5}, {index: 1, count: 12}, ...]`
- PDF: High-resolution data `[{index: 0, pdf: 38.5}, {index: 0.02, pdf: 39.1}, ...]` with 4× binCount points (min 50)
- Both charts share Y-axis domain `[0, maxY * 1.1]` for vertical alignment
- PDF overlay uses `pointer-events-none` so interactions pass through to histogram

**PDF Scaling:** The PDF values are scaled using `pdfValue × binWidth × totalSamples` to convert probability density to expected counts, matching the histogram's scale.

See PDF_OVERLAY_FIX.md for detailed technical documentation.

### UI State Persistence

User preferences are persisted to localStorage via the `use-local-storage` hook:

- Speed setting
- Show statistics toggle
- Bin count
- Auto bin count (Sturges' rule) toggle
- Show PDF toggle

## Project Structure

```
app/
  page.tsx          # Main application component
  layout.tsx        # Root layout with theme provider
components/
  app-sidebar.tsx   # Settings sidebar with parameter controls
  forms/            # Distribution-specific parameter forms
  graphs/           # Histogram visualization
  ui/               # Shadcn/ui components
lib/
  draw.ts           # Async distribution sampler using webR
  pdf.ts            # PDF calculations for theoretical curves
  types.ts          # TypeScript type definitions
  constants.ts      # Speed settings, defaults, max samples (10,000)
  validation.ts     # Input validation helpers
  utils.ts          # Statistics calculation utilities
  distributions/    # Custom distributions (currently just Metalog)
hooks/
  use-webr.ts           # WebR singleton initialization and hook
  use-local-storage.ts  # Persistent state management
```

## Important Implementation Details

**WebR Initialization**: WebR loads asynchronously (~10MB download on first load). The UI shows a "Loading..." state until webR is ready. The singleton pattern ensures only one webR instance is created regardless of component re-renders.

**WebR Build Workaround**: The project includes the `ws` package as a dependency due to a known issue in webR 0.5.5+ (see [r-wasm/webr#566](https://github.com/r-wasm/webr/issues/566)). This can be removed when the issue is fixed upstream.

**CORS Headers**: The next.config.mjs includes Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers required for webR's SharedArrayBuffer usage.

**Max Samples**: The app caps at 10,000 samples (MAX_SAMPLES in lib/constants.ts) to prevent performance issues. Sampling automatically stops when this limit is reached.

**Async Sampling**: The `draw()` function is async because it calls webR. The interval-based sampling system properly handles the async nature without blocking the UI.

**Parameter Updates**: Changing distribution parameters clears existing samples to prevent mixing data from different distributions.

**Accessibility**: All interactive controls have ARIA labels. The histogram includes a descriptive aria-label indicating sample count and whether PDF overlay is shown.

**Sturges' Rule**: When enabled, automatically calculates bin count as `ceil(log2(n) + 1)` where n is the sample count.
