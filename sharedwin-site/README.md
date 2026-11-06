# SharedWin

Jeu de pronostics à cagnotte partagée. Chaque match propose 3 choix (**1 / X / 2**), 100 joueurs max, **1 pari par joueur et par match**. Tous les paris forment une cagnotte ; les gagnants se la partagent au prorata de leur mise, moins une **commission fixe de 5 %**.

Stack : Next.js 14 (App Router) · API REST (route handlers Node) · PostgreSQL (Supabase) · JWT en cookie HttpOnly · Déploiement Vercel.
Mode MVP : wallet **simulé** (aucun vrai paiement). La couche paiement est isolée dans `lib/payments.js` pour brancher Stripe plus tard. 

## Règles de calcul (lib/rules.js) 

```
cagnotte  = somme de toutes les mises
commission = cagnotte × 5 %            (arrondie à l'inférieur)
cagnotte nette = cagnotte − commission
gain d'un gagnant = mise × cagnotte nette ÷ somme des mises gagnantes
```
- Personne n'a trouvé le bon résultat : toutes les mises sont remboursées, pas de commission.
- Les centimes d'arrondi restent à la plateforme : on ne paie jamais plus que la cagnotte nette.
- Tous les montants sont stockés en **centimes (entiers)**. 1 coin = 1 € simulé.
- Exemple : 100 joueurs, 2 000 coins misés → commission 100 → nette 1 900. Les gagnants ont misé 800 au total : un gagnant à 40 coins reçoit 40 ÷ 800 × 1 900 = 95.

## Lancer en local

Prérequis : Node 20.6+, un PostgreSQL.

```bash
# 1. Base de données locale (ou utilisez directement Supabase, voir plus bas)
docker run --name sw-pg -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sharedwin -p 5432:5432 -d postgres:16

# 2. Installer et configurer
npm install
cp .env.example .env.local        # puis éditez : DATABASE_URL, JWT_SECRET, ADMIN_EMAILS
npm run db:init                   # crée les tables
npm run db:seed                   # crée 6 matchs de démo

# 3. Lancer
npm run dev                       # http://localhost:3000
npm test                          # tests des règles de calcul
```

L'email listé dans `ADMIN_EMAILS` devient **admin à l'inscription** : la page `/admin` permet de créer des matchs et de saisir le résultat final (les gains sont alors versés automatiquement).

## Connecter Supabase

1. Créez un projet sur supabase.com.
2. *Project Settings → Database → Connection string* : copiez l'URL **Transaction pooler** (port 6543) et remplacez `[YOUR-PASSWORD]`.
3. Mettez-la dans `DATABASE_URL` (et supprimez `DATABASE_SSL=false`).
4. `npm run db:init` crée le schéma (ou collez `db/schema.sql` dans *SQL Editor*), puis `npm run db:seed`.

## Déployer sur Vercel

1. Poussez le dossier sur GitHub.
2. Sur vercel.com : *Add New → Project*, importez le dépôt (Next.js détecté automatiquement).
3. *Environment Variables* : `DATABASE_URL`, `JWT_SECRET` (32+ caractères, ex. `openssl rand -base64 48`), `ADMIN_EMAILS`.
4. *Deploy*. Créez votre compte avec l'email admin, puis ajoutez/réglez des matchs sur `/admin`.

## Sécurité en place

- Mots de passe hachés avec bcrypt (coût 10), jamais stockés en clair.
- Requêtes SQL **paramétrées** partout (pas d'injection SQL).
- Entrées validées côté serveur avec zod ; React échappe tout le texte affiché (XSS).
- Session : JWT signé dans un cookie `HttpOnly`, `SameSite=Lax`, `Secure` en production ; contrôle d'origine sur les requêtes d'écriture.
- Paris traités dans une **transaction SQL** avec verrou sur le match : plafond de joueurs et règle « 1 pari par match » (contrainte `UNIQUE`) impossibles à contourner par requêtes simultanées. Le solde ne peut pas devenir négatif (contrainte `CHECK`).
- En-têtes de sécurité dans `next.config.js`.

## Structure

```
app/            pages (accueil, matchs, pari, dashboard, historique, wallet, profil, classement, admin) + app/api (REST)
components/     UI (cartes de match, formulaire de pari, nav...) et sprites pixel
lib/rules.js    règles de calcul (pures, testées)
lib/payments.js couche paiement (simulée, prête pour Stripe)
db/             schema.sql + seed.sql
tests/          tests unitaires des règles
```

## Avant une vraie mise en production

- Argent réel : licence de jeux/paris (en France, ANJ), KYC/AML, Stripe + webhooks, jeu responsable, vérification d'âge 18+.
- Ajouter : limitation de débit (login, paris), vérification d'email, annulation de match avec remboursement, résultats automatiques via un flux de données sportives.
