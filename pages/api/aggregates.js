import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

let cache = {
  generatedAt: null,
  ttl: 60,
  key: '',
  type: '',
  data: [],
};

export default async function handler(req, res) {
  const { key, agg } = req.query;
  const filePath = path.join(process.cwd(), 'public/data.csv');
  const now = new Date();

  if (
    cache.data.length > 0 &&
    cache.key === key &&
    cache.type === agg &&
    cache.generatedAt &&
    (now - new Date(cache.generatedAt)) / 1000 < cache.ttl
  ) {
    return res.status(200).json({
      cacheInfo: {
        generatedAt: cache.generatedAt,
        ttl: cache.ttl,
      },
      data: cache.data,
    });
  }

  if (!key || !agg) {
    return res.status(400).json({ error: 'Clé ou type d’agrégat manquant' });
  }

  const results = {};
  const dataRows = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => dataRows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    if (agg === 'count') {
      for (const row of dataRows) {
        const value = row[key];
        results[value] = (results[value] || 0) + 1;
      }
    } else if (agg === 'sum' || agg === 'avg') {
      const sums = {};
      const counts = {};
      for (const row of dataRows) {
        const groupKey = row[key];
        const val = parseFloat(row.value || 0);
        if (!isNaN(val)) {
          sums[groupKey] = (sums[groupKey] || 0) + val;
          counts[groupKey] = (counts[groupKey] || 0) + 1;
        }
      }
      for (const k in sums) {
        results[k] = agg === 'sum' ? sums[k] : sums[k] / counts[k];
      }
    }

    const aggregated = Object.entries(results).map(([k, v]) => ({ key: k, value: v }));

    cache = {
      generatedAt: new Date().toISOString(),
      ttl: 60,
      key,
      type: agg,
      data: aggregated,
    };

    return res.status(200).json({
      cacheInfo: {
        generatedAt: cache.generatedAt,
        ttl: cache.ttl,
      },
      data: aggregated,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Erreur lecture CSV', details: e.message });
  }
}