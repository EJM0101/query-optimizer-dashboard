import React, { useState } from 'react';

export default function DataUploader({ setData, onUpload }) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erreur inconnue lors de l’upload.');
      }

      setData(json.data);
      onUpload();
      setMessage('✅ Données chargées avec succès.');
    } catch (err) {
      console.error('Erreur upload :', err);
      setError(err.message || 'Erreur lors du téléversement.');
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-semibold text-indigo-700">📁 Téléversement CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}