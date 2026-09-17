# Atlas Cards

Jeu de collection bilingue construit avec Next.js, Auth.js, SQLite en local et PostgreSQL/Neon en production.

## Lancer le jeu

```bash
pnpm dev
```

Ouvrez `http://localhost:3000` ou l’adresse réseau affichée. Au premier lancement, SQLite crée `data/atlas.db`, les tables et le catalogue de départ. Créez ensuite un compte et ouvrez des packs.

## Créer une carte Wikipédia

L’onglet **Créer une carte** recherche Wikipédia directement depuis le jeu. Une carte est créée uniquement si l’API MediaWiki confirme une page valide, une image Wikimedia et une licence réutilisable reconnue : domaine public, CC0, CC BY ou CC BY-SA. Les métadonnées d’attribution sont conservées avec la carte.

Le nom, la source et l’image ne peuvent pas être fournis par le navigateur. Chaque joueur peut créer une carte globale par période de 24 h. La rareté est tirée côté serveur et le créateur reçoit un pack bonus, sans consommer ses 10 packs quotidiens.

Les mutations Enhanced, Shiny, Ancient, Mythic et Cosmic sont tirées uniquement lors de l’ouverture d’un pack. Elles sont des variantes distinctes dans la Collection.

## Production : Vercel + Neon

Renseignez dans Vercel :

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-domaine.example
NEXTAUTH_SECRET=une-valeur-longue-et-aleatoire
```

Puis appliquez les migrations et le seed contre Neon :

```bash
pnpm db:migrate
pnpm db:seed
```

La migration `0002_wikimedia_mutations.sql` ajoute les données Wikimedia, les variantes de mutation, le motif de reçu et la fenêtre de création. Le limiteur local est en mémoire et convient au développement ; pour plusieurs instances Vercel, remplacez-le par un KV/Redis partagé.

## Vérifier le projet

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
```
