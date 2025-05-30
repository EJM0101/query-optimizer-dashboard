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
  const [key, setKey] = useState('');
  const [aggType, setAggType] = useState('count');

  const fetchAggregates = async () => {
    if (!key) return;

    const res = await fetch(`/api/aggregates?key=${key}&agg=${aggType}`);
    const json = await res.json();
    setAggregates(json.aggregates);
    setCacheInfo(json.cache);
  };

  useEffect(() => {
    fetchAggregates();
  }, [key, aggType]);

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
              <li>⚙️ Choisissez la colonne et l'agrégation (count, sum, avg).</li>
              <li>📊 L'agrégat est mis en cache et rafraîchi automatiquement.</li>
              <li>🧠 Les concepts sont affichés et expliqués dans l’interface.</li>
            </ul>
          </section>

          <DataUploader setData={setData} onUpload={fetchAggregates} />
          <AggregateConfig
            data={data}
            keyValue={key}
            aggValue={aggType}
            onChangeKey={setKey}
            onChangeAgg={setAggType}
          />
          <CacheStatus cache={cacheInfo} />
          <ResultTable data={aggregates} />
          <PedagogicPanel />
        </div>
      </div>
    </div>
  );
}