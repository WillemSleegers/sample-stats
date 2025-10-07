# Sample Stats - Improvement TODO List

## UI/UX Improvements

### High Priority

- [ ] **Dynamic bin count** - Replace hardcoded 10 bins (app/page.tsx:191) with user-adjustable or dynamic bin count using Sturges' rule: `Math.ceil(Math.log2(n) + 1)`
- [ ] **Chart visual feedback** - Add indication when histogram updates (subtle animations or timestamp showing "Last updated: X seconds ago")
- [ ] **Empty state** - Replace single zero bar with helpful empty state message like "Click Sample to start drawing"
- [ ] **Sample count formatting** - Add comma separators for large numbers (10,000+) at app/page.tsx:184

### Medium Priority

- [ ] **Probability density overlay** - Overlay theoretical PDF curve on histogram to compare empirical vs theoretical distributions
- [ ] **Real-time stats** - Show stats by default and update more frequently than current 1 second interval (app/page.tsx:128)
- [ ] **Clear samples button** - Add reset button to clear samples without changing distribution
- [ ] **Parameter validation feedback** - Add helper text showing valid ranges (e.g., "SD must be positive")
- [ ] **Mobile responsiveness** - Make histogram height (app/page.tsx:189) responsive instead of fixed 400px

## Codebase Improvements

### High Priority

- [ ] **TypeScript strictness** - Use discriminated unions for parameters to eliminate unsafe type assertions in lib/draw.ts:26-56
  ```typescript
  type DistributionConfig =
    | { type: "normal"; params: ParamsNormal }
    | { type: "uniform"; params: ParamsUniform }
    // ...
  ```
- [ ] **Memory management** - Implement max sample limit or sliding window for unbounded samples array (app/page.tsx:38) to prevent memory issues
- [ ] **Stats calculation efficiency** - Cache results or use Web Workers for heavy computation in lib/utils.ts as samples grow large
- [ ] **Console.log cleanup** - Remove debug log at app/page.tsx:72

### Medium Priority

- [ ] **Histogram binning algorithm** - Memoize histogram computation in components/graphs/histogram.tsx:10-45 using useMemo to avoid recalculating on every render
- [ ] **Form ref pattern** - Refactor unconventional form submission via ref (app/page.tsx:46,71-75) to use lifted state or context
- [ ] **Constants organization** - Split lib/constants.ts into separate files for speed settings and default parameters
- [ ] **Error boundaries** - Add error boundaries around histogram and form components for graceful edge case handling
- [ ] **Testing** - Add unit tests for distribution functions and histogram binning logic
- [ ] **Accessibility** - Add ARIA labels for play/pause button and form inputs; add descriptive text alternative for histogram

### Low Priority

- [ ] **README** - Update README.md with project-specific information instead of boilerplate Next.js content
- [ ] **Component naming** - Make component naming consistent in components/app-sidebar.tsx
- [ ] **Footer text** - Personalize or remove "Made by me" in components/app-sidebar.tsx:57
