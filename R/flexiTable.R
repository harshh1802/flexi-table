# AUTO GENERATED FILE - DO NOT EDIT

#' @export
flexiTable <- function(id=NULL, aggrCols=NULL, aggrFunction=NULL, conditionalStyles=NULL, data=NULL, density=NULL, description=NULL, emptyMessage=NULL, expandedGroups=NULL, exportable=NULL, level1Group=NULL, level2Group=NULL, numberFormat=NULL, searchable=NULL, showTotals=NULL, stickyFooter=NULL, stickyHeader=NULL, stripe=NULL, theme=NULL, title=NULL, totalCols=NULL, totalFunction=NULL, totalLabel=NULL) {
    
    props <- list(id=id, aggrCols=aggrCols, aggrFunction=aggrFunction, conditionalStyles=conditionalStyles, data=data, density=density, description=description, emptyMessage=emptyMessage, expandedGroups=expandedGroups, exportable=exportable, level1Group=level1Group, level2Group=level2Group, numberFormat=numberFormat, searchable=searchable, showTotals=showTotals, stickyFooter=stickyFooter, stickyHeader=stickyHeader, stripe=stripe, theme=theme, title=title, totalCols=totalCols, totalFunction=totalFunction, totalLabel=totalLabel)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'FlexiTable',
        namespace = 'flexi_table',
        propNames = c('id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'density', 'description', 'emptyMessage', 'expandedGroups', 'exportable', 'level1Group', 'level2Group', 'numberFormat', 'searchable', 'showTotals', 'stickyFooter', 'stickyHeader', 'stripe', 'theme', 'title', 'totalCols', 'totalFunction', 'totalLabel'),
        package = 'flexiTable'
        )

    structure(component, class = c('dash_component', 'list'))
}
