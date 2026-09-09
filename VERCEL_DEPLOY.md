# Guard Mail — Vercel deployment

This project is a full-stack Node/Express + Vite app. The included `vercel.json`
configures Vercel to build the Vite frontend and serve the compiled UI from
`dist/public`.

## Deploy

1. Import the repository into Vercel from the project root (the folder containing `package.json`).
2. Do not choose `client` as the Root Directory.
3. Vercel will read `vercel.json` automatically.
4. Redeploy after pushing the file.

### Expected build settings

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: `dist/public`

## Important

This configuration fixes the **frontend/UI deployment**. The existing Express/tRPC
backend still needs a server-capable deployment or a Vercel serverless adaptation
before live analysis, authentication, database access, and other API features can
work from the Vercel URL.
