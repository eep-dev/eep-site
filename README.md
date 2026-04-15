# EEP Landing Site (`eep-site`)

Official landing page repository for the EEP ecosystem under the `eep-dev` organization.

- EEP protocol repository: [https://github.com/eep-dev/EEP](https://github.com/eep-dev/EEP)
- EEP landing page repository: [https://github.com/eep-dev/eep-site](https://github.com/eep-dev/eep-site)

## Purpose

This site is the public-facing documentation and landing experience for EEP.
It must stay aligned with:

- Protocol repo: [https://github.com/eep-dev/EEP](https://github.com/eep-dev/EEP)
- Landing repo: [https://github.com/eep-dev/eep-site](https://github.com/eep-dev/eep-site)
- Package scopes: npm `@eep-dev/*`, Python `eep-*`

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site.

Edit `app/page.tsx` and related components; the page auto-updates during development.

## Content Alignment Checklist

Before release, confirm these are reflected in site content:

- Strict fail-closed semantic verification defaults
- Zero-trust audit readiness and report links
- Compliance scoring and `--report-json` / `--report-md` examples
- Canonical adoption links (agent onboarding + enterprise playbook)
- Repository URLs under `eep-dev`

## Deployment

Deploy using your preferred platform (Vercel, Netlify, container-based deployment, etc.).
Keep production environment variables and domain configuration in sync with the `eep-dev` organization setup.
