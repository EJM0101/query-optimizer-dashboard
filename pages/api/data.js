import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import Papa from 'papaparse';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PUBLIC_PATH = path.join(process.cwd(), 'public');
const DATA_PATH = path.join(PUBLIC_PATH, 'data.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('Erreur Formidable :', err);
        return res.status(500).json({ error: 'Erreur de parsing du fichier' });
      }

      const file = files.file;
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'Fichier non reçu.' });
      }

      const fileContent = fs.readFileSync(file.filepath, 'utf8');

      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        return res.status(400).json({ error: 'Erreur parsing CSV', details: parsed.errors });
      }

      // Sauvegarde les données JSON dans public/
      if (!fs.existsSync(PUBLIC_PATH)) fs.mkdirSync(PUBLIC_PATH);
      fs.writeFileSync(DATA_PATH, JSON.stringify(parsed.data, null, 2));

      return res.status(200).json({ success: true, data: parsed.data });
    } catch (error) {
      console.error('Erreur serveur :', error);
      return res.status(500).json({ error: 'Erreur serveur interne.' });
    }
  });
}