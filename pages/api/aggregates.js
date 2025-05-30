import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public/data.json');
const CACHE_FILE = path.join(process.cwd(), 'public/aggregates.json');

function groupByAggregate(data, key, agg, valueKey) {
  const groups = {};

  data.forEach((row) => {
    const groupKey = row[key];
    const numericValue = parseFloat(row[valueKey]) || 0;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        count: 0,
        sum: 0,
        values: [],
      };
    }

    groups[groupKey].count += 1;
    groups[groupKey].sum += numericValue;
    groups[groupKey].values.push(numericValue);
  });

  return Object.entries(groups).map(([group, values]) => {
    let result = 0;
    if (agg === 'count') {
      result = values.count;
    } else if (agg === 'sum') {
      result = values.sum;
    } else if (agg === 'avg') {
      result = values.values.length > 0
        ? values.sum / values.values.length
        : 0;
    }

    return {
      key: group,
      value: parseFloat(result.toFixed(2)),
    };
  });
}

export default function handler(req, res) {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(400).json({ error: 'Aucune donnée disponible.' });
    }

    const { key = '', agg = 'count', valueKey = '' } = req.query;

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    if (!key || !agg || (agg !== 'count' && !valueKey)) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const aggregates = groupByAggregate(data, key, agg, valueKey);

    const cache = {
      aggregates,
      cache: {
        key,
        valueKey,
        agg,
        generatedAt: new Date().toISOString(),
        revalidate: 60,
      },
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    return res.status(200).json(cache);
  } catch (err) {
    console.error('Erreur dans l’agrégation :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}