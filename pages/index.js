import React, { useState, useEffect } from 'react';
import AggregateConfig from '../components/AggregateConfig';
import DataUploader from '../components/DataUploader';
import ResultTable from '../components/ResultTable';
import CacheStatus from '../components/CacheStatus';
import PedagogicPanel from '../components/PedagogicPanel';

export default function Home() {
  const [data, setData] = useState([]);
  const [aggregates, setAggregates] = useState([]);
  const [cacheInfo, setCacheInfo] = useState(null);

  const fetchAggregates = async () => {
    const res = await fetch('/api/aggregates');
    const json = await res.json();
    setAggregates(json.aggregates);
    setCacheInfo(json.cache);
  };

  useEffect(() => {
    fetchAggregates();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-4">
          ⚡ Query Optimizer Dashboard
        </h1>
        <p className="text-center text-gray-600 text-lg mb-8">
          Plateforme pédagogique illustrant l'optimisation des requêtes OLAP avec Next.js, ISR et vues matérialisées dynamiques.
        </p>

        <div className="grid gap-6">
          <section className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600">📌 Fonctionnement général</h2>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>📁 Téléversez un fichier CSV métier.</li>
              <li>⚙️ L'API transforme les données et génère une vue matérialisée.</li>
              <li>📊 L'agrégat est mis en cache en JSON avec date de génération.</li>
              <li>🔁 Une revalidation ISR met à jour les données automatiquement.</li>
              <li>🧠 Les concepts sont expliqués directement dans l’interface.</li>
            </ul>
          </section>

          <DataUploader setData={setData} onUpload={fetchAggregates} />
          <AggregateConfig data={data} onConfig={fetchAggregates} />
          <CacheStatus cache={cacheInfo} />
          <ResultTable data={aggregates} />
          <PedagogicPanel />
        </div>
      </div>
    </div>
  );
}