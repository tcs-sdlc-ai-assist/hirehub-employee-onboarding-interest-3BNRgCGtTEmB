# HireHub Onboarding Portal — Deployment Guide

## Overview

This document covers deploying the HireHub Onboarding Portal, an Angular 17+ standalone-component application, to Vercel. The application is entirely client-side with no server-side environment variables required.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- The Vercel CLI installed (optional, for CLI-based deployments):
  ```bash
  npm install -g vercel
  ```
- Node.js 18+ and npm 9+ installed locally
- The project repository pushed to GitHub, GitLab, or Bitbucket

---

## Build Output Directory

Angular 17+ outputs the production build to:

```
dist/hirehub/browser
```

This path is critical for deployment configuration. The Angular CLI generates this structure based on the project name defined in `angular.json` under `projects.hirehub.architect.build.options.outputPath`.

After running a production build:

```bash
ng build --configuration production
```

The resulting directory structure is:

```
dist/
└── hirehub/
    └── browser/
        ├── index.html
        ├── main-[hash].js
        ├── polyfills-[hash].js
        ├── styles-[hash].css
        └── assets/
            └── ...
```

---

## Vercel Deployment Steps

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import the repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your Git provider and import the HireHub repository

2. **Configure the project settings**
   - **Framework Preset**: Select `Other` (do not select the Angular preset — it may assume an older output path)
   - **Build Command**: `ng build --configuration production`
   - **Output Directory**: `dist/hirehub/browser`
   - **Install Command**: `npm install`

3. **Deploy**
   - Click **Deploy** and wait for the build to complete
   - Vercel will assign a `.vercel.app` URL to the deployment

4. **Verify**
   - Open the deployed URL
   - Navigate to different routes and refresh the page to confirm SPA routing works correctly

### Option B: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Run the deployment from the project root**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts**
   - Link to an existing project or create a new one
   - The CLI reads `vercel.json` for configuration automatically

---

## vercel.json Configuration Explained

The `vercel.json` file at the project root configures how Vercel handles the deployment:

```json
{
  "version": 2,
  "buildCommand": "ng build --configuration production",
  "outputDirectory": "dist/hirehub/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Configuration Breakdown

| Property | Purpose |
|---|---|
| `version` | Vercel platform version. Always `2`. |
| `buildCommand` | The command Vercel runs to build the project. Uses Angular's production configuration for optimizations (tree-shaking, AOT compilation, minification). |
| `outputDirectory` | Points Vercel to the Angular build output at `dist/hirehub/browser`. This is where `index.html` and all bundled assets reside. |
| `rewrites` | SPA rewrite rules — all requests that do not match a static file are rewritten to `/index.html`, allowing Angular Router to handle client-side routing. |
| `headers` | Caching headers for static assets. Hashed filenames produced by Angular enable aggressive caching with `immutable`. |

---

## SPA Rewrite Rules

Angular applications use client-side routing via the Angular Router. When a user navigates to a route like `/onboarding/step-2` and refreshes the browser, the server receives a request for `/onboarding/step-2`. Without rewrite rules, the server returns a 404 because no such file exists on disk.

The rewrite rule solves this:

```json
{
  "source": "/(.*)",
  "destination": "/index.html"
}
```

**How it works:**

1. A request arrives for `/onboarding/step-2`
2. Vercel checks if a static file exists at that path
3. No static file is found, so the rewrite rule activates
4. Vercel serves `index.html` instead
5. Angular bootstraps in the browser and the Angular Router reads the URL
6. The Router renders the correct component for `/onboarding/step-2`

> **Note:** Static assets (JS, CSS, images) are served directly because they match actual files in the output directory. The rewrite only applies to paths that do not resolve to a file.

---

## Environment Considerations

This application is **entirely client-side**. There are no server-side environment variables required for deployment.

- **No API keys** are needed at build time or runtime
- **No backend URLs** need to be configured — all data is managed client-side
- **No `NEXT_PUBLIC_*` or server-side secrets** apply to this project

If future features require environment-specific configuration (e.g., connecting to an API), use Angular's `environment.ts` and `environment.prod.ts` files:

```
src/
└── environments/
    ├── environment.ts          # Development defaults
    └── environment.prod.ts     # Production values
