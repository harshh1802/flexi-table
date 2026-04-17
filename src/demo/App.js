import React, { useState } from 'react';
import FlexiTable from '../lib/components/FlexiTable.react'; // Import your component

// 1. Create some realistic sample data
const sampleData = [
    { region: 'Americas', country: 'USA', sales: 500, profit: 150, manager: 'John Doe' },
    { region: 'Americas', country: 'USA', sales: 300, profit: 75, manager: 'John Doe' },
    { region: 'Americas', country: 'Canada', sales: 400, profit: 120, manager: 'Jane Smith' },
    { region: 'EMEA', country: 'Germany', sales: 600, profit: 200, manager: 'Peter Jones' },
    { region: 'EMEA', country: 'France', sales: 450, profit: 130, manager: 'Peter Jones' },
    { region: 'EMEA', country: 'France', sales: 350, profit: 90, manager: 'Chris Green' },
    { region: 'APAC', country: 'Japan', sales: 700, profit: 250, manager: 'Yuki Tanaka' },
];

// 2. Define conditional styles to highlight high/low values
const conditionalStyles = [
    // Highlight high sales (>= 500) in green
    {
        condition: { columnName: 'sales', operator: '>=', value: 500 },
        style: { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' }
    },
    // Highlight low sales (< 350) in red
    {
        condition: { columnName: 'sales', operator: '<', value: 350 },
        style: { backgroundColor: '#fef2f2', color: '#dc2626' }
    },
    // Highlight high profit (>= 150) in blue
    {
        condition: { columnName: 'profit', operator: '>=', value: 150 },
        style: { backgroundColor: '#dbeafe', color: '#1d4ed8', fontWeight: 'bold' }
    }
];

function App() {
    // 3. Use useState to manage props like expandedGroups
    const [expanded, setExpanded] = useState({
        // Pre-expand some groups to show the styling immediately
        'Americas': true,
        'EMEA': true,
        'APAC': true
    });

    return (
        <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '10px',
                    color: '#1f2937'
                }}>
                    FlexiTable Component Demo
                </h1>
                <p style={{ 
                    color: '#6b7280', 
                    marginBottom: '30px',
                    fontSize: '1.1rem'
                }}>
                    Interactive hierarchical data table with conditional styling and modern design
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#374151', marginBottom: '10px' }}>Features Demonstrated:</h3>
                    <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
                        <li>• Hierarchical grouping (Region → Country)</li>
                        <li>• Automatic aggregation (Sales & Profit totals)</li>
                        <li>• Conditional styling (Green: Sales ≥ 500, Red: Sales &lt; 350, Blue: Profit ≥ 150)</li>
                        <li>• Expandable/collapsible rows</li>
                        <li>• Modern Tailwind CSS styling</li>
                    </ul>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                {/* 4. Render your component with enhanced props */}
                <FlexiTable
                    id="my-flexi-table"
                    data={sampleData}
                    level1Group="region"
                    level2Group="country"
                    aggrCols={['sales', 'profit']}
                    aggrFunction="sum"
                    conditionalStyles={conditionalStyles}
                    expandedGroups={expanded}
                    setProps={(newProps) => {
                        if (newProps.expandedGroups) {
                            console.log('New expanded groups:', newProps.expandedGroups);
                            setExpanded(newProps.expandedGroups);
                        }
                    }}
                />

                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                }}>
                    Click on region or country rows to expand/collapse • 
                    Styling automatically highlights important values
                </div>
            </div>
        </div>
    );
}

export default App;