# Deployment Guide

This project is a Vite + React frontend. Below are free deployment options with quick steps.

## 1. GitHub Pages (Recommended for static build)

Suitable for pure frontend apps without server-side logic.

### Steps

1. Ensure repository is public (or GitHub Pages enabled for private with paid plan).
2. We added a workflow at `.github/workflows/deploy.yml`.
3. Commit & push changes to `main`:
   - `git add .`
   - `git commit -m "chore: add gh pages deploy"`
   - `git push origin main`
4. In GitHub: Settings > Pages. Set Source to "GitHub Actions" (if not auto).
5. After workflow runs, site will be available at:
   `https://<your-username>.github.io/FrontendExpenseTracker/`

If you change repo name, update `base` in `vite.config.js` accordingly.

### Local Test of Production Build

```
npm run build
npm run preview
```

Visit the local preview URL to confirm assets load with the base path.

## 2. Vercel (Zero-config for Vite)

1. Go to https://vercel.com and import the GitHub repo.
2. Framework auto-detected. Adjust build command if needed: `npm run build` and output dir `dist`.
3. No need for `base` config; you can remove it if you ONLY use Vercel.
4. Each push deploys automatically; get preview + production URLs.

## 3. Netlify

1. Login at https://netlify.com and "Add new site" from Git.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add a `_redirects` file if using client-side routing to handle 404 -> index.html:

```
/*    /index.html   200
```

5. Remove `base` if you use a root domain or custom domain.

## 4. Cloudflare Pages

1. Go to https://pages.cloudflare.com/ and create a new project from GitHub.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Fast global CDN + optional custom domain easily.

## 5. Other Options

- Render (static site) – similar config.
- Surge: `npm run build` then `npx surge dist yourdomain.surge.sh`.

## Routing Notes

If you introduce React Router later, for non-GitHub Pages hosts you need a redirect rule so deep links work. For GitHub Pages, consider using `HashRouter` or a 404.html copy of `index.html`.

### GitHub Pages Router Tip

If using React Router DOM with BrowserRouter:

- Create `public/404.html` duplicating minified `index.html` after build (or add a postbuild script).
- Or simply switch to `HashRouter`.

## Environment Variables

For static hosts, expose only non-secret variables using Vite's `VITE_` prefix. Secrets must stay on a backend.

## Removing the Base Path

If you migrate from GitHub Pages to Vercel/Netlify root domain:

1. Edit `vite.config.js` and remove `base: '/FrontendExpenseTracker/'`.
2. Re-deploy.

## Deployment Verification Checklist

- Build passes locally (`npm run build`).
- Dist folder generated with correct asset paths.
- Workflow completes successfully.
- Site loads fonts/images with no 404s.
- Open devtools network tab: no missing `*.js` or `*.css`.

## Troubleshooting

| Problem                       | Cause                              | Fix                                                                             |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| CSS/JS 404 on GitHub Pages    | Missing base path                  | Ensure `base` matches repository name.                                          |
| Blank page after routing      | No redirect handling               | Add `_redirects` (Netlify) or use HashRouter / 404.html (GH Pages).             |
| Old bundle served             | Browser cache                      | Invalidate by bumping build or enabling versioning (content hash already used). |
| Action fails at build         | Node version mismatch              | Use Node 18+ or 20 in workflow.                                                 |
| Deploy job 404 (deploy-pages) | Pages not enabled / wrong settings | Go to Settings > Pages, set Source to GitHub Actions once. Re-run workflow.     |

---

Maintainer notes: Keep this doc updated if deployment strategy changes.
