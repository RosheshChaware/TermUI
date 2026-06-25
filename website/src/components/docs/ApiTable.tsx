interface ApiTableProps {
    columns: string[]
    rows: string[][]
}

export function ApiTable({ columns, rows }: ApiTableProps) {
    return (
        <div className="api-table">
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    {j === 2 && cell === 'required' ? (
                                        <span className="api-table-required">required</span>
                                    ) : (
                                        <code>{cell}</code>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
