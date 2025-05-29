import React from 'react';

export default function DataUploader({ setData, onUpload }) {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch('/api/data', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    setData(json.data);
    onUpload();
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">📁 Téléversement CSV</h2>
      <input type="file" accept=".csv" onChange={handleChange} />
    </div>
  );
}
