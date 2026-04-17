# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class FlexiTable(Component):
    """A FlexiTable component.


Keyword arguments:

- id (string; required)

- aggrCols (list of strings; optional)

- aggrFunction (a value equal to: 'sum', 'mean'; default 'sum')

- conditionalStyles (list of dicts; optional):
    Notice that we removed isGroupLevel from here;  we only rely on
    columnName, operator, and value.

    `conditionalStyles` is a list of dicts with keys:

    - condition (dict; required)

        `condition` is a dict with keys:

        - columnName (string; required)

        - operator (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)

        - value (boolean | number | string | dict | list; required)

    - style (dict; required)

- data (list of dicts; optional)

- expandedGroups (dict; optional)

- level1Group (string; optional)

- level2Group (string; optional)"""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'flexi_table'
    _type = 'FlexiTable'
    @_explicitize_args
    def __init__(self, id=Component.REQUIRED, data=Component.UNDEFINED, level1Group=Component.UNDEFINED, level2Group=Component.UNDEFINED, aggrFunction=Component.UNDEFINED, aggrCols=Component.UNDEFINED, conditionalStyles=Component.UNDEFINED, expandedGroups=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'expandedGroups', 'level1Group', 'level2Group']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'expandedGroups', 'level1Group', 'level2Group']
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
