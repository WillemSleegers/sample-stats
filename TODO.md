# Sample Stats - Improvement TODO List

## UI/UX Improvements

### High Priority

- [x] **Dynamic bin count** - Replace hardcoded 10 bins (app/page.tsx:191) with user-adjustable or dynamic bin count using Sturges' rule: `Math.ceil(Math.log2(n) + 1)` ✅
- [x] **Empty state** - Replace single zero bar with helpful empty state message like "Click Sample to start drawing" ✅
- [x] **Sample count formatting** - Add comma separators for large numbers (10,000+) at app/page.tsx:184 ✅

### Medium Priority

- [x] **Probability density overlay** - Overlay theoretical PDF curve on histogram to compare empirical vs theoretical distributions ✅
- [x] **Clear samples button** - Add reset button to clear samples without changing distribution ✅
- [x] **Parameter validation feedback** - Add helper text showing valid ranges (e.g., "SD must be positive") ✅
- [ ] **Mobile responsiveness** - Make histogram height (app/page.tsx:189) responsive instead of fixed 400px

### Other Priority

- [ ] **Reduce spacing between bars in full screen** - The spacing between bars becomes very large when going fullscreen.
- [ ] **Fix inconsistent bar width** - The leftmost and rightmost bar are half the width of the other bars. All bars should have the same width.
- [ ] **Remove focus line around graph** - There should not be a focus outline around the graph when the user clicks on the graph.
- [ ] **Fix dropdown delayed appearance** - When the page first loads, the dropdown loads, but there's a delay in when the value of the dropdown shows up. The value 'Normal' only appears a second or so after the page loads.
- [ ] **Improve the look of the title** - Currently the title consist of a large title with a subtitle. The subtitle doesn't look particularly nice. Re-evaluate the title and subtitle to see if we those can better match modern aesthetics.
- [ ] **Add new Shadcn components** - Shadcn released new components, one of them is a Field component (https://ui.shadcn.com/docs/components/field) which I think we can use in our sidebar. Maybe also on the main page with the distribution dropdown and sample button.

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
- [ ] **Error boundaries** - Add error boundaries around histogram and form components for graceful edge case handling
- [ ] **Accessibility** - Add ARIA labels for play/pause button and form inputs; add descriptive text alternative for histogram

### Low Priority

- [ ] **README** - Update README.md with project-specific information instead of boilerplate Next.js content
- [ ] **Component naming** - Make component naming consistent in components/app-sidebar.tsx
- [ ] **Footer text** - Personalize or remove "Made by me" in components/app-sidebar.tsx:57
