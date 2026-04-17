% Auto-generated: do not edit by hand
\name{''FlexiTable}

\alias{''FlexiTable}

\title{FlexiTable component}

\description{

}

\usage{
''FlexiTable(id=NULL, aggrCols=NULL, aggrFunction=NULL,
conditionalStyles=NULL, data=NULL, expandedGroups=NULL,
level1Group=NULL, level2Group=NULL)
}

\arguments{
\item{id}{Character. }

\item{aggrCols}{List of characters. }

\item{aggrFunction}{A value equal to: 'sum', 'mean'. }

\item{conditionalStyles}{List of lists containing elements 'condition', 'style'.
those elements have the following types:
  - condition (required): . condition has the following type: lists containing elements 'columnname', 'operator', 'value'.
those elements have the following types:
  - columnname (character; required)
  - operator (a value equal to: '>', '<', '>=', '<=', '==', '!='; required)
  - value (logical | numeric | character | named list | unnamed list; required)
  - style (named list; required)s. Notice that we removed isGroupLevel from here;
we only rely on columnName, operator, and value.}

\item{data}{List of named lists. }

\item{expandedGroups}{Named list. }

\item{level1Group}{Character. }

\item{level2Group}{Character. }
}

\value{named list of JSON elements corresponding to React.js properties and their values}

