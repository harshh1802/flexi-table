import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FlexiTable = ({
    id,
    data = [],
    level1Group = null,
    level2Group = null,
    aggrFunction = 'sum',
    aggrCols = [],
    conditionalStyles = [],
    expandedGroups: expandedGroupsProp,
    setProps,
}) => {
    const [expandedGroups, setExpandedGroups] = useState(expandedGroupsProp || {});

    useEffect(() => {
        if (expandedGroupsProp) {
            setExpandedGroups(expandedGroupsProp);
        }
    }, [expandedGroupsProp]);

    const toggleGroup = (key) => {
        const updatedGroups = {
            ...expandedGroups,
            [key]: !expandedGroups[key],
        };
        setExpandedGroups(updatedGroups);
        if (setProps) {
            setProps({ expandedGroups: updatedGroups });
        }
    };

    const groupData = (data, groupByField) => {
        return data.reduce((acc, row) => {
            const key = row[groupByField];
            if (!acc[key]) acc[key] = [];
            acc[key].push(row);
            return acc;
        }, {});
    };

    const aggregateGroup = (group, cols, aggrFunc) => {
        return cols.reduce((acc, col) => {
            acc[col] = aggrFunc(group.map((row) => row[col]));
            return acc;
        }, {});
    };

    const aggregations = {
        sum: (values) => values.reduce((a, b) => a + b, 0),
        mean: (values) =>
            values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0,
    };

    const evaluateCondition = (value, operator, comparisonValue) => {
        switch (operator) {
            case '>':
                return value > comparisonValue;
            case '<':
                return value < comparisonValue;
            case '>=':
                return value >= comparisonValue;
            case '<=':
                return value <= comparisonValue;
            case '==':
                return value === comparisonValue;
            case '!=':
                return value !== comparisonValue;
            default:
                return false;
        }
    };

    /**
     * applyConditionalStyles applies styles to EVERY row (group or data),
     * based on columnName, operator, and comparison value only.
     */
    const applyConditionalStyles = (value, columnName) => {
        // Find all style rules that match the column name AND pass the evaluateCondition
        const matchedStyles = conditionalStyles.filter(({ condition }) => {
            if (condition.columnName !== columnName) return false;
            return evaluateCondition(value, condition.operator, condition.value);
        });

        // Merge the style objects of all matched conditions
        return matchedStyles.reduce((acc, { style }) => ({ ...acc, ...style }), {});
    };

    const reorderColumns = (columns, level1, level2) => {
        const reordered = [];
        if (level1) reordered.push(level1);
        if (level2) reordered.push(level2);
        columns.forEach((col) => {
            if (col !== level1 && col !== level2) {
                reordered.push(col);
            }
        });
        return reordered;
    };

    const allColumns = data.length > 0 ? Object.keys(data[0]) : [];
    const reorderedColumns = reorderColumns(allColumns, level1Group, level2Group);

    const renderRows = () => {
        const rows = [];
        const groupedByLevel1 = groupData(data, level1Group);

        for (const level1Key in groupedByLevel1) {
            const level1GroupData = groupedByLevel1[level1Key];
            const level1Totals = aggregateGroup(
                level1GroupData,
                aggrCols,
                aggregations[aggrFunction]
            );

            // Level 1 row
            rows.push(
                <tr
                    key={`level1-${level1Key}`}
                    className="group-row level1"
                    onClick={() => toggleGroup(level1Key)}
                >
                    {reorderedColumns.map((col) =>
                        col === level1Group ? (
                            <td
                                key={`level1-${level1Key}-${col}`}
                                colSpan="1"
                                className="group-cell"
                                style={applyConditionalStyles(level1Key, col)}
                            >
                                {expandedGroups[level1Key] ? '▼' : '▶'} {level1Key}
                            </td>
                        ) : aggrCols.includes(col) ? (
                            <td
                                key={`level1-${level1Key}-${col}`}
                                className="aggr-cell"
                                style={applyConditionalStyles(level1Totals[col], col)}
                            >
                                {level1Totals[col]
                                    ? level1Totals[col].toFixed(2)
                                    : ''}
                            </td>
                        ) : (
                            <td
                                key={`level1-${level1Key}-${col}`}
                                className="empty-cell"
                                style={applyConditionalStyles(null, col)}
                            >
                                -
                            </td>
                        )
                    )}
                </tr>
            );

            // If expanded and level2Group is provided, show level 2 rows
            if (expandedGroups[level1Key] && level2Group) {
                const groupedByLevel2 = groupData(level1GroupData, level2Group);

                for (const level2Key in groupedByLevel2) {
                    const level2GroupData = groupedByLevel2[level2Key];
                    const level2Totals = aggregateGroup(
                        level2GroupData,
                        aggrCols,
                        aggregations[aggrFunction]
                    );

                    // Level 2 row
                    rows.push(
                        <tr
                            key={`level2-${level1Key}-${level2Key}`}
                            className="group-row level2"
                            onClick={() => toggleGroup(`${level1Key}-${level2Key}`)}
                        >
                            {reorderedColumns.map((col) =>
                                col === level2Group ? (
                                    <td
                                        key={`level2-${level1Key}-${level2Key}-${col}`}
                                        className="group-cell"
                                        style={applyConditionalStyles(level2Key, col)}
                                    >
                                        {expandedGroups[`${level1Key}-${level2Key}`]
                                            ? '▼'
                                            : '▶'}{' '}
                                        {level2Key}
                                    </td>
                                ) : aggrCols.includes(col) ? (
                                    <td
                                        key={`level2-${level1Key}-${level2Key}-${col}`}
                                        className="aggr-cell"
                                        style={applyConditionalStyles(level2Totals[col], col)}
                                    >
                                        {level2Totals[col]
                                            ? level2Totals[col].toFixed(2)
                                            : ''}
                                    </td>
                                ) : (
                                    <td
                                        key={`level2-${level1Key}-${level2Key}-${col}`}
                                        className="empty-cell"
                                        style={applyConditionalStyles(null, col)}
                                    >
                                        -
                                    </td>
                                )
                            )}
                        </tr>
                    );

                    // Level 2 row’s data rows (if expanded)
                    if (expandedGroups[`${level1Key}-${level2Key}`]) {
                        level2GroupData.forEach((row, index) => {
                            rows.push(
                                <tr
                                    key={`row-${level1Key}-${level2Key}-${index}`}
                                    className={`data-row ${index % 2 === 0 ? 'zebra' : ''}`}
                                >
                                    {reorderedColumns.map((col) => (
                                        <td
                                            key={`row-${level1Key}-${level2Key}-${col}-${index}`}
                                            className="data-cell"
                                            style={applyConditionalStyles(row[col], col)}
                                        >
                                            {row[col]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        });
                    }
                }
            } 
            // Otherwise, just show data rows under level 1
            else if (expandedGroups[level1Key]) {
                level1GroupData.forEach((row, index) => {
                    rows.push(
                        <tr
                            key={`row-${level1Key}-${index}`}
                            className={`data-row ${index % 2 === 0 ? 'zebra' : ''}`}
                        >
                            {reorderedColumns.map((col) => (
                                <td
                                    key={`row-${level1Key}-${col}-${index}`}
                                    className="data-cell"
                                    style={applyConditionalStyles(row[col], col)}
                                >
                                    {row[col]}
                                </td>
                            ))}
                        </tr>
                    );
                });
            }
        }

        return rows;
    };

    return (
        <>
            <style>
                {`
                .styled-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    border: 1px solid #ccc;
                }
                .header-row {
                    background-color: #f5f5f5;
                    font-weight: bold;
                    text-align: left;
                }
                .header-cell {
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                .group-row {
                    font-weight: bold;
                    cursor: pointer;
                    text-align: left;
                }
                .level1 {
                    background-color: #f0f0f0;
                }
                .level2 {
                    background-color: #e8e8e8;
                }
                .group-cell {
                    padding: 10px;
                }
                .aggr-cell {
                    text-align: center;
                    font-weight: bold;
                    padding: 10px;
                }
                .empty-cell {
                    text-align: center;
                    padding: 10px;
                }
                .data-row {
                    background-color: white;
                    transition: background-color 0.3s ease;
                }
                .data-row:hover {
                    background-color: #f9f9f9;
                }
                .zebra {
                    background-color: #f5f5f5;
                }
                .data-cell {
                    padding: 10px;
                    text-align: center;
                    border: 1px solid #ccc;
                }
                `}
            </style>
            <table id={id} className="styled-table">
                <thead>
                    <tr className="header-row">
                        {reorderedColumns.map((col) => (
                            <th key={`header-${col}`} className="header-cell">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </>
    );
};

FlexiTable.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    level1Group: PropTypes.string,
    level2Group: PropTypes.string,
    aggrFunction: PropTypes.oneOf(['sum', 'mean']),
    aggrCols: PropTypes.arrayOf(PropTypes.string),
    /**
     * Notice that we removed isGroupLevel from here;
     * we only rely on columnName, operator, and value.
     */
    conditionalStyles: PropTypes.arrayOf(
        PropTypes.shape({
            condition: PropTypes.shape({
                columnName: PropTypes.string.isRequired,
                operator: PropTypes.oneOf(['>', '<', '>=', '<=', '==', '!='])
                    .isRequired,
                value: PropTypes.any.isRequired,
            }).isRequired,
            style: PropTypes.object.isRequired,
        })
    ),
    expandedGroups: PropTypes.object,
    setProps: PropTypes.func,
};

export default FlexiTable;
