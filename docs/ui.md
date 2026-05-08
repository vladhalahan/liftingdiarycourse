# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do NOT create custom UI components. Every button, input, card, dialog, table, badge, etc. must come from the shadcn/ui library. If a component does not exist in shadcn/ui, install the closest shadcn/ui primitive and compose from it — do not build from scratch.

Install components via the CLI:

```bash
npx shadcn@latest add <component>
```

Components live in `src/components/ui/` and must not be modified beyond what shadcn/ui scaffolds, except for unavoidable project-specific adjustments.

## Date Formatting

All date formatting must use [date-fns](https://date-fns.org/). Do not use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other formatting approach.

### Format

Dates must be displayed using ordinal day, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the following date-fns format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```

### Examples

| Raw value            | Formatted output |
|----------------------|------------------|
| 2025-09-01           | 1st Sep 2025     |
| 2025-08-02           | 2nd Aug 2025     |
| 2026-01-03           | 3rd Jan 2026     |
| 2024-06-04           | 4th Jun 2024     |
