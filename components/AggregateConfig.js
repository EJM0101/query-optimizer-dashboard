import React from 'react';

export default function AggregateConfig({ data, onConfig }) {
  if (!data || data.length === 0) return null;

  const handleGenerate = async () => {
    await fetch('/api/aggregates', { method: 'POST' });
    onConfig();
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">⚙️ Génération des Agrégats</h2>
      <button onClick={handleGenerate} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Générer les agrégats
      </button>
    </div>
  );
}
