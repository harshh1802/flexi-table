from dash import Dash, html, dcc, Input, Output
from flexi_table import FlexiTable

# Initialize the Dash app
app = Dash(__name__)

# Sample data
data = [
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'C', 'vega': -5, 'iv': 2.1},
    {'expirdate': '2024-11-28', 'symbol': 'AAPL', 'cp': 'P', 'vega': 2.8, 'iv': 0.9},
    {'expirdate': '2024-11-29', 'symbol': 'AAPL', 'cp': 'C', 'vega': 2, 'iv': 2.0},
    {'expirdate': '2024-11-29', 'symbol': 'AAPL', 'cp': 'P', 'vega': -1.0, 'iv': 3.0},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'C', 'vega': -2.0, 'iv': 2.5},
    {'expirdate': '2024-11-29', 'symbol': 'MSFT', 'cp': 'P', 'vega': -5.0, 'iv': 4.2},
]

# Updated conditional styles (no more isGroupLevel)
conditional_styles = [
    {
        "condition": {
            "columnName": "vega",
            "operator": "<",
            "value": 0
        },
        "style": {
            "backgroundColor": "#ffcdd2",
            "color": "#c62828"
        }
    },
    {
        "condition": {
            "columnName": "vega",
            "operator": ">=",
            "value": 0
        },
        "style": {
            "backgroundColor": "#c8e6c9",
            "color": "#2e7d32"
        }
    },
    # Example: you can uncomment these if you want to style aggregated rows as well,
    # but now they'd apply to all matching cells at all levels.
    #
    # {
    #     "condition": {
    #         "columnName": "vega",
    #         "operator": "<",
    #         "value": 0
    #     },
    #     "style": {
    #         "backgroundColor": "#ef9a9a",
    #         "color": "#b71c1c",
    #         "fontWeight": "bold"
    #     }
    # },
    # {
    #     "condition": {
    #         "columnName": "vega",
    #         "operator": ">=",
    #         "value": 0
    #     },
    #     "style": {
    #         "backgroundColor": "#a5d6a7",
    #         "color": "#1b5e20",
    #         "fontWeight": "bold"
    #     }
    # }
]

# App layout
app.layout = html.Div([
    html.H1("Options Data Analysis"),
    
    # Grouping controls
    html.Div([
        html.Div([
            html.Label("Level 1 Group:"),
            dcc.Dropdown(
                id='level1-dropdown',
                options=[
                    {'label': 'Symbol', 'value': 'symbol'},
                    {'label': 'Expiration Date', 'value': 'expirdate'},
                    {'label': 'Call/Put', 'value': 'cp'}
                ],
                value='symbol'
            ),
        ], style={'width': '30%', 'display': 'inline-block', 'marginRight': '20px'}),
        
        html.Div([
            html.Label("Level 2 Group:"),
            dcc.Dropdown(
                id='level2-dropdown',
                options=[
                    {'label': 'Symbol', 'value': 'symbol'},
                    {'label': 'Expiration Date', 'value': 'expirdate'},
                    {'label': 'Call/Put', 'value': 'cp'}
                ],
                value='expirdate'
            ),
        ], style={'width': '30%', 'display': 'inline-block', 'marginRight': '20px'}),
        
        html.Div([
            html.Label("Aggregation Function:"),
            dcc.Dropdown(
                id='aggregation-dropdown',
                options=[
                    {'label': 'Sum', 'value': 'sum'},
                    {'label': 'Mean', 'value': 'mean'}
                ],
                value='sum'
            ),
        ], style={'width': '30%', 'display': 'inline-block'}),
    ], style={'marginBottom': '20px'}),
    
    # Table container
    html.Div(id='table-container')
])

# Callback to update the table
@app.callback(
    Output('table-container', 'children'),
    [
        Input('level1-dropdown', 'value'),
        Input('level2-dropdown', 'value'),
        Input('aggregation-dropdown', 'value')
    ]
)
def update_table(level1_group, level2_group, aggr_function):
    return FlexiTable(
        id='options-table',
        data=data,
        level1Group=level1_group,
        level2Group=level2_group,
        aggrFunction=aggr_function,
        aggrCols=['vega', 'iv'],
        conditionalStyles=conditional_styles,
        showTotals=True,
        totalLabel='Grand total',
        stickyFooter=True,
    )

# Run the server
if __name__ == '__main__':
    app.run_server(debug=True)
