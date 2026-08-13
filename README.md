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

- Login screen with frontend-only authentication
- Persistent login using `localStorage`
- Parent, doctor, and hospital role views
- Light and dark theme toggle
- Responsive sidebar and header navigation
- Simplified healthcare dashboard
- Learning Hub with prototype lesson cards and modal details
- Emergency quick access
- Appointments, records, vaccination, and service modules
- Multilingual-ready label architecture for English, Tamil, and Hindi

## Demo Login

Use the following credentials:

- Email: `admin@jeevitham.in`
- Password: `123456`

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

This is a UI/UX-first healthcare prototype intended for demos, investor presentations, and product direction work. It is frontend-only and does not include a production backend or real medical integrations.
