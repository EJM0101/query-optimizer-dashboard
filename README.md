# ⚡ Query Optimizer Dashboard (Next.js + ISR)

## 🎯 Objectif pédagogique

Cette plateforme démontre de manière interactive **l’optimisation des requêtes en entrepôt de données (Data Warehouse)**, à travers les concepts clés utilisés dans les systèmes OLAP.

## 🚀 Fonctionnalités principales

| Fonctionnalité                         | Description                                                                 |
|----------------------------------------|-----------------------------------------------------------------------------|
| 📂 Téléversement CSV                   | L'utilisateur importe ses propres données (produits, ventes, clients...)   |
| ⚙️ Génération de vue matérialisée      | Les données sont agrégées et stockées dans un cache JSON                   |
| 🔁 Revalidation ISR                    | Next.js met à jour automatiquement les pages toutes les 60s                |
| 📊 Tableau dynamique d’agrégats        | Affiche les résultats transformés depuis les données sources               |
| 🧠 Explication des concepts            | Affichée dans l’interface et dans le README pour apprentissage progressif  |

---

## 🧠 Concepts pédagogiques intégrés

| Concept OLAP                  | Application dans ce projet                                                    |
|-------------------------------|--------------------------------------------------------------------------------|
| Vue matérialisée              | Agrégats générés à partir des fichiers CSV et stockés dans `public/aggregates.json` |
| Requêtes optimisées           | Simulation de requêtes GROUP BY à l’aide de `reduce()` JavaScript            |
| Revalidation ISR              | Rechargement automatique via `getStaticProps` ou appel JSON + revalidation   |
| Fragmentation                | Lecture ligne à ligne des CSV, simulant un traitement distribué              |
| Index implicite               | Clé métier choisie (ex. pays, catégorie) utilisée pour le regroupement       |
| Cache d’agrégats              | Simulation de cache serveur statique actualisé par intervalle                |

---

## 🛠️ Installation locale

```bash
npm install
npm run dev