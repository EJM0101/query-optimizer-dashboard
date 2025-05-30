import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public/data.json');
const CACHE_FILE = path.join(process.cwd(), 'public/aggregates.json');

function computeAggregates(data, key, type) {
  const result = {};

  for (const row of data) {
    const group = row[key];
    const value = parseFloat(row.value || row[key]) || 0;

    if (!result[group]) {
      result[group] = { count: 0, sum: 0 };
    }

    result[group].count += 1;
    result[group].sum += value;
  }

  return Object.entries(result).map(([k, v]) => ({
    key: k,
    value: type === 'sum' ? v.sum : type === 'avg' ? v.sum / v.count : v.count,
  }));
}

export default function handler(req, res) {
  const { key = '', agg = 'count' } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Colonne manquante pour l’agrégation.' });
  }

  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).json({ error: 'Aucune donnée trouvée.' });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const aggregates = computeAggregates(data, key, agg);

  const cache = {
    aggregates,
    cache: {
      generatedAt: new Date().toISOString(),
      revalidate: 60,
    },
  };

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

  return res.status(200).json(cache);
}