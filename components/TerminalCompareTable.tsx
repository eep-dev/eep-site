type Row = { label: string; value: string };

export function TerminalCompareTable({ caption, rows }: { caption: string; rows: readonly Row[] }) {
  return (
    <div className="rw-compare-block">
      <p className="rw-compare-caption">{caption}</p>
      <table className="rw-compare-table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
