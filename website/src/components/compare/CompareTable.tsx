import { FRAMEWORKS, FEATURES, type Framework } from '@/data/comparisons'

// Renders a real HTML comparison table. AI engines parse tables accurately and
// cite them often, so this stays semantic <table>, not an image. The TermUI
// column is highlighted.
export function CompareTable({ keys }: { keys: string[] }) {
    const cols: Framework[] = keys.map((k) => FRAMEWORKS[k]).filter(Boolean) as Framework[]
    return (
        <div className="cmp-table-wrap">
            <table className="cmp-table">
                <thead>
                    <tr>
                        <th className="cmp-th-feature">Feature</th>
                        {cols.map((f) => (
                            <th key={f.key} className={f.key === 'termui' ? 'cmp-th cmp-th--termui' : 'cmp-th'}>
                                {f.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {FEATURES.map((row) => (
                        <tr key={row.feature}>
                            <td className="cmp-td-feature">{row.feature}</td>
                            {cols.map((f) => (
                                <td key={f.key} className={f.key === 'termui' ? 'cmp-td cmp-td--termui' : 'cmp-td'}>
                                    {row.values[f.key] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
