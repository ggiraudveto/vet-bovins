# 🐄 VetScan Bovins

Application de scan et d'identification des passeports bovins pour cliniques vétérinaires rurales.

---

## 🚀 Déploiement sur Vercel (gratuit)

### Étape 1 — Créer un compte GitHub
1. Allez sur [github.com](https://github.com) et créez un compte gratuit

### Étape 2 — Mettre le projet sur GitHub
1. Créez un nouveau dépôt sur GitHub (bouton "New repository")
2. Nommez-le `vet-bovins`, laissez en "Public"
3. Uploadez tous les fichiers de ce dossier dans le dépôt

### Étape 3 — Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub
2. Cliquez **"Add New Project"**
3. Sélectionnez votre dépôt `vet-bovins`
4. Cliquez **"Deploy"** — Vercel détecte automatiquement Vite/React

### Étape 4 — Ajouter votre clé API (IMPORTANT)
1. Dans votre projet Vercel, allez dans **Settings → Environment Variables**
2. Ajoutez une variable :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : votre clé `sk-ant-api03-XXXX...`
3. Cliquez **Save**
4. Allez dans **Deployments** et cliquez **Redeploy**

✅ Votre application est maintenant accessible à l'URL fournie par Vercel (ex: `vet-bovins.vercel.app`)

---

## 📱 Utilisation

1. Ouvrez l'URL de votre application dans n'importe quel navigateur (PC, tablette, téléphone)
2. Prenez en photo les passeports bovins (plusieurs à la fois)
3. Importez les photos dans l'application
4. Cliquez **"Analyser les photos"**
5. Vérifiez et corrigez les données si nécessaire
6. Exportez en **CSV (Excel)** ou **PDF**

---

## 💰 Coût d'utilisation

- Hébergement Vercel : **gratuit**
- API Anthropic : ~0,01 à 0,03 € par lot de passeports analysé
