// components/PedagogicPanel.js
import React from 'react';

export default function PedagogicPanel() {
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg mt-6 shadow">
      <h2 className="text-xl font-semibold mb-2">📘 Concepts Pédagogiques</h2>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Vue matérialisée</strong> : Agrégats stockés dans un cache JSON statique.</li>
        <li><strong>ISR (Incremental Static Regeneration)</strong> : Actualisation automatique toutes les 60 secondes.</li>
        <li><strong>Index implicite</strong> : Groupement automatique par une colonne métier du CSV.</li>
        <li><strong>Fragmentation</strong> : Traitement des fichiers ligne par ligne (lecture/écriture).</li>
        <li><strong>Cache d’agrégats</strong> : Stockage temporaire des résultats côté serveur pour performance.</li>
      </ul>
    </div>
  );
}