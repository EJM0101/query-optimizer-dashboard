import React, { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [aggregationKey, setAggregationKey] = useState('');
  const [aggregationType, setAggregationType] = useState('count');
  const [aggregates, setAggregates] = useState([]);
  const [cacheInfo, setCacheInfo] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/data', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (json.columns) {
      setColumns(json.columns);
    }
  };

  const handleAggregate = async () => {
    const res = await fetch(`/api/aggregates?key=${aggregationKey}&agg=${aggregationType}`);
    const json = await res.json();
    setAggregates(json.data);
    setCacheInfo(json.cacheInfo);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">⚡ Query Optimizer Dashboard</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <h2 className="font-semibold text-lg">📘 Fonctionnement général</h2>
        <ul className="list-disc ml-6 text-sm">
          <li>📂 Téléversez un fichier CSV</li>
          <li>🔑 Choisissez une colonne d’agrégation</li>
          <li>📊 Sélectionnez le type d’agrégat (count, sum, avg)</li>
          <li>📦 Agrégation stockée avec cache automatique (ISR)</li>
        </ul>
      </div>

      <div className="mb-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Charger le fichier</button>
      </div>

      {columns.length > 0 && (
        <div className="bg-gray-50 p-4 rounded shadow mb-6">
          <h2 className="font-medium mb-2">⚙️ Options d’Agrégation</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <select value={aggregationKey} onChange={(e) => setAggregationKey(e.target.value)} className="border p-2 rounded">
              <option value="">-- Choisir une colonne --</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
            <select value={aggregationType} onChange={(e) => setAggregationType(e.target.value)} className="border p-2 rounded">
              <option value="count">Nombre (count)</option>
              <option value="sum">Somme (sum)</option>
              <option value="avg">Moyenne (avg)</option>
            </select>
            <button onClick={handleAggregate} className="bg-green-600 text-white px-4 py-2 rounded">Générer</button>
          </div>
        </div>
      )}

      {cacheInfo && (
        <div className="text-sm text-gray-600 mb-4">
          <strong>Cache actuel :</strong> Généré le {cacheInfo.generatedAt} — Expire dans {cacheInfo.ttl} secondes
        </div>
      )}

      {aggregates.length > 0 && (
        <table className="w-full table-auto border-collapse border mt-4">
          <thead>
            <tr className="bg-blue-100">
              <th className="border px-4 py-2">{aggregationKey}</th>
              <th className="border px-4 py-2">{aggregationType}</th>
            </tr>
          </thead>
          <tbody>
            {aggregates.map((row, i) => (
              <tr key={i} className="text-sm text-center">
                <td className="border px-4 py-1">{row.key}</td>
                <td className="border px-4 py-1">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}