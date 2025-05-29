import fs from 'fs';

const CACHE_FILE = 'public/aggregates.json';

function groupBy(data, key) {
  return data.reduce((acc, row) => {
    const group = row[key];
    if (!acc[group]) acc[group] = { count: 0 };
    acc[group].count += 1;
    return acc;
  }, {});
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = JSON.parse(fs.readFileSync('public/data.json', 'utf8'));
    const grouped = groupBy(data, Object.keys(data[0])[0]);
    const aggregates = Object.entries(grouped).map(([key, value]) => ({
      key,
      count: value.count,
    }));

    const cache = {
      aggregates,
      cache: {
        generatedAt: new Date().toISOString(),
        revalidate: 60,
      },
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    return res.status(200).json({ success: true });
  }

  if (fs.existsSync(CACHE_FILE)) {
    const json = fs.readFileSync(CACHE_FILE, 'utf8');
    return res.status(200).json(JSON.parse(json));
  }

  return res.status(200).json({ aggregates: [], cache: null });
}