```

Angular's `fileReplacements` in `angular.json` automatically swaps `environment.ts` with `environment.prod.ts` during production builds. To inject values at deploy time on Vercel, you can use Vercel's environment variables in a custom build script that writes values into `environment.prod.ts` before the Angular build runs.

---

## Troubleshooting

### 404 errors on page refresh

**Symptom:** Navigating directly to a route like `/onboarding/step-3` or refreshing the page returns a 404.

**Cause:** The SPA rewrite rule is missing or misconfigured.

**Fix:** Ensure `vercel.json` contains the rewrite rule:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Blank page after deployment

**Symptom:** The deployed URL loads but shows a blank white page.

**Cause:** The `outputDirectory` in `vercel.json` does not match the actual build output path.

**Fix:**
1. Run `ng build --configuration production` locally
2. Verify the output is at `dist/hirehub/browser/index.html`
3. Ensure `vercel.json` has `"outputDirectory": "dist/hirehub/browser"`
4. If the project name was changed in `angular.json`, update the path accordingly

---

### Build fails with "ng: command not found"

**Symptom:** Vercel build logs show `ng: command not found`.

**Cause:** The Angular CLI is listed in `devDependencies` but Vercel may skip dev dependencies.

**Fix:** Ensure `@angular/cli` is in `devDependencies` in `package.json` and that the build command uses the local binary. Alternatively, update the build command to:
```json
{
  "buildCommand": "npx ng build --configuration production"
}
```

---

### Build fails with memory errors

**Symptom:** Build logs show `JavaScript heap out of memory`.

**Cause:** Angular builds can be memory-intensive, especially with large applications.

**Fix:** Increase the Node.js memory limit in the build command:
```json
{
  "buildCommand": "node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng build --configuration production"
}
```

---

### Assets or images not loading

**Symptom:** The application loads but images or other assets in the `assets/` folder return 404.

**Cause:** Asset paths may use absolute paths that do not account for the base href.

**Fix:**
1. Ensure `index.html` has `<base href="/">`
2. Reference assets with relative paths in templates: `src="assets/logo.png"` (not `/assets/logo.png` with a leading slash in component code)
3. Verify the `assets` array in `angular.json` includes the correct glob patterns:
   ```json
   "assets": [
     "src/favicon.ico",
     "src/assets"
   ]
   ```

---

### Styles missing or broken

**Symptom:** The application renders without CSS styles.

**Cause:** The styles bundle was not included in the build output, or the `outputDirectory` is pointing to the wrong level.

**Fix:**
1. Confirm the output directory is `dist/hirehub/browser` (not `dist/hirehub` — the `browser` subdirectory is required for Angular 17+)
2. Check that `styles.css` or `styles.scss` is listed in the `styles` array in `angular.json`
3. Rebuild and verify that `dist/hirehub/browser/styles-[hash].css` exists

---

### Deployment works but routes with parameters fail

**Symptom:** Routes like `/employee/:id` work when navigated to from within the app but fail on direct access.

**Cause:** This is the same SPA routing issue. The rewrite rule must catch all paths.

**Fix:** The catch-all rewrite `"source": "/(.*)"` handles this. If you have added more specific rewrite rules above the catch-all, ensure they do not inadvertently block parameterized routes.

---

## Continuous Deployment

When the repository is connected to Vercel via Git integration:

- Every push to the `main` branch triggers a **production deployment**
- Every push to other branches or pull requests triggers a **preview deployment**
- Preview deployments get unique URLs for testing before merging

No additional CI/CD configuration is needed. Vercel handles the build and deployment pipeline automatically.

---

## Useful Commands Reference

| Command | Purpose |
|---|---|
| `ng build --configuration production` | Build the app for production |
| `ng serve` | Run the development server locally |
| `vercel` | Deploy a preview build via CLI |
| `vercel --prod` | Deploy to production via CLI |
| `vercel logs <deployment-url>` | View deployment logs |
| `vercel env ls` | List configured environment variables |