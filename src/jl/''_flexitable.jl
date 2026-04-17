# AUTO GENERATED FILE - DO NOT EDIT

export ''_flexitable

"""
    ''_flexitable(;kwargs...)

A FlexiTable component.

Keyword arguments:
- `id` (String; required)
- `aggrCols` (Array of Strings; optional)
- `aggrFunction` (a value equal to: 'sum', 'mean'; optional)
- `conditionalStyles` (optional): Notice that we removed isGroupLevel from here;
we only rely on columnName, operator, and value.. conditionalStyles has the following type: Array of lists containing elements 'condition', 'style'.
Those elements have the following types:
  - `condition` (required): . condition has the following type: lists containing elements 'columnName', 'operator', 'value'.
Those elements have the following types:
  - `columnName` (String; required)
  - `operator` (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)
  - `value` (Bool | Real | String | Dict | Array; required)
  - `style` (Dict; required)s
- `data` (Array of Dicts; optional)
- `expandedGroups` (Dict; optional)
- `level1Group` (String; optional)
- `level2Group` (String; optional)
"""
function ''_flexitable(; kwargs...)
        available_props = Symbol[:id, :aggrCols, :aggrFunction, :conditionalStyles, :data, :expandedGroups, :level1Group, :level2Group]
        wild_props = Symbol[]
        return Component("''_flexitable", "FlexiTable", "flexi_table", available_props, wild_props; kwargs...)
end

