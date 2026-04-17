% Auto-generated: do not edit by hand
\name{flexiTable}

\alias{flexiTable}

\title{FlexiTable component}

\description{
FlexiTable — enterprise-grade hierarchical data table.  Backward-compatible with the original API (id, data, level1Group, level2Group, aggrFunction, aggrCols, conditionalStyles, expandedGroups, setProps) and adds optional props for title/description, search, density, export, theme, and numeric formatting. All new props are optional.
}

\usage{
flexiTable(id=NULL, aggrCols=NULL, aggrFunction=NULL,
conditionalStyles=NULL, data=NULL, density=NULL,
description=NULL, emptyMessage=NULL, expandedGroups=NULL,
exportable=NULL, level1Group=NULL, level2Group=NULL,
numberFormat=NULL, searchable=NULL, showTotals=NULL,
stickyFooter=NULL, stickyHeader=NULL, stripe=NULL,
theme=NULL, title=NULL, totalCols=NULL, totalFunction=NULL,
totalLabel=NULL)
}

\arguments{
\item{id}{Character. Dash-provided id.}

\item{aggrCols}{List of characters. Columns whose values are aggregated at group rows.}

\item{aggrFunction}{A value equal to: 'sum', 'mean'. Aggregation function applied to `aggrCols`.}

\item{conditionalStyles}{List of lists containing elements 'condition', 'style'.
those elements have the following types:
  - condition (required): . condition has the following type: lists containing elements 'columnname', 'operator', 'value'.
those elements have the following types:
  - columnname (character; required)
  - operator (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)
  - value (logical | numeric | character | named list | unnamed list; required)
  - style (named list; required)s. Conditional styles applied per-cell; each rule matches a column and operator.}

\item{data}{List of named lists. Row objects. Columns are inferred from the first row's keys.}

\item{density}{A value equal to: 'comfortable', 'compact'. Row density.}

\item{description}{Character. Optional subtitle / description below the title.}

\item{emptyMessage}{Character. Message shown when there is no data.}

\item{expandedGroups}{Named list. Controlled map of groupKey → expanded boolean.}

\item{exportable}{Logical. Show an "Export CSV" button in the toolbar.}

\item{level1Group}{Character. Field used for level-1 grouping.}

\item{level2Group}{Character. Field used for level-2 grouping (optional).}

\item{numberFormat}{Optional function to format numeric cells. Receives the raw value.}

\item{searchable}{Logical. Show a search input in the toolbar.}

\item{showTotals}{Logical. Show a grand-totals footer row beneath the table.}

\item{stickyFooter}{Logical. Whether the totals footer stays pinned to the bottom on scroll.}

\item{stickyHeader}{Logical. Whether the header row stays pinned when scrolling.}

\item{stripe}{Logical. Whether zebra striping is applied to data rows.}

\item{theme}{A value equal to: 'light', 'dark'. Visual theme.}

\item{title}{Character. Optional title displayed in the toolbar.}

\item{totalCols}{List of characters. Columns to total in the footer. Defaults to every numeric column.}

\item{totalFunction}{A value equal to: 'sum', 'mean'. Aggregation function for the footer row. Defaults to `'sum'`.}

\item{totalLabel}{Character. Label rendered in the first column of the totals footer.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

