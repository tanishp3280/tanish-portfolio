# Publish Tanish's portfolio: GitHub → Vercel

This is a separate Vercel deployment edition of the October 20 source. It uses standard Next.js instead of the local Vinext/Cloudflare worker build. The original working folder is unchanged.

## 1. Files to use

Unzip `tanish-portfolio-vercel.zip`. Open the `tanish-portfolio-vercel` folder inside it. Upload/push the CONTENTS of that folder, including its hidden `.gitignore`.

Keep `app/`, `components/`, `hooks/`, `lib/`, `public/`, `types/`, `db/`, `drizzle/`, `tests/`, `docs/`, `package.json`, `package-lock.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `components.json`, `vercel.json`, `.gitignore`, and credits/documentation.

Do not upload the ZIP itself as your application. Do not upload node_modules, .next, .git, .env.local, API tokens, or build output. The included .gitignore handles these exclusions.

## 2. Optional local check

Install Node.js 22, then in Terminal run:

```sh
cd "/path/to/tanish-portfolio-vercel"
npm ci
npm run build
npm start
```

Open http://localhost:3000. For editing, use `npm run dev` instead of `npm start`.

## 3. Create the GitHub repository

Sign in to https://github.com/new as tanishp3280. Name the repository `tanish-portfolio`. Choose public or private. Leave “Add a README”, .gitignore and license initialization off, since the folder already contains files.

Run these commands INSIDE the extracted deployment folder:

```sh
git init -b main
git add .
git commit -m "Prepare portfolio for Vercel"
git remote add origin https://github.com/tanishp3280/tanish-portfolio.git
git push -u origin main
```

If you choose a different repository name, change the remote URL. GitHub may ask you to authenticate through your browser/credential manager; do not use your normal GitHub password as a Git token.

Alternatively, GitHub Desktop → Add Local Repository → select this folder → Create Repository if prompted → commit all files → Publish Repository.

## 4. Deploy with Vercel

1. Sign in to https://vercel.com with GitHub.
2. Add New → Project → import `tanishp3280/tanish-portfolio`.
3. Authorize access to that repository if prompted.
4. Confirm these settings:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (the directory that contains package.json)
   - Node.js Version: **22.x**
   - Install Command: **npm ci**
   - Build Command: **npm run build**
   - Output Directory: **leave the Next.js default**; do not enter dist or public.
5. Click Deploy. Open the generated `.vercel.app` URL when the build succeeds.

If you uploaded the enclosing folder instead of its contents, set Root Directory to `tanish-portfolio-vercel`.

## 5. Domain and later updates

For a custom domain, use Project → Settings → Domains and follow the DNS records Vercel shows for your domain. Set `NEXT_PUBLIC_SITE_URL` to your final HTTPS website URL in Settings → Environment Variables, then redeploy. Without that optional variable, metadata uses Vercel's production URL.

For later changes, edit this deployment edition, then run:

```sh
git add .
git commit -m "Update portfolio"
git push
```

Vercel automatically builds commits to the connected repository. Main is the production branch; other branches can receive preview deployments.

## 6. Guestbook and visitor statistics: optional database setup

The portfolio, 3D scenes, navigation, résumé, games and project pages do not require secrets. Live GitHub data uses the public API and may be rate-limited.

The guestbook and opt-in visitor statistics DO require persistent storage. This edition preserves those endpoints using Cloudflare D1's HTTP API, which can be called from Vercel. Until configured, those two features show an unavailable message; they do not pretend to save data.

To enable them:
1. In your Cloudflare account, create a D1 database (or use an existing compatible database that you own).
2. For a NEW database, run the SQL in `drizzle/0000_numerous_raza.sql` in its SQL console. Do not rerun CREATE TABLE statements on an already initialized database.
3. Create a server-side Cloudflare API token with D1 edit permission scoped to the relevant account.
4. Add these to Vercel → Project → Settings → Environment Variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_D1_DATABASE_ID`
   - `CLOUDFLARE_D1_API_TOKEN`
5. Redeploy, then verify a guestbook entry and opt-in visit on the deployed site.

Never prefix these credentials with NEXT_PUBLIC_ and never commit their values. For local development, put them in ignored `.env.local`. Existing hosted guestbook/traffic data is not included in this source archive or automatically migrated. No paid services or accounts have been created for you.

## Validation and limits

See `DEPLOY-VALIDATION.md` for the actual checks performed. A local build does not prove that credentials, DNS, or the deployed environment are configured. This package includes the current implementation, including unfinished visual-list items documented in docs/MOUNTAIN-CITY-101-200-STATUS.md.

Official references:
- https://vercel.com/docs/git
- https://nextjs.org/docs/app/getting-started/deploying
- https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/
