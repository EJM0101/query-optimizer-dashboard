import React from 'react';

export default function AggregateConfig({ data, keyValue, aggValue, onChangeKey, onChangeAgg }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-4 text-indigo-700">鈿欙笍 G茅n茅ration personnalis茅e des Agr茅gats</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">馃搶 Colonne 脿 agr茅ger</label>
          <select
            value={keyValue}
            onChange={(e) => onChangeKey(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">-- Choisir une colonne --</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">馃搳 Type d鈥檃gr茅gation</label>
          <select
            value={aggValue}
            onChange={(e) => onChangeAgg(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="count">Compter</option>
            <option value="sum">Somme</option>
            <option value="avg">Moyenne</option>
          </select>
        </div>

        <div className="flex items-end">
          <p className="text-sm text-gray-600">
            Choisissez une colonne et une m茅thode d鈥檃gr茅gation pour afficher les r茅sultats.
          </p>
        </div>
      </div>
    </div>
  );
}