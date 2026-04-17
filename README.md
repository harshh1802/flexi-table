# FlexiTable

A Dash component for hierarchical data tables with row grouping, automatic
aggregation, conditional styling, and an enterprise-grade UI. Designed for
finance, analytics, and operations dashboards where rows need to collapse into
groups, numbers need to line up, and totals need to be clearly visible.

---

## Contents

- [Features](#features)
- [Install](#install)
- [Quick start](#quick-start)
- [Props reference](#props-reference)
  - [Data](#data)
  - [Grouping & aggregation](#grouping--aggregation)
  - [Conditional styling](#conditional-styling)
  - [Totals footer](#totals-footer)
  - [Toolbar](#toolbar)
  - [Appearance](#appearance)
  - [Two-way binding](#two-way-binding)
- [Usage examples](#usage-examples)
- [Development](#development)
- [License](#license)

---

## Features

- **Hierarchical grouping** — up to two levels of row grouping (`level1Group`,
  `level2Group`) with click-to-expand / collapse and full keyboard control.
- **Automatic aggregation** — `sum` or `mean` of any columns, displayed on
  group header rows.
- **Grand-totals footer** — optional `<tfoot>` row with summed (or averaged)
  values for any columns; respects the active search filter.
- **Conditional styling** — declarative per-cell styling based on value
  comparisons (`>`, `<`, `>=`, `<=`, `==`, `!=`). Applies to group rows,
  aggregation cells, and the totals footer.
- **Search** — toolbar search filters rows across all columns.
- **CSV export** — one-click download of the underlying data.
- **Density toggle** — comfortable / compact.
- **Theming** — light and dark themes built on CSS variables.
- **Sticky header & footer** — for long tables in scroll containers.
- **Accessibility** — `role="treegrid"`, `aria-expanded` on group rows,
  keyboard toggle (Enter / Space), visible focus ring, tabular-numeral
  alignment for numeric columns.
- **Zero runtime overhead** — no virtualization dependency, no CSS frameworks;
  a single `<style>` block scoped to the component.

---

## Install

```bash
pip install flexi_table
```

Requires `dash>=2.0`. For the development build (from source) see
[Development](#development).

---

## Quick start

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'region': 'Americas', 'country': 'USA',    'sales': 524300, 'profit': 152000},
    {'region': 'Americas', 'country': 'Canada', 'sales': 418500, 'profit': 121000},
    {'region': 'EMEA',     'country': 'Germany','sales': 612400, 'profit': 204000},
    {'region': 'EMEA',     'country': 'France', 'sales': 456100, 'profit': 131500},
    {'region': 'APAC',     'country': 'Japan',  'sales': 702900, 'profit': 251300},
]

app.layout = FlexiTable(
    id='revenue-table',
    title='Global revenue',
    description='Grouped by region and country.',
    data=data,
    level1Group='region',
    level2Group='country',
    aggrCols=['sales', 'profit'],
    aggrFunction='sum',
    showTotals=True,
    totalLabel='Grand total',
    searchable=True,
    exportable=True,
)

if __name__ == '__main__':
    app.run(debug=True)
```

Open http://127.0.0.1:8050 and click a region to drill in.

---

## Props reference

All props are keyword arguments to `FlexiTable(...)`. Camel-case names come from
the underlying React component — use them as-is from Python.

### Data

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `id` | `str` | **required** | Dash component id. |
| `data` | `list[dict]` | `[]` | Row objects. Columns are inferred from the first row's keys. |
| `emptyMessage` | `str` | `'No data to display'` | Shown when `data` is empty or filtered to zero rows. |
| `numberFormat` | `callable` | `Intl.NumberFormat` with 2 decimals | **JS-only.** If you're using Dash clientside callbacks, a function that receives the raw value and returns the display string. From pure Python, leave this unset. |

### Grouping & aggregation

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `level1Group` | `str \| None` | `None` | Column name to group by at the top level. |
| `level2Group` | `str \| None` | `None` | Column name for the nested second-level grouping. |
| `aggrCols` | `list[str]` | `[]` | Columns aggregated on group header rows. |
| `aggrFunction` | `'sum' \| 'mean'` | `'sum'` | Aggregation used for group headers. |

### Conditional styling

`conditionalStyles` is a list of `{condition, style}` rules. The style is a CSS
properties dict (camelCase keys), applied to any cell whose column and value
satisfy the condition. Rules are applied in order, with later rules merging on
top of earlier ones.

```python
conditionalStyles=[
    {
        'condition': {'columnName': 'vega', 'operator': '<', 'value': 0},
        'style': {'color': '#b91c1c', 'fontWeight': 600},
    },
    {
        'condition': {'columnName': 'vega', 'operator': '>=', 'value': 0},
        'style': {'color': '#15803d'},
    },
]
```

| Operator | Matches |
| -------- | ------- |
| `>`      | cell value > `value` |
| `<`      | cell value < `value` |
| `>=`     | cell value ≥ `value` |
| `<=`     | cell value ≤ `value` |
| `==`     | strict equality |
| `!=`     | strict inequality |

Styles apply to data cells, group header aggregation cells, **and** the totals
footer. To target only a specific layer, combine with operator thresholds that
can't collide (e.g. level-1 totals live in a different numeric range from
individual cells).

### Totals footer

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `showTotals` | `bool` | `False` | Render a `<tfoot>` row beneath the table. |
| `totalCols` | `list[str] \| None` | falls back to `aggrCols` | Columns to total. |
| `totalFunction` | `'sum' \| 'mean' \| None` | falls back to `aggrFunction` | Aggregation used for the footer. |
| `totalLabel` | `str` | `'Total'` | Label placed in the first column of the footer. |
| `stickyFooter` | `bool` | `False` | Pins the footer to the bottom while the table body scrolls. |

Totals reflect the **currently filtered rows**: if `searchable=True` and the
user types a query, totals update live.

### Toolbar

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `str \| None` | `None` | Rendered in the toolbar. The toolbar is hidden when no toolbar props are set. |
| `description` | `str \| None` | `None` | Smaller subtitle below the title. |
| `searchable` | `bool` | `False` | Shows a search input that filters across all cells. |
| `exportable` | `bool` | `False` | Shows a "Export" button that downloads the data as CSV. |

### Appearance

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Initial row density; user can toggle via the toolbar. |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme. Dark theme targets dark dashboards. |
| `stickyHeader` | `bool` | `True` | Pins the header row while scrolling. |
| `stripe` | `bool` | `True` | Zebra-stripes nested data rows. |

### Two-way binding

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `expandedGroups` | `dict[str, bool]` | `{}` | Controlled map of `groupKey → expanded`. Level-2 keys are `"{level1Key}-{level2Key}"`. |
| `setProps` | callable | *(provided by Dash)* | Dash wires this automatically; the component pushes `expandedGroups` back so a Python callback can read the user's expansion state. |

Reading expansion state from a callback:

```python
from dash import Input, Output, callback

@callback(
    Output('status', 'children'),
    Input('revenue-table', 'expandedGroups'),
)
def show_state(expanded):
    open_groups = [k for k, v in (expanded or {}).items() if v]
    return f'{len(open_groups)} groups open'
```

---

## Usage examples

See [EXAMPLES.md](./EXAMPLES.md) for eight end-to-end recipes:

1. Minimal ungrouped table
2. Single-level grouping with totals
3. Two-level nested grouping
4. Conditional styling (heatmap-style)
5. Search + CSV export
6. Dark theme + compact density
7. Interactive controls driving group/agg/totals from dropdowns
8. Reading `expandedGroups` from a callback

---

## Development

This package is a Dash component library. The JS source lives in
`src/lib/components/` and is bundled into `flexi_table/flexi_table.min.js`;
Python bindings are auto-generated into `flexi_table/FlexiTable.py` by
`dash-generate-components`.

### Setup

```bash
npm install

python -m venv venv
# Unix / macOS
source venv/bin/activate
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### Iterate

Edit the React source at
[src/lib/components/FlexiTable.react.js](src/lib/components/FlexiTable.react.js)
and the demo harness at [src/demo/App.js](src/demo/App.js), then:

```bash
# Hot-reloading JS-only demo
npm start          # http://localhost:8080

# Or: rebuild the bundle and the Python bindings for use from Dash
npm run build:js
dash-generate-components ./src/lib/components flexi_table -p package-info.json \
    --r-prefix '' --jl-prefix '' --ignore "\.test\."

python dash_app.py # http://127.0.0.1:8050
```

### Publish

```bash
npm run build
python setup.py sdist bdist_wheel
twine upload dist/*
```

---

## License

MIT. See [LICENSE](./LICENSE).
