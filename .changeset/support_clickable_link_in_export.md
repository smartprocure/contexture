
# Release Notes: contexture-export

## [Patch] - Hyperlink Support for Excel Exports

### Overview
This patch introduces a new feature for Excel-type exports where cells can now be rendered as clickable hyperlinks. This is achieved by providing a specific metadata structure that the exporter converts into native Excel formulas.

### New Features
* **Dynamic Excel Hyperlinks**: Cells can now display a custom text label while linking to a specific URL.
* **Metadata-Driven Rendering**: The system identifies links via the `__isHyperlink` flag within the `meta` object.
* **Display Label Mapping**: The `__alias` property is used as the visible display label for the provided URL.
* **Formula Safety**: The exporter automatically handles double-quote escaping to ensure the Excel `HYPERLINK` formula remains valid.

### Data Structure Requirements
To render a cell as a link, the record data for that cell must follow this structure:

```json
{
  "url": "[https://example.com/detail/123](https://example.com/detail/123)",
  "meta": {
    "__isHyperlink": true,
    "__alias": "Click to Open Detail Link"
  }
}