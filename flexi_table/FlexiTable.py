# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class FlexiTable(Component):
    """A FlexiTable component.
FlexiTable — enterprise-grade hierarchical data table.

Backward-compatible with the original API (id, data, level1Group, level2Group,
aggrFunction, aggrCols, conditionalStyles, expandedGroups, setProps) and adds
optional props for title/description, search, density, export, theme, and
numeric formatting. All new props are optional.

Keyword arguments:

- id (string; required):
    Dash-provided id.

- aggrCols (list of strings; optional):
    Columns whose values are aggregated at group rows.

- aggrFunction (a value equal to: 'sum', 'mean'; default 'sum'):
    Aggregation function applied to `aggrCols`.

- conditionalStyles (list of dicts; optional):
    Conditional styles applied per-cell; each rule matches a column
    and operator.

    `conditionalStyles` is a list of dicts with keys:

    - condition (dict; required)

        `condition` is a dict with keys:

        - columnName (string; required)

        - operator (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)

        - value (boolean | number | string | dict | list; required)

    - style (dict; required)

- data (list of dicts; optional):
    Row objects. Columns are inferred from the first row's keys.

- density (a value equal to: 'comfortable', 'compact'; default 'comfortable'):
    Row density.

- description (string; optional):
    Optional subtitle / description below the title.

- emptyMessage (string; default 'No data to display'):
    Message shown when there is no data.

- expandedGroups (dict; optional):
    Controlled map of groupKey → expanded boolean.

- exportable (boolean; default False):
    Show an \"Export CSV\" button in the toolbar.

- level1Group (string; optional):
    Field used for level-1 grouping.

- level2Group (string; optional):
    Field used for level-2 grouping (optional).

- searchable (boolean; default False):
    Show a search input in the toolbar.

- showTotals (boolean; default False):
    Show a grand-totals footer row beneath the table.

- stickyFooter (boolean; default False):
    Whether the totals footer stays pinned to the bottom on scroll.

- stickyHeader (boolean; default True):
    Whether the header row stays pinned when scrolling.

- stripe (boolean; default True):
    Whether zebra striping is applied to data rows.

- theme (a value equal to: 'light', 'dark'; default 'light'):
    Visual theme.

- title (string; optional):
    Optional title displayed in the toolbar.

- totalCols (list of strings; optional):
    Columns to total in the footer. Defaults to `aggrCols` when
    omitted.

- totalFunction (a value equal to: 'sum', 'mean'; optional):
    Aggregation function for the footer row. Defaults to
    `aggrFunction`.

- totalLabel (string; default 'Total'):
    Label rendered in the first column of the totals footer."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'flexi_table'
    _type = 'FlexiTable'
    @_explicitize_args
    def __init__(self, id=Component.REQUIRED, data=Component.UNDEFINED, level1Group=Component.UNDEFINED, level2Group=Component.UNDEFINED, aggrFunction=Component.UNDEFINED, aggrCols=Component.UNDEFINED, conditionalStyles=Component.UNDEFINED, expandedGroups=Component.UNDEFINED, title=Component.UNDEFINED, description=Component.UNDEFINED, searchable=Component.UNDEFINED, exportable=Component.UNDEFINED, density=Component.UNDEFINED, theme=Component.UNDEFINED, stickyHeader=Component.UNDEFINED, stripe=Component.UNDEFINED, emptyMessage=Component.UNDEFINED, numberFormat=Component.UNDEFINED, showTotals=Component.UNDEFINED, totalCols=Component.UNDEFINED, totalFunction=Component.UNDEFINED, totalLabel=Component.UNDEFINED, stickyFooter=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'density', 'description', 'emptyMessage', 'expandedGroups', 'exportable', 'level1Group', 'level2Group', 'searchable', 'showTotals', 'stickyFooter', 'stickyHeader', 'stripe', 'theme', 'title', 'totalCols', 'totalFunction', 'totalLabel']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'density', 'description', 'emptyMessage', 'expandedGroups', 'exportable', 'level1Group', 'level2Group', 'searchable', 'showTotals', 'stickyFooter', 'stickyHeader', 'stripe', 'theme', 'title', 'totalCols', 'totalFunction', 'totalLabel']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['id']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(FlexiTable, self).__init__(**args)
