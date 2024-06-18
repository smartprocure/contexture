---
'contexture-react': patch
---

ResultTable: HeaderCell and Cell rendering tweaks

- Do not wrap `HeaderCell` children in a `span` by default because it makes providing a custom `HeaderCell` harder.
- Support `headerCellProps` and `cellProps` to accomodate the very common pattern of needing to only pass props to the header/cell components.
