# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''FlexiTable <- function(id=NULL, aggrCols=NULL, aggrFunction=NULL, conditionalStyles=NULL, data=NULL, expandedGroups=NULL, level1Group=NULL, level2Group=NULL) {
    
    props <- list(id=id, aggrCols=aggrCols, aggrFunction=aggrFunction, conditionalStyles=conditionalStyles, data=data, expandedGroups=expandedGroups, level1Group=level1Group, level2Group=level2Group)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'FlexiTable',
        namespace = 'flexi_table',
        propNames = c('id', 'aggrCols', 'aggrFunction', 'conditionalStyles', 'data', 'expandedGroups', 'level1Group', 'level2Group'),
        package = 'flexiTable'
        )

    structure(component, class = c('dash_component', 'list'))
}
