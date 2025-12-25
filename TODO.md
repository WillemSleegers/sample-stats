# TODO

## Future Improvements

### Update Shadcn Chart Component for Recharts v3
The `components/ui/chart.tsx` component currently uses `eslint-disable` for TypeScript `any` types. This is a known limitation from the Shadcn UI library's chart component design.

**Action needed:** When Shadcn UI releases an updated chart component with proper TypeScript support for Recharts v3, update the component and remove the eslint-disable comments.

**References:**
- [components/ui/chart.tsx:107-138](components/ui/chart.tsx#L107-L138)
- [components/ui/chart.tsx:269-276](components/ui/chart.tsx#L269-L276)
