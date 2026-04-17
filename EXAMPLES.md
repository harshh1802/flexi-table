# FlexiTable — usage examples

End-to-end, runnable examples covering every major feature. Each example is
self-contained: save to a `.py` file, run with `python example_X.py`, and visit
http://127.0.0.1:8050.

- [1. Minimal ungrouped table](#1-minimal-ungrouped-table)
- [2. Single-level grouping with totals](#2-single-level-grouping-with-totals)
- [3. Two-level nested grouping](#3-two-level-nested-grouping)
- [4. Conditional styling (heatmap)](#4-conditional-styling-heatmap)
- [5. Search and CSV export](#5-search-and-csv-export)
- [6. Dark theme and compact density](#6-dark-theme-and-compact-density)
- [7. Interactive controls (dropdowns)](#7-interactive-controls-dropdowns)
- [8. Reading expandedGroups from a callback](#8-reading-expandedgroups-from-a-callback)

---

## 1. Minimal ungrouped table

The simplest possible usage — pass a list of dicts, get a styled table.

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'ticker': 'AAPL', 'price': 192.41, 'change': 1.24},
    {'ticker': 'MSFT', 'price': 418.77, 'change': -0.18},
    {'ticker': 'GOOG', 'price': 159.02, 'change': 2.93},
    {'ticker': 'NVDA', 'price': 875.34, 'change': 12.11},
]

app.layout = FlexiTable(
    id='tickers',
    data=data,
    title='Top movers',
    description='Last price and daily change.',
)

if __name__ == '__main__':
    app.run(debug=True)
```

Numeric columns are auto-detected and right-aligned with tabular numerals;
`ticker` stays left-aligned as text.

---

## 2. Single-level grouping with totals

One level of grouping plus a pinned grand-totals footer.

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'region': 'Americas', 'country': 'USA',    'sales': 524300, 'profit': 152000},
    {'region': 'Americas', 'country': 'Canada', 'sales': 418500, 'profit': 121000},
    {'region': 'Americas', 'country': 'Brazil', 'sales': 201000, 'profit':  48000},
    {'region': 'EMEA',     'country': 'Germany','sales': 612400, 'profit': 204000},
    {'region': 'EMEA',     'country': 'France', 'sales': 456100, 'profit': 131500},
    {'region': 'APAC',     'country': 'Japan',  'sales': 702900, 'profit': 251300},
    {'region': 'APAC',     'country': 'India',  'sales': 281400, 'profit':  68900},
]

app.layout = FlexiTable(
    id='revenue',
    title='Revenue by region',
    data=data,
    level1Group='region',
    aggrCols=['sales', 'profit'],
    aggrFunction='sum',
    showTotals=True,
    totalLabel='Grand total',
    stickyFooter=True,
)

if __name__ == '__main__':
    app.run(debug=True)
```

Click a region row to reveal the underlying countries. The totals row stays
pinned to the bottom even when the table body scrolls.

---

## 3. Two-level nested grouping

Level-1 header → level-2 header → leaf rows. Both levels compute independent
aggregates.

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'region': 'Americas', 'country': 'USA',    'manager': 'Alice', 'sales': 200_000},
    {'region': 'Americas', 'country': 'USA',    'manager': 'Bob',   'sales': 324_300},
    {'region': 'Americas', 'country': 'Canada', 'manager': 'Carol', 'sales': 418_500},
    {'region': 'EMEA',     'country': 'Germany','manager': 'Dan',   'sales': 612_400},
    {'region': 'EMEA',     'country': 'France', 'manager': 'Eve',   'sales': 456_100},
    {'region': 'EMEA',     'country': 'France', 'manager': 'Frank', 'sales': 348_700},
    {'region': 'APAC',     'country': 'Japan',  'manager': 'Gina',  'sales': 702_900},
    {'region': 'APAC',     'country': 'India',  'manager': 'Hiro',  'sales': 281_400},
]

app.layout = FlexiTable(
    id='nested-revenue',
    title='Revenue by region → country',
    description='Two-level hierarchy with per-level totals.',
    data=data,
    level1Group='region',
    level2Group='country',
    aggrCols=['sales'],
    aggrFunction='sum',
    showTotals=True,
    totalLabel='Total',
    expandedGroups={'Americas': True},  # pre-expand a group
)

if __name__ == '__main__':
    app.run(debug=True)
```

`expandedGroups={'Americas': True}` opens Americas on first render. For
level-2 keys the format is `"{level1}-{level2}"`, e.g.
`"Americas-USA": True`.

---

## 4. Conditional styling (heatmap)

Declarative rules colour cells by value. Rules match on the **same column
name** and apply wherever that column appears — data rows, group aggregates,
and the totals footer.

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'C', 'vega': -5.0, 'iv': 2.1},
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'P', 'vega':  2.8, 'iv': 0.9},
    {'expirdate': '2024-11-29', 'symbol': 'AAPL', 'cp': 'C', 'vega':  2.0, 'iv': 2.0},
    {'expirdate': '2024-11-29', 'symbol': 'AAPL', 'cp': 'P', 'vega': -1.0, 'iv': 3.0},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'C', 'vega': -2.0, 'iv': 2.5},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'P', 'vega': -5.0, 'iv': 4.2},
]

conditional_styles = [
    # Negative vega → red
    {
        'condition': {'columnName': 'vega', 'operator': '<', 'value': 0},
        'style': {'backgroundColor': '#fef2f2', 'color': '#b91c1c', 'fontWeight': 600},
    },
    # Positive vega → green
    {
        'condition': {'columnName': 'vega', 'operator': '>=', 'value': 0},
        'style': {'backgroundColor': '#f0fdf4', 'color': '#15803d'},
    },
    # High IV → blue emphasis
    {
        'condition': {'columnName': 'iv', 'operator': '>=', 'value': 3.0},
        'style': {'color': '#1d4ed8', 'fontWeight': 600},
    },
]

app.layout = FlexiTable(
    id='greeks',
    title='Options greeks',
    description='Grouped by symbol · negative vega highlighted.',
    data=data,
    level1Group='symbol',
    level2Group='expirdate',
    aggrCols=['vega', 'iv'],
    aggrFunction='sum',
    conditionalStyles=conditional_styles,
    showTotals=True,
    totalCols=['vega', 'iv'],
    totalLabel='Grand total',
)

if __name__ == '__main__':
    app.run(debug=True)
```

> **Tip.** Style keys are camelCase CSS properties (`backgroundColor`,
> `fontWeight`, `borderLeft`) — Python dict keys are passed straight through to
> the browser's inline style.

---

## 5. Search and CSV export

Toolbar features: enable `searchable` to filter across all cells, `exportable`
to download the current `data` as CSV.

```python
from dash import Dash
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'id': i, 'team': team, 'owner': owner, 'score': score}
    for i, (team, owner, score) in enumerate([
        ('Platform', 'Alex', 92),
        ('Platform', 'Jamie', 78),
        ('Growth',   'Priya', 88),
        ('Growth',   'Leo',   64),
        ('Data',     'Sam',   95),
        ('Data',     'Morgan',71),
    ])
]

app.layout = FlexiTable(
    id='scores',
    title='Team scorecard',
    data=data,
    level1Group='team',
    aggrCols=['score'],
    aggrFunction='mean',
    searchable=True,
    exportable=True,
    showTotals=True,
    totalFunction='mean',
    totalLabel='Average',
)

if __name__ == '__main__':
    app.run(debug=True)
```

Type "Priya" into the search box: the table filters to one row, and the
totals footer updates to reflect the filtered result.

---

## 6. Dark theme and compact density

For dense, data-heavy layouts on dark dashboards.

```python
from dash import Dash, html
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'date': '2025-01-02', 'bucket': 'Risk', 'pnl':  12345.67, 'notional': 2_400_000},
    {'date': '2025-01-02', 'bucket': 'Flow', 'pnl':  -8942.10, 'notional': 1_800_000},
    {'date': '2025-01-03', 'bucket': 'Risk', 'pnl':  24100.45, 'notional': 3_100_000},
    {'date': '2025-01-03', 'bucket': 'Flow', 'pnl':    312.88, 'notional':   950_000},
]

app.layout = html.Div(
    style={'background': '#0b1020', 'minHeight': '100vh', 'padding': '40px'},
    children=FlexiTable(
        id='pnl',
        title='Daily P&L',
        description='Aggregated by desk.',
        data=data,
        level1Group='date',
        level2Group='bucket',
        aggrCols=['pnl', 'notional'],
        aggrFunction='sum',
        theme='dark',
        density='compact',
        showTotals=True,
        totalLabel='Period total',
        stickyFooter=True,
    ),
)

if __name__ == '__main__':
    app.run(debug=True)
```

Users can still toggle density back to comfortable via the toolbar button;
the `density` prop just sets the initial value.

---

## 7. Interactive controls (dropdowns)

Drive grouping, aggregation, and totals from Dash controls. This is the
pattern in [dash_app.py](./dash_app.py).

```python
from dash import Dash, html, dcc, Input, Output
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'C', 'vega': -5.0, 'iv': 2.1},
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'P', 'vega':  2.8, 'iv': 0.9},
    {'expirdate': '2024-11-29', 'symbol': 'AAPL', 'cp': 'C', 'vega':  2.0, 'iv': 2.0},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'C', 'vega': -2.0, 'iv': 2.5},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'P', 'vega': -5.0, 'iv': 4.2},
]

options = [
    {'label': 'Symbol',    'value': 'symbol'},
    {'label': 'Expiration','value': 'expirdate'},
    {'label': 'Call / Put','value': 'cp'},
]

app.layout = html.Div(
    style={'padding': '40px', 'fontFamily': 'system-ui'},
    children=[
        html.H2('Options analysis'),
        html.Div(
            style={'display': 'grid', 'gridTemplateColumns': 'repeat(3, 1fr)',
                   'gap': 16, 'marginBottom': 16},
            children=[
                html.Div([html.Label('Level 1'),
                          dcc.Dropdown(id='l1', options=options, value='symbol')]),
                html.Div([html.Label('Level 2'),
                          dcc.Dropdown(id='l2', options=options, value='expirdate')]),
                html.Div([html.Label('Aggregation'),
                          dcc.Dropdown(id='agg', value='sum', options=[
                              {'label': 'Sum',  'value': 'sum'},
                              {'label': 'Mean', 'value': 'mean'},
                          ])]),
            ],
        ),
        html.Div(id='table-container'),
    ],
)

@app.callback(
    Output('table-container', 'children'),
    Input('l1', 'value'),
    Input('l2', 'value'),
    Input('agg', 'value'),
)
def render_table(l1, l2, agg):
    return FlexiTable(
        id='options-table',
        title='Greeks',
        data=data,
        level1Group=l1,
        level2Group=l2 if l2 != l1 else None,
        aggrFunction=agg,
        aggrCols=['vega', 'iv'],
        showTotals=True,
        totalFunction=agg,       # totals follow the dropdown
        totalLabel='Grand total',
        stickyFooter=True,
        searchable=True,
        exportable=True,
    )

if __name__ == '__main__':
    app.run(debug=True)
```

Setting `level2Group=l2 if l2 != l1 else None` collapses the second level
when the two dropdowns pick the same column — otherwise the user would see
duplicate group layers.

---

## 8. Reading `expandedGroups` from a callback

The component writes its expansion state back to Dash so a Python callback
can react to what the user has opened.

```python
from dash import Dash, html, Input, Output
from flexi_table import FlexiTable

app = Dash(__name__)

data = [
    {'region': 'Americas', 'country': 'USA',    'sales': 524300},
    {'region': 'Americas', 'country': 'Canada', 'sales': 418500},
    {'region': 'EMEA',     'country': 'Germany','sales': 612400},
    {'region': 'APAC',     'country': 'Japan',  'sales': 702900},
]

app.layout = html.Div([
    FlexiTable(
        id='revenue',
        data=data,
        level1Group='region',
        level2Group='country',
        aggrCols=['sales'],
        aggrFunction='sum',
    ),
    html.Pre(id='state', style={'padding': 16, 'color': '#475569'}),
])

@app.callback(Output('state', 'children'), Input('revenue', 'expandedGroups'))
def dump(expanded):
    if not expanded:
        return 'Nothing expanded.'
    lines = [f'  {k}: {v}' for k, v in expanded.items()]
    return 'expandedGroups = {\n' + '\n'.join(lines) + '\n}'

if __name__ == '__main__':
    app.run(debug=True)
```

Use this to persist expansion across reloads (write to `dcc.Store`), drive a
side-panel preview, or log analytics.

---

## Styling cheatsheet

All styling is done via inline `style={...}` dicts inside `conditionalStyles`.
CSS keys are camelCase. Common patterns:

```python
# Subtle left border accent
{'borderLeft': '3px solid #4f46e5'}

# Monospace cell
{'fontFamily': 'SF Mono, Consolas, monospace'}

# Strong alert
{'backgroundColor': '#fee2e2', 'color': '#991b1b', 'fontWeight': 700}

# Muted
{'color': '#94a3b8', 'fontStyle': 'italic'}
```

For structural styling (borders, row heights, overall theme) use `theme`,
`density`, `stripe`, and `stickyHeader` — these go through the built-in
design-token system rather than inline CSS.
