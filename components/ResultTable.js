import React from 'react';

export default function ResultTable({ data }) {
  if (!data || data.length === 0) return <p>Aucun agrégat disponible.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-auto bg-white shadow rounded mt-4">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-200">
          <tr>{headers.map(h => <th key={h} className="p-2">{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {headers.map(key => <td key={key} className="p-2">{row[key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
