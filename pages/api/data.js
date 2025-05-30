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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erreur parsing fichier :', err);
      return res.status(500).json({ error: 'Erreur parsing fichier' });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'Fichier CSV manquant' });
      }

      const content = fs.readFileSync(file.filepath, 'utf8');

      const parsed = Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error('Erreurs CSV :', parsed.errors);
        return res.status(400).json({ error: 'Erreur de parsing CSV', details: parsed.errors });
      }

      const data = parsed.data;

      const publicPath = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath);
      }

      fs.writeFileSync(path.join(publicPath, 'data.json'), JSON.stringify(data, null, 2));

      console.log('✅ Données CSV enregistrées avec succès');
      return res.status(200).json({ data });
    } catch (error) {
      console.error('Erreur serveur :', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });
}