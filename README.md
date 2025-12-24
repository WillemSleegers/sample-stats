# Sample Stats

A web application for visualizing statistical distributions through interactive real-time sampling.

## About

Sample Stats lets you explore probability distributions by sampling from them in real-time and watching the histogram evolve. As you collect more samples, you can observe the empirical distribution converge toward the theoretical probability density function.

### Features

- **Interactive Sampling**: Sample from various statistical distributions with adjustable speed settings
- **Real-time Visualization**: Watch histograms update dynamically as new samples are drawn
- **Theoretical Overlays**: Compare empirical data with theoretical probability density curves
- **Descriptive Statistics**: View mean, median, standard deviation, and percentiles
- **Flexible Configuration**: Customize bin counts (manual or Sturges' rule), sampling speed, and visualization options

### Supported Distributions

- **Normal** - Gaussian distribution with mean and standard deviation parameters
- **Log-Normal** - Distribution of a variable whose logarithm is normally distributed
- **Uniform** - Constant probability over a defined range
- **Beta** - Bounded distribution with alpha and beta shape parameters
- **PERT** - Three-point estimation using minimum, most likely, and maximum values
- **Metalog** - Flexible distribution defined by quantile parameterization (p10, p50, p90)

## Technical Details

### Built With

- **Next.js 16** with React 19 and React Compiler for automatic optimization
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Recharts** for data visualization
- **webR** - R compiled to WebAssembly for statistical computing in the browser

### Why webR?

This project uses webR to leverage R's battle-tested statistical distribution functions (`rnorm`, `runif`, `dlnorm`, `dbeta`, etc.) directly in the browser. This provides:

- Accurate, well-established statistical implementations
- No server-side dependencies
- Consistent behavior with R users' expectations

### Performance

- Supports up to 10,000 samples in memory
- Optimized single-pass statistics calculation
- Configurable sampling speeds (50ms to 1000ms intervals)
- React Compiler automatically optimizes expensive computations
