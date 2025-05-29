import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Erreur parsing fichier' });

    const file = files.file[0];
    const content = fs.readFileSync(file.filepath, 'utf8');
    const { data } = Papa.parse(content, { header: true, skipEmptyLines: true });

    fs.writeFileSync('public/data.json', JSON.stringify(data, null, 2));

    return res.status(200).json({ data });
  });
}
