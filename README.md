# Jeevitham

Jeevitham is a premium maternal and child healthcare web prototype focused on clarity, trust, accessibility, and simple family health actions.

## Overview

This project presents Jeevitham as a healthcare platform for:

- Parents
- New mothers
- Elderly guardians
- Rural and urban families
- Doctors
- Hospitals

The experience is designed to make the most important actions easy to find:

- Emergency access
- Appointments
- Vaccination tracking
- Patient services
- Health learning

## Current Prototype Features

- Real sign-in and sign-up, backed by the Express API: hashed passwords, SQLite-stored accounts, JWT sessions
- Persistent login across reloads and restarts (session token, verified against the server on load)
- Parent, doctor, and hospital role views
- Light and dark theme toggle
- Responsive sidebar and header navigation
- Simplified healthcare dashboard
- Learning Hub with prototype lesson cards and modal details
- Emergency quick access
- Appointments, records, vaccination, and service modules
- Multilingual-ready label architecture for English, Tamil, and Hindi

## Demo Login

A demo account is seeded automatically on first server start:

- Email: `admin@jeevitham.in`
- Password: `123456`

Or use "Create Account" on the sign-in screen to register your own parent, doctor, or hospital-desk account.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- Radix UI Dialog

## Project Structure

```text
src/
  components/
    auth/
    dashboard/
    ui/
  contexts/
  lib/
  pages/
  routes/
  styles/
public/
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

To preview the production build:

```bash
npm run build
npm run preview
```

For Android or iOS devices on the same local network, start the development or preview server, then open the LAN URL printed by Vite (for example, `http://192.168.x.x:5173/`) in the device browser. The `dev` and `preview` scripts listen on the local network for this purpose.

Then open the local URL printed by Vite, typically:

```bash
http://127.0.0.1:4173/
```

## Design Notes

Jeevitham intentionally avoids looking like a generic admin dashboard. The UI emphasizes:

- Large touch targets
- Simple wording
- High contrast
- Calm healthcare visuals
- Reduced clutter
- Clear next actions

## Branding

The Jeevitham logo used in this project is preserved as provided and should not be redesigned or replaced.

## Status

This is a healthcare prototype intended for demos, investor presentations, and product direction work. Accounts, sessions, patient records, vaccination/prescription/visit-note writes, the AI chat assistant, and the AI nutrition analyzer are all backed by a real Express API (`server/`) with SQLite storage and Google Gemini — see `server/.env.example` for the env vars it needs. SQLite is a single file on the API's disk, so a real multi-instance production deploy still wants a hosted database (e.g. Postgres) instead.

## Deployment

The frontend (this Vite app) deploys to Vercel; the API (`server/`) deploys to Render as a separate service.

### Backend — Render

1. In the Render dashboard, choose **New > Blueprint** and point it at this repo. Render reads `render.yaml` at the repo root and provisions a web service rooted at `server/` automatically.
2. When prompted, set the env vars marked `sync: false` in `render.yaml`:
   - `GEMINI_API_KEY` — from [aistudio.google.com](https://aistudio.google.com).
   - `CORS_ORIGIN` — leave blank until the Vercel domain exists, then set it to that domain (e.g. `https://jeevitham.vercel.app`) and redeploy to lock the API down to just that origin.
   - `JWT_SECRET` — a long random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Without it, a new random secret is generated on every restart and every signed-in user is logged out each time the free-tier service cold-starts.
3. Render assigns a public URL like `https://jeevitham-api.onrender.com`. Patient, activity, and user accounts live in a SQLite file inside the service's container (`server/data/jeevitham.sqlite`) — real persistence between requests and restarts, but Render's free plan has an ephemeral filesystem, so a redeploy still resets it to the sample seed data. That's fine for a demo; holding real patient data in production needs either a Render Disk (paid plan) mounted at `server/data`, or swapping SQLite for a hosted Postgres instance.

### Frontend — Vercel

1. Import this repo as a new Vercel project. It auto-detects Vite (build command `npm run build`, output `dist`); `vercel.json` adds the SPA rewrite React Router needs.
2. Set the project env var `VITE_API_URL` to the Render URL from above (e.g. `https://jeevitham-api.onrender.com`), then redeploy.
