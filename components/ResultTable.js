import React from 'react';

export default function ResultTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 shadow rounded text-center text-gray-500">
        Aucun agrégat disponible. Veuillez téléverser un fichier et configurer l’agrégation.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-4 text-indigo-700">📊 Résultats de l’agrégation</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-indigo-50 text-indigo-800">
            <th className="border px-4 py-2 text-left">Valeur de regroupement</th>
            <th className="border px-4 py-2 text-left">Valeur agrégée</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row.key}</td>
              <td className="border px-4 py-2">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}