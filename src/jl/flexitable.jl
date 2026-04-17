# AUTO GENERATED FILE - DO NOT EDIT

export flexitable

"""
    flexitable(;kwargs...)

A FlexiTable component.
FlexiTable — enterprise-grade hierarchical data table.

Backward-compatible with the original API (id, data, level1Group, level2Group,
aggrFunction, aggrCols, conditionalStyles, expandedGroups, setProps) and adds
optional props for title/description, search, density, export, theme, and
numeric formatting. All new props are optional.
Keyword arguments:
- `id` (String; required): Dash-provided id.
- `aggrCols` (Array of Strings; optional): Columns whose values are aggregated at group rows.
- `aggrFunction` (a value equal to: 'sum', 'mean'; optional): Aggregation function applied to `aggrCols`.
- `conditionalStyles` (optional): Conditional styles applied per-cell; each rule matches a column and operator.. conditionalStyles has the following type: Array of lists containing elements 'condition', 'style'.
Those elements have the following types:
  - `condition` (required): . condition has the following type: lists containing elements 'columnName', 'operator', 'value'.
Those elements have the following types:
  - `columnName` (String; required)
  - `operator` (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)
  - `value` (Bool | Real | String | Dict | Array; required)
  - `style` (Dict; required)s
- `data` (Array of Dicts; optional): Row objects. Columns are inferred from the first row's keys.
- `density` (a value equal to: 'comfortable', 'compact'; optional): Row density.
- `description` (String; optional): Optional subtitle / description below the title.
- `emptyMessage` (String; optional): Message shown when there is no data.
- `expandedGroups` (Dict; optional): Controlled map of groupKey → expanded boolean.
- `exportable` (Bool; optional): Show an "Export CSV" button in the toolbar.
- `level1Group` (String; optional): Field used for level-1 grouping.
- `level2Group` (String; optional): Field used for level-2 grouping (optional).
- `searchable` (Bool; optional): Show a search input in the toolbar.
- `showTotals` (Bool; optional): Show a grand-totals footer row beneath the table.
- `stickyFooter` (Bool; optional): Whether the totals footer stays pinned to the bottom on scroll.
- `stickyHeader` (Bool; optional): Whether the header row stays pinned when scrolling.
- `stripe` (Bool; optional): Whether zebra striping is applied to data rows.
- `theme` (a value equal to: 'light', 'dark'; optional): Visual theme.
- `title` (String; optional): Optional title displayed in the toolbar.
- `totalCols` (Array of Strings; optional): Columns to total in the footer. Defaults to `aggrCols` when omitted.
- `totalFunction` (a value equal to: 'sum', 'mean'; optional): Aggregation function for the footer row. Defaults to `aggrFunction`.
- `totalLabel` (String; optional): Label rendered in the first column of the totals footer.
"""
function flexitable(; kwargs...)
        available_props = Symbol[:id, :aggrCols, :aggrFunction, :conditionalStyles, :data, :density, :description, :emptyMessage, :expandedGroups, :exportable, :level1Group, :level2Group, :searchable, :showTotals, :stickyFooter, :stickyHeader, :stripe, :theme, :title, :totalCols, :totalFunction, :totalLabel]
        wild_props = Symbol[]
        return Component("flexitable", "FlexiTable", "flexi_table", available_props, wild_props; kwargs...)
end

