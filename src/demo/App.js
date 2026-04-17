import React, { useState } from 'react';
import FlexiTable from '../lib/components/FlexiTable.react';

const sampleData = [
    { region: 'Americas', country: 'USA',     sales: 524300, profit: 152000, manager: 'John Doe' },
    { region: 'Americas', country: 'USA',     sales: 312800, profit:  75400, manager: 'John Doe' },
    { region: 'Americas', country: 'Canada',  sales: 418500, profit: 121000, manager: 'Jane Smith' },
    { region: 'Americas', country: 'Brazil',  sales: 201000, profit:  48000, manager: 'Ana Souza' },
    { region: 'EMEA',     country: 'Germany', sales: 612400, profit: 204000, manager: 'Peter Jones' },
    { region: 'EMEA',     country: 'France',  sales: 456100, profit: 131500, manager: 'Peter Jones' },
    { region: 'EMEA',     country: 'France',  sales: 348700, profit:  91200, manager: 'Chris Green' },
    { region: 'EMEA',     country: 'UK',      sales: 389200, profit: 104800, manager: 'Olivia Clark' },
    { region: 'APAC',     country: 'Japan',   sales: 702900, profit: 251300, manager: 'Yuki Tanaka' },
    { region: 'APAC',     country: 'India',   sales: 281400, profit:  68900, manager: 'Ravi Menon' },
    { region: 'APAC',     country: 'India',   sales: 199800, profit:  42100, manager: 'Ravi Menon' },
    { region: 'APAC',     country: 'Korea',   sales: 337600, profit:  88700, manager: 'Minji Park' },
];

const conditionalStyles = [
    {
        condition: { columnName: 'sales', operator: '>=', value: 500000 },
        style: { color: '#15803d', fontWeight: 600 },
    },
    {
        condition: { columnName: 'sales', operator: '<', value: 250000 },
        style: { color: '#b91c1c' },
    },
    {
        condition: { columnName: 'profit', operator: '>=', value: 150000 },
        style: { color: '#1d4ed8', fontWeight: 600 },
    },
];

const pageStyle = {
    minHeight: '100vh',
    background:
        'radial-gradient(1200px 600px at 10% -10%, #eef2ff 0%, transparent 60%),' +
        'radial-gradient(1000px 500px at 100% 0%, #ecfeff 0%, transparent 55%),' +
        '#f8fafc',
    padding: '48px 24px',
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#0f172a',
};

const shellStyle = {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gap: 32,
};

const headerStyle = { marginBottom: 8 };

const eyebrowStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#4f46e5',
    background: '#eef2ff',
    padding: '4px 10px',
    borderRadius: 999,
    marginBottom: 14,
};

const h1Style = {
    fontSize: 34,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    margin: '0 0 10px',
    color: '#0f172a',
};

const leadStyle = {
    margin: 0,
    color: '#475569',
    fontSize: 16,
    lineHeight: 1.55,
    maxWidth: 720,
};

const sectionLabel = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    margin: '0 0 12px',
};

function App() {
    const [expanded, setExpanded] = useState({
        Americas: true,
        EMEA: true,
        APAC: true,
    });

    return (
        <div style={pageStyle}>
            <div style={shellStyle}>
                <header style={headerStyle}>
                    <span style={eyebrowStyle}>FlexiTable · v0.1</span>
                    <h1 style={h1Style}>Hierarchical tables for Python data apps.</h1>
                    <p style={leadStyle}>
                        A Dash component for nested grouping, automatic aggregation, and
                        conditional styling — designed with the polish of a modern SaaS UI.
                    </p>
                </header>

                <section>
                    <p style={sectionLabel}>Live example</p>
                    <FlexiTable
                        id="revenue-table"
                        title="Global revenue by region"
                        description="Grouped by region and country. Click rows to drill into detail."
                        data={sampleData}
                        level1Group="region"
                        level2Group="country"
                        aggrCols={['sales', 'profit']}
                        aggrFunction="sum"
                        conditionalStyles={conditionalStyles}
                        expandedGroups={expanded}
                        searchable
                        exportable
                        setProps={(newProps) => {
                            if (newProps.expandedGroups) setExpanded(newProps.expandedGroups);
                        }}
                    />
                </section>

                <section>
                    <p style={sectionLabel}>Compact density · dark theme</p>
                    <FlexiTable
                        id="revenue-table-dark"
                        title="Monthly close"
                        description="Compact variant with dark-mode tokens."
                        data={sampleData}
                        level1Group="region"
                        aggrCols={['sales', 'profit']}
                        aggrFunction="mean"
                        conditionalStyles={conditionalStyles}
                        density="compact"
                        theme="dark"
                        searchable
                    />
                </section>
            </div>
        </div>
    );
}

export default App;
