# Deployment validation — October 20, 2026

- Standard Next.js 16.3.4 production build (`next build --webpack`): passed.
- TypeScript validation included in build: passed.
- 22 focused automated tests: passed, including the new D1 HTTP adapter with mocked responses.
- Local production server: started successfully.
- HTTP 200 verified: homepage, /research, /keyboard, /api/projects, résumé PDF.
- Without credentials, /api/community returned the expected unavailable response (503).
- Real remote database queries have NOT been tested: no credentials were supplied.
- Dependencies were reused from the working checkout for the build. A fresh npm ci on Vercel has not yet been executed.
- No GitHub repository, Vercel deployment, cloud database or domain configuration was created.
- Local-only warning: Next detected an unrelated lockfile in the user's home directory and ignored it.
- Source ZIP omits dependencies, build output, Git history, environment files and local credentials.
