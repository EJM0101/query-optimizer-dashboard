import React from 'react';

export default function CacheStatus({ cache }) {
  if (!cache) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
      <strong>Cache actuel :</strong>
      <div>Dernière génération : {cache.generatedAt}</div>
      <div>Expire dans : {cache.revalidate} secondes</div>
    </div>
  );
}
