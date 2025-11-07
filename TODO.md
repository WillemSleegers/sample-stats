# TODO

## Performance Optimization

### Sampling Efficiency
Consider pre-generating all samples at once instead of drawing incrementally:

**Current approach:**
- Draws 1 sample per interval (e.g., every 250ms at normal speed)
- Many webR calls = significant WASM boundary crossing overhead
- Takes ~42 minutes to reach 10k samples at normal speed

**Proposed optimization:**
- Draw all 10k samples in a single webR call when "Start" is pressed
- Store full sample set in state
- Reveal samples incrementally based on speed settings
- Benefits:
  - Single WASM boundary crossing
  - JavaScript array slicing is extremely fast
  - Histogram recalculation (binning/counting) is pure JS

**Alternative:**
- Draw in larger batches (e.g., 100 samples per interval)
- Balance between efficiency and incremental feel

**Trade-off to consider:**
- Pre-generation locks in the distribution parameters upfront
- Changing parameters mid-sampling would require regeneration
- Current approach allows for dynamic parameter changes (though UI doesn't support this)
