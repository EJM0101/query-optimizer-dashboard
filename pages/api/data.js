import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import Papa from 'papaparse';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DATA_PATH = path.join(PUBLIC_DIR, 'data.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const form = new formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('Erreur parsing fichier :', err);
        return res.status(500).json({ error: 'Erreur de parsing' });
      }

      const uploadedFile = files.file;

      if (!uploadedFile || !uploadedFile.filepath) {
        return res.status(400).json({ error: 'Aucun fichier trouvé.' });
      }

      const fileContent = fs.readFileSync(uploadedFile.filepath, 'utf8');

      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error('Erreurs CSV :', parsed.errors);
        return res.status(400).json({ error: 'Erreur de traitement du fichier', details: parsed.errors });
      }

      if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);
      fs.writeFileSync(DATA_PATH, JSON.stringify(parsed.data, null, 2));

      return res.status(200).json({ success: true, data: parsed.data });
    } catch (error) {
      console.error('Erreur serveur :', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });
}