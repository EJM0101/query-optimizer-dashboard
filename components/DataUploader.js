import React, { useState } from 'react';

export default function DataUploader({ setData, onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Veuillez sélectionner un fichier CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setData(json.data);
        onUpload();
        setMessage('✅ Fichier chargé avec succès.');
      } else {
        setMessage('❌ Échec du traitement du fichier.');
      }
    } catch (err) {
      console.error('Erreur upload :', err);
      setMessage('❌ Erreur de chargement.');
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2 text-indigo-700">📤 Chargement du fichier CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2 text-sm"
      />
      <div className="flex items-center space-x-2">
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Importer le fichier
        </button>
        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>
    </div>
  );
}