import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    ChevronRight,
    Search,
    Download,
    Rows3,
    Rows2,
    Table as TableIcon,
    Inbox,
} from 'lucide-react';

/**
 * FlexiTable — enterprise-grade hierarchical data table.
 *
 * Backward-compatible with the original API (id, data, level1Group, level2Group,
 * aggrFunction, aggrCols, conditionalStyles, expandedGroups, setProps) and adds
 * optional props for title/description, search, density, export, theme, and
 * numeric formatting. All new props are optional.
 */
const FlexiTable = ({
    id,
    data = [],
    level1Group = null,
    level2Group = null,
    aggrFunction = 'sum',
    aggrCols = [],
    conditionalStyles = [],
    expandedGroups: expandedGroupsProp,
    title = null,
    description = null,
    searchable = false,
    exportable = false,
    density: densityProp = 'comfortable',
    theme = 'light',
    stickyHeader = true,
    stripe = true,
    emptyMessage = 'No data to display',
    numberFormat,
    showTotals = false,
    totalCols = null,
    totalFunction = null,
    totalLabel = 'Total',
    stickyFooter = false,
    setProps,
}) => {
    const [expandedGroups, setExpandedGroups] = useState(expandedGroupsProp || {});
    const [query, setQuery] = useState('');
    const [density, setDensity] = useState(densityProp);
    const rootRef = useRef(null);

    useEffect(() => {
        if (expandedGroupsProp) setExpandedGroups(expandedGroupsProp);
    }, [expandedGroupsProp]);

    useEffect(() => setDensity(densityProp), [densityProp]);

    const toggleGroup = useCallback(
        (key) => {
            const next = { ...expandedGroups, [key]: !expandedGroups[key] };
            setExpandedGroups(next);
            if (setProps) setProps({ expandedGroups: next });
        },
        [expandedGroups, setProps]
    );

    const aggregations = useMemo(
        () => ({
            sum: (values) => values.reduce((a, b) => a + (Number(b) || 0), 0),
            mean: (values) => {
                const nums = values.map((v) => Number(v) || 0);
                return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
            },
        }),
        []
    );

    const aggregate = useCallback(
        (rows, cols) =>
            cols.reduce((acc, col) => {
                acc[col] = aggregations[aggrFunction](rows.map((r) => r[col]));
                return acc;
            }, {}),
        [aggregations, aggrFunction]
    );

    const groupBy = (rows, field) =>
        rows.reduce((acc, row) => {
            const key = row[field];
            if (!acc[key]) acc[key] = [];
            acc[key].push(row);
            return acc;
        }, {});

    const evaluateCondition = (value, operator, comparison) => {
        switch (operator) {
            case '>': return value > comparison;
            case '<': return value < comparison;
            case '>=': return value >= comparison;
            case '<=': return value <= comparison;
            case '==': return value === comparison;
            case '!=': return value !== comparison;
            default: return false;
        }
    };

    const resolveConditionalStyle = (value, columnName) => {
        const matched = conditionalStyles.filter(({ condition }) => {
            if (condition.columnName !== columnName) return false;
            return evaluateCondition(value, condition.operator, condition.value);
        });
        return matched.reduce((acc, { style }) => ({ ...acc, ...style }), {});
    };

    const allColumns = data.length > 0 ? Object.keys(data[0]) : [];

    const numericColumns = useMemo(() => {
        const set = new Set(aggrCols);
        if (data.length) {
            allColumns.forEach((col) => {
                const sample = data.slice(0, 20).map((r) => r[col]);
                if (sample.every((v) => v === null || v === undefined || v === '' || typeof v === 'number')) {
                    if (sample.some((v) => typeof v === 'number')) set.add(col);
                }
            });
        }
        return set;
    }, [data, aggrCols, allColumns]);

    const reorderedColumns = useMemo(() => {
        const out = [];
        if (level1Group) out.push(level1Group);
        if (level2Group && level2Group !== level1Group) out.push(level2Group);
        allColumns.forEach((c) => {
            if (c !== level1Group && c !== level2Group) out.push(c);
        });
        return out;
    }, [allColumns, level1Group, level2Group]);

    const filteredData = useMemo(() => {
        if (!query.trim()) return data;
        const q = query.toLowerCase();
        return data.filter((row) =>
            Object.values(row).some((v) => String(v).toLowerCase().includes(q))
        );
    }, [data, query]);

    const resolvedTotalCols = useMemo(() => {
        if (totalCols && totalCols.length) return totalCols;
        return Array.from(numericColumns);
    }, [totalCols, numericColumns]);

    const totals = useMemo(() => {
        if (!showTotals || !resolvedTotalCols.length) return null;
        const fn = aggregations[totalFunction || 'sum'] || aggregations.sum;
        return resolvedTotalCols.reduce((acc, col) => {
            acc[col] = fn(filteredData.map((r) => r[col]));
            return acc;
        }, {});
    }, [showTotals, resolvedTotalCols, filteredData, aggregations, totalFunction]);

    const fmtNumber = useCallback(
        (n) => {
            if (n === null || n === undefined || n === '' || Number.isNaN(n)) return '';
            if (typeof numberFormat === 'function') return numberFormat(n);
            const num = Number(n);
            if (!Number.isFinite(num)) return String(n);
            return num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
        [numberFormat]
    );

    const downloadCsv = useCallback(() => {
        if (!data.length) return;
        const esc = (v) => {
            const s = v === null || v === undefined ? '' : String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const header = reorderedColumns.join(',');
        const body = data.map((r) => reorderedColumns.map((c) => esc(r[c])).join(',')).join('\n');
        const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id || 'flexi-table'}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [data, reorderedColumns, id]);

    const renderCellContent = (value, col, opts = {}) => {
        const { isAggregate, isGroupLabel, groupIcon } = opts;
        if (isGroupLabel) {
            return (
                <span className="ft-group-label">
                    {groupIcon}
                    <span className="ft-group-text">{String(value)}</span>
                </span>
            );
        }
        if (isAggregate || numericColumns.has(col)) {
            return <span className="ft-num">{fmtNumber(value)}</span>;
        }
        if (value === null || value === undefined || value === '') {
            return <span className="ft-muted">—</span>;
        }
        return String(value);
    };

    const renderRows = () => {
        const rows = [];
        if (!filteredData.length) return rows;

        if (!level1Group) {
            filteredData.forEach((row, i) => {
                rows.push(
                    <tr key={`row-${i}`} className="ft-data-row">
                        {reorderedColumns.map((col) => (
                            <td
                                key={`cell-${i}-${col}`}
                                className={`ft-td ${numericColumns.has(col) ? 'ft-td-num' : ''}`}
                                style={resolveConditionalStyle(row[col], col)}
                            >
                                {renderCellContent(row[col], col)}
                            </td>
                        ))}
                    </tr>
                );
            });
            return rows;
        }

        const groupedL1 = groupBy(filteredData, level1Group);

        Object.keys(groupedL1).forEach((l1Key) => {
            const l1Rows = groupedL1[l1Key];
            const l1Totals = aggregate(l1Rows, aggrCols);
            const l1Expanded = !!expandedGroups[l1Key];

            rows.push(
                <tr
                    key={`l1-${l1Key}`}
                    className={`ft-group-row ft-level-1 ${l1Expanded ? 'is-expanded' : ''}`}
                    role="row"
                    aria-expanded={l1Expanded}
                    tabIndex={0}
                    onClick={() => toggleGroup(l1Key)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleGroup(l1Key);
                        }
                    }}
                >
                    {reorderedColumns.map((col) => {
                        if (col === level1Group) {
                            return (
                                <td
                                    key={`l1-${l1Key}-${col}`}
                                    className="ft-td ft-group-cell"
                                    style={resolveConditionalStyle(l1Key, col)}
                                >
                                    {renderCellContent(l1Key, col, {
                                        isGroupLabel: true,
                                        groupIcon: (
                                            <ChevronRight
                                                size={14}
                                                className={`ft-chevron ${l1Expanded ? 'ft-chevron-open' : ''}`}
                                                aria-hidden="true"
                                            />
                                        ),
                                    })}
                                </td>
                            );
                        }
                        if (aggrCols.includes(col)) {
                            return (
                                <td
                                    key={`l1-${l1Key}-${col}`}
                                    className="ft-td ft-td-num ft-aggr-cell"
                                    style={resolveConditionalStyle(l1Totals[col], col)}
                                >
                                    {renderCellContent(l1Totals[col], col, { isAggregate: true })}
                                </td>
                            );
                        }
                        return (
                            <td
                                key={`l1-${l1Key}-${col}`}
                                className="ft-td ft-empty-cell"
                                style={resolveConditionalStyle(null, col)}
                            >
                                <span className="ft-muted">—</span>
                            </td>
                        );
                    })}
                </tr>
            );

            if (!l1Expanded) return;

            if (level2Group) {
                const groupedL2 = groupBy(l1Rows, level2Group);

                Object.keys(groupedL2).forEach((l2Key) => {
                    const l2Rows = groupedL2[l2Key];
                    const l2Totals = aggregate(l2Rows, aggrCols);
                    const l2Id = `${l1Key}-${l2Key}`;
                    const l2Expanded = !!expandedGroups[l2Id];

                    rows.push(
                        <tr
                            key={`l2-${l2Id}`}
                            className={`ft-group-row ft-level-2 ${l2Expanded ? 'is-expanded' : ''}`}
                            role="row"
                            aria-expanded={l2Expanded}
                            tabIndex={0}
                            onClick={() => toggleGroup(l2Id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleGroup(l2Id);
                                }
                            }}
                        >
                            {reorderedColumns.map((col) => {
                                if (col === level2Group) {
                                    return (
                                        <td
                                            key={`l2-${l2Id}-${col}`}
                                            className="ft-td ft-group-cell ft-indent-1"
                                            style={resolveConditionalStyle(l2Key, col)}
                                        >
                                            {renderCellContent(l2Key, col, {
                                                isGroupLabel: true,
                                                groupIcon: (
                                                    <ChevronRight
                                                        size={14}
                                                        className={`ft-chevron ${l2Expanded ? 'ft-chevron-open' : ''}`}
                                                        aria-hidden="true"
                                                    />
                                                ),
                                            })}
                                        </td>
                                    );
                                }
                                if (col === level1Group) {
                                    return (
                                        <td
                                            key={`l2-${l2Id}-${col}`}
                                            className="ft-td ft-empty-cell"
                                        />
                                    );
                                }
                                if (aggrCols.includes(col)) {
                                    return (
                                        <td
                                            key={`l2-${l2Id}-${col}`}
                                            className="ft-td ft-td-num ft-aggr-cell"
                                            style={resolveConditionalStyle(l2Totals[col], col)}
                                        >
                                            {renderCellContent(l2Totals[col], col, { isAggregate: true })}
                                        </td>
                                    );
                                }
                                return (
                                    <td
                                        key={`l2-${l2Id}-${col}`}
                                        className="ft-td ft-empty-cell"
                                        style={resolveConditionalStyle(null, col)}
                                    >
                                        <span className="ft-muted">—</span>
                                    </td>
                                );
                            })}
                        </tr>
                    );

                    if (l2Expanded) {
                        l2Rows.forEach((row, idx) => {
                            rows.push(
                                <tr
                                    key={`row-${l2Id}-${idx}`}
                                    className="ft-data-row ft-data-row-nested"
                                >
                                    {reorderedColumns.map((col) => {
                                        const indentClass =
                                            col === level1Group
                                                ? 'ft-indent-1'
                                                : col === level2Group
                                                    ? 'ft-indent-2'
                                                    : '';
                                        return (
                                            <td
                                                key={`row-${l2Id}-${idx}-${col}`}
                                                className={`ft-td ${numericColumns.has(col) ? 'ft-td-num' : ''} ${indentClass}`}
                                                style={resolveConditionalStyle(row[col], col)}
                                            >
                                                {renderCellContent(row[col], col)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        });
                    }
                });
            } else {
                l1Rows.forEach((row, idx) => {
                    rows.push(
                        <tr
                            key={`row-${l1Key}-${idx}`}
                            className="ft-data-row ft-data-row-nested"
                        >
                            {reorderedColumns.map((col) => {
                                const indentClass = col === level1Group ? 'ft-indent-1' : '';
                                return (
                                    <td
                                        key={`row-${l1Key}-${idx}-${col}`}
                                        className={`ft-td ${numericColumns.has(col) ? 'ft-td-num' : ''} ${indentClass}`}
                                        style={resolveConditionalStyle(row[col], col)}
                                    >
                                        {renderCellContent(row[col], col)}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                });
            }
        });

        return rows;
    };

    const hasToolbar =
        title || description || searchable || exportable || densityProp !== 'fixed';
    const rootClass = [
        'ft-root',
        `ft-theme-${theme}`,
        `ft-density-${density}`,
        stickyHeader ? 'ft-sticky-header' : '',
        stripe ? 'ft-stripe' : '',
    ].filter(Boolean).join(' ');

    const tableRows = renderRows();

    return (
        <div className={rootClass} ref={rootRef} data-testid={id}>
            <style>{FLEXI_TABLE_CSS}</style>

            {hasToolbar && (
                <div className="ft-toolbar">
                    <div className="ft-toolbar-left">
                        {title && (
                            <div className="ft-title-block">
                                <div className="ft-title-row">
                                    <TableIcon size={16} className="ft-title-icon" aria-hidden="true" />
                                    <h3 className="ft-title">{title}</h3>
                                </div>
                                {description && <p className="ft-description">{description}</p>}
                            </div>
                        )}
                    </div>

                    <div className="ft-toolbar-right">
                        {searchable && (
                            <div className="ft-search">
                                <Search size={14} className="ft-search-icon" aria-hidden="true" />
                                <input
                                    type="text"
                                    className="ft-search-input"
                                    placeholder="Search…"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-label="Search table"
                                />
                            </div>
                        )}

                        <div className="ft-density-toggle" role="group" aria-label="Density">
                            <button
                                type="button"
                                className={`ft-icon-btn ${density === 'comfortable' ? 'is-active' : ''}`}
                                onClick={() => setDensity('comfortable')}
                                aria-label="Comfortable density"
                                title="Comfortable"
                            >
                                <Rows3 size={14} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className={`ft-icon-btn ${density === 'compact' ? 'is-active' : ''}`}
                                onClick={() => setDensity('compact')}
                                aria-label="Compact density"
                                title="Compact"
                            >
                                <Rows2 size={14} aria-hidden="true" />
                            </button>
                        </div>

                        {exportable && (
                            <button
                                type="button"
                                className="ft-btn ft-btn-ghost"
                                onClick={downloadCsv}
                                aria-label="Export CSV"
                                title="Export CSV"
                            >
                                <Download size={14} aria-hidden="true" />
                                <span>Export</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="ft-scroll">
                <table id={id} className="ft-table" role="treegrid">
                    <thead>
                        <tr className="ft-header-row">
                            {reorderedColumns.map((col) => (
                                <th
                                    key={`header-${col}`}
                                    className={`ft-th ${numericColumns.has(col) ? 'ft-th-num' : ''}`}
                                    scope="col"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>{tableRows}</tbody>
                    {totals && tableRows.length > 0 && (
                        <tfoot className={`ft-tfoot ${stickyFooter ? 'ft-sticky-footer' : ''}`}>
                            <tr className="ft-foot-row">
                                {reorderedColumns.map((col, i) => {
                                    if (resolvedTotalCols.includes(col)) {
                                        return (
                                            <td
                                                key={`foot-${col}`}
                                                className="ft-tf ft-tf-num"
                                                style={resolveConditionalStyle(totals[col], col)}
                                            >
                                                <span className="ft-num">{fmtNumber(totals[col])}</span>
                                            </td>
                                        );
                                    }
                                    if (i === 0) {
                                        return (
                                            <td key={`foot-${col}`} className="ft-tf ft-tf-label">
                                                {totalLabel}
                                            </td>
                                        );
                                    }
                                    return <td key={`foot-${col}`} className="ft-tf" />;
                                })}
                            </tr>
                        </tfoot>
                    )}
                </table>

                {tableRows.length === 0 && (
                    <div className="ft-empty">
                        <Inbox size={28} aria-hidden="true" className="ft-empty-icon" />
                        <div className="ft-empty-text">{emptyMessage}</div>
                        {query && (
                            <div className="ft-empty-hint">
                                No rows match <em>"{query}"</em>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ------------------------------- styles ------------------------------- */

const FLEXI_TABLE_CSS = `
.ft-root {
  --ft-bg: #ffffff;
  --ft-bg-elevated: #ffffff;
  --ft-surface: #f8fafc;
  --ft-surface-2: #f1f5f9;
  --ft-surface-hover: #f1f5f9;
  --ft-border: #e5e7eb;
  --ft-border-strong: #d4d8de;
  --ft-text: #0f172a;
  --ft-text-muted: #64748b;
  --ft-text-subtle: #94a3b8;
  --ft-accent: #4f46e5;
  --ft-accent-soft: #eef2ff;
  --ft-level-1-bg: #f8fafc;
  --ft-level-2-bg: #fbfcfd;
  --ft-row-stripe: #fafbfc;
  --ft-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --ft-shadow-md: 0 4px 16px -8px rgba(15, 23, 42, 0.08),
                  0 1px 3px rgba(15, 23, 42, 0.04);
  --ft-radius: 12px;
  --ft-radius-sm: 6px;
  --ft-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto,
             "Helvetica Neue", Arial, sans-serif;
  --ft-mono: "SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --ft-row-h: 44px;
  --ft-cell-px: 14px;
  --ft-font-size: 13.5px;
  --ft-header-size: 11px;

  font-family: var(--ft-font);
  color: var(--ft-text);
  background: var(--ft-bg-elevated);
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius);
  box-shadow: var(--ft-shadow-md);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ft-root *, .ft-root *::before, .ft-root *::after { box-sizing: border-box; }

.ft-theme-dark {
  --ft-bg: #0b1020;
  --ft-bg-elevated: #0f172a;
  --ft-surface: #111a2e;
  --ft-surface-2: #152038;
  --ft-surface-hover: #172241;
  --ft-border: #1f2a44;
  --ft-border-strong: #2a3757;
  --ft-text: #e6ecff;
  --ft-text-muted: #94a3b8;
  --ft-text-subtle: #64748b;
  --ft-accent: #818cf8;
  --ft-accent-soft: #1e1b4b;
  --ft-level-1-bg: #111a2e;
  --ft-level-2-bg: #0f1729;
  --ft-row-stripe: #0d1426;
  --ft-shadow-md: 0 4px 16px -8px rgba(0,0,0,0.5),
                  0 1px 3px rgba(0,0,0,0.3);
}

.ft-density-compact { --ft-row-h: 34px; --ft-cell-px: 10px; --ft-font-size: 12.5px; }
.ft-density-comfortable { --ft-row-h: 44px; --ft-cell-px: 14px; --ft-font-size: 13.5px; }

.ft-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--ft-border);
  background: var(--ft-bg-elevated);
  flex-wrap: wrap;
}

.ft-toolbar-left { flex: 1 1 auto; min-width: 0; }
.ft-toolbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.ft-title-block { min-width: 0; }
.ft-title-row { display: flex; align-items: center; gap: 8px; }
.ft-title-icon { color: var(--ft-text-muted); flex: 0 0 auto; }
.ft-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ft-text);
  line-height: 1.2;
}
.ft-description {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--ft-text-muted);
  line-height: 1.4;
}

.ft-search {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.ft-search-icon {
  position: absolute;
  left: 10px;
  color: var(--ft-text-subtle);
  pointer-events: none;
}
.ft-search-input {
  font: inherit;
  font-size: 13px;
  color: var(--ft-text);
  background: var(--ft-surface);
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-sm);
  padding: 7px 10px 7px 30px;
  width: 200px;
  outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.ft-search-input::placeholder { color: var(--ft-text-subtle); }
.ft-search-input:focus {
  border-color: var(--ft-accent);
  background: var(--ft-bg);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ft-accent) 18%, transparent);
}

.ft-density-toggle {
  display: inline-flex;
  background: var(--ft-surface);
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-sm);
  padding: 2px;
  gap: 2px;
}
.ft-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 5px 7px;
  border-radius: 4px;
  color: var(--ft-text-muted);
  cursor: pointer;
  transition: background .15s, color .15s;
}
.ft-icon-btn:hover { color: var(--ft-text); background: var(--ft-surface-2); }
.ft-icon-btn.is-active { color: var(--ft-text); background: var(--ft-bg); box-shadow: var(--ft-shadow-sm); }

.ft-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ft-text);
  background: var(--ft-surface);
  border: 1px solid var(--ft-border);
  padding: 6px 10px;
  border-radius: var(--ft-radius-sm);
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .05s;
}
.ft-btn:hover { background: var(--ft-surface-2); border-color: var(--ft-border-strong); }
.ft-btn:active { transform: translateY(1px); }
.ft-btn-ghost { background: transparent; }

.ft-scroll {
  width: 100%;
  overflow: auto;
  max-height: inherit;
}

.ft-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--ft-font-size);
  color: var(--ft-text);
}

.ft-header-row { background: var(--ft-surface); }

.ft-sticky-header thead .ft-th {
  position: sticky;
  top: 0;
  z-index: 2;
}

.ft-th {
  text-align: left;
  font-size: var(--ft-header-size);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ft-text-muted);
  padding: 10px var(--ft-cell-px);
  background: var(--ft-surface);
  border-bottom: 1px solid var(--ft-border);
  white-space: nowrap;
  user-select: none;
}
.ft-th-num { text-align: right; font-variant-numeric: tabular-nums; }

.ft-td {
  padding: 0 var(--ft-cell-px);
  height: var(--ft-row-h);
  border-bottom: 1px solid var(--ft-border);
  vertical-align: middle;
  line-height: 1.35;
}
.ft-td-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.ft-num { font-family: var(--ft-mono); font-size: calc(var(--ft-font-size) - 0.5px); }
.ft-muted { color: var(--ft-text-subtle); }

.ft-data-row { background: var(--ft-bg-elevated); transition: background-color .12s ease; }
.ft-data-row:hover { background: var(--ft-surface-hover); }
.ft-stripe .ft-data-row-nested:nth-child(odd) { background: var(--ft-row-stripe); }
.ft-stripe .ft-data-row-nested:nth-child(odd):hover { background: var(--ft-surface-hover); }

.ft-group-row {
  cursor: pointer;
  user-select: none;
  transition: background-color .12s ease;
}
.ft-group-row:focus-visible {
  outline: 2px solid var(--ft-accent);
  outline-offset: -2px;
}
.ft-level-1 { background: var(--ft-level-1-bg); font-weight: 600; }
.ft-level-1:hover { background: var(--ft-surface-hover); }
.ft-level-2 { background: var(--ft-level-2-bg); font-weight: 500; }
.ft-level-2:hover { background: var(--ft-surface-hover); }

.ft-group-cell { font-weight: 600; color: var(--ft-text); }
.ft-level-2 .ft-group-cell { font-weight: 500; }

.ft-group-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ft-group-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ft-chevron {
  color: var(--ft-text-muted);
  transition: transform .18s cubic-bezier(.4,0,.2,1);
  flex: 0 0 auto;
}
.ft-chevron-open { transform: rotate(90deg); color: var(--ft-accent); }

.ft-aggr-cell { font-weight: 600; }
.ft-level-2 .ft-aggr-cell { font-weight: 500; }
.ft-empty-cell { color: var(--ft-text-subtle); }

.ft-indent-1 { padding-left: calc(var(--ft-cell-px) + 18px); }
.ft-indent-2 { padding-left: calc(var(--ft-cell-px) + 36px); }

.ft-data-row .ft-td:first-child { position: relative; }
.ft-data-row-nested .ft-td.ft-indent-1::before,
.ft-data-row-nested .ft-td.ft-indent-2::before {
  content: "";
  position: absolute;
  left: calc(var(--ft-cell-px) + 4px);
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--ft-border);
  opacity: .8;
}

.ft-table tbody tr:last-child .ft-td { border-bottom: 0; }

.ft-tfoot { background: var(--ft-surface); }
.ft-foot-row { background: var(--ft-surface); }
.ft-tf {
  padding: 0 var(--ft-cell-px);
  height: var(--ft-row-h);
  border-top: 1px solid var(--ft-border-strong);
  vertical-align: middle;
  font-weight: 600;
  color: var(--ft-text);
  background: var(--ft-surface);
}
.ft-tf-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.ft-tf-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ft-text-muted);
}
.ft-sticky-footer .ft-tf {
  position: sticky;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -1px 0 var(--ft-border-strong);
}

.ft-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 48px 16px;
  color: var(--ft-text-muted);
  text-align: center;
}
.ft-empty-icon { color: var(--ft-text-subtle); margin-bottom: 4px; }
.ft-empty-text { font-size: 14px; font-weight: 500; color: var(--ft-text); }
.ft-empty-hint { font-size: 12.5px; color: var(--ft-text-muted); }

@media (max-width: 640px) {
  .ft-toolbar { flex-direction: column; align-items: stretch; }
  .ft-toolbar-right { justify-content: flex-start; }
  .ft-search-input { width: 100%; }
  .ft-search { flex: 1 1 auto; }
}
`;

FlexiTable.propTypes = {
    /** Dash-provided id. */
    id: PropTypes.string.isRequired,
    /** Row objects. Columns are inferred from the first row's keys. */
    data: PropTypes.arrayOf(PropTypes.object),
    /** Field used for level-1 grouping. */
    level1Group: PropTypes.string,
    /** Field used for level-2 grouping (optional). */
    level2Group: PropTypes.string,
    /** Aggregation function applied to `aggrCols`. */
    aggrFunction: PropTypes.oneOf(['sum', 'mean']),
    /** Columns whose values are aggregated at group rows. */
    aggrCols: PropTypes.arrayOf(PropTypes.string),
    /** Conditional styles applied per-cell; each rule matches a column and operator. */
    conditionalStyles: PropTypes.arrayOf(
        PropTypes.shape({
            condition: PropTypes.shape({
                columnName: PropTypes.string.isRequired,
                operator: PropTypes.oneOf(['>', '<', '>=', '<=', '==', '!=']).isRequired,
                value: PropTypes.any.isRequired,
            }).isRequired,
            style: PropTypes.object.isRequired,
        })
    ),
    /** Controlled map of groupKey → expanded boolean. */
    expandedGroups: PropTypes.object,
    /** Optional title displayed in the toolbar. */
    title: PropTypes.string,
    /** Optional subtitle / description below the title. */
    description: PropTypes.string,
    /** Show a search input in the toolbar. */
    searchable: PropTypes.bool,
    /** Show an "Export CSV" button in the toolbar. */
    exportable: PropTypes.bool,
    /** Row density. */
    density: PropTypes.oneOf(['comfortable', 'compact']),
    /** Visual theme. */
    theme: PropTypes.oneOf(['light', 'dark']),
    /** Whether the header row stays pinned when scrolling. */
    stickyHeader: PropTypes.bool,
    /** Whether zebra striping is applied to data rows. */
    stripe: PropTypes.bool,
    /** Message shown when there is no data. */
    emptyMessage: PropTypes.string,
    /** Optional function to format numeric cells. Receives the raw value. */
    numberFormat: PropTypes.func,
    /** Show a grand-totals footer row beneath the table. */
    showTotals: PropTypes.bool,
    /** Columns to total in the footer. Defaults to every numeric column. */
    totalCols: PropTypes.arrayOf(PropTypes.string),
    /** Aggregation function for the footer row. Defaults to `'sum'`. */
    totalFunction: PropTypes.oneOf(['sum', 'mean']),
    /** Label rendered in the first column of the totals footer. */
    totalLabel: PropTypes.string,
    /** Whether the totals footer stays pinned to the bottom on scroll. */
    stickyFooter: PropTypes.bool,
    /** Dash-provided setProps for two-way binding. */
    setProps: PropTypes.func,
};

export default FlexiTable;
