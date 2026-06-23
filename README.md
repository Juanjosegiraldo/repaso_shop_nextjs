# ShopNova

ShopNova is a full e-commerce built with **Next.js 16 (App Router)**, **TypeScript**, **Mongoose** and **MongoDB Atlas**. It includes a product catalog, product detail with a comments history, authentication, favorites, cart and sales, internationalization (es/en/pt) and external services (transactional email, a daily cron report and an AI sales report).

## Features

- **Catalog** with product cards (favorite star + details), horizontal scroll.
- **Product detail** with extended fields (description, specs, stock) and a comments history.
- **Auth**: register (bcrypt hash), login, session in `localStorage`, protected actions.
- **Favorites, cart and sales** associated to each user.
- **Image upload** to Cloudinary (admin form) and an auto seed that fetches images from Pexels.
- **i18n** (es / en / pt) with a custom React Context (no external library).
- **Email** (Gmail SMTP): welcome email on register.
- **Cron** (Vercel Cron): daily sales report by email.
- **AI report** (Google Gemini, free tier): rotation/stock report, downloadable as `.txt`.
- **CSV export** of the monthly sales (download side of the upload/download challenge).

## Requirements

- Node.js 20+
- A MongoDB Atlas cluster
- Accounts/keys for the external services (see Environment variables)

## Installation

```bash
git clone https://github.com/Juanjosegiraldo/repaso_shop_nextjs.git
cd repaso_shop_nextjs
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To populate the catalog, send a `POST` to `/api/seed` (e.g. from Thunder Client).

## Environment variables

Create `.env.local` (see `.env.example`):

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string. If `mongodb+srv://` fails on your network, use the standard (non-SRV) string. |
| `NEXT_PUBLIC_BASE_URL` | Base URL used by the service layer (e.g. `http://localhost:3000`, or your Vercel URL in production). |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (image upload). |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `PEXELS_API_KEY` | Pexels API key for the auto-image seed (free; falls back to placehold.co). |
| `MAIL_USER` | Gmail address used to send email. |
| `MAIL_PASS` | Google **App Password** (16 chars, 2FA required) — NOT your normal password. |
| `REPORT_EMAIL` | Address that receives the daily sales report. |
| `CRON_SECRET` | Shared secret; the cron endpoint requires `Authorization: Bearer <CRON_SECRET>`. |
| `GEMINI_API_KEY` | Google AI Studio API key (free tier) for the AI report. Not the chat subscription. |

## Commands

```bash
npm run dev     # start the dev server
npm run build   # production build (also type-checks)
npm run start   # run the production build
npm run lint    # lint
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Mongoose / MongoDB Atlas · HeroUI · Tailwind CSS v4 · Nodemailer · Cloudinary · Pexels · Google Gemini · Vercel Cron.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. In MongoDB Atlas → **Network Access**, allow `0.0.0.0/0` so Vercel can connect.
3. In Vercel, **Import** the GitHub repo.
4. In **Settings → Environment Variables**, add every variable from the table above
   (set `NEXT_PUBLIC_BASE_URL` to your Vercel URL).
5. Deploy. The cron defined in `vercel.json` runs the daily sales report automatically.

## Author

- **Name:** Juan Jose Giraldo Muñoz
- **Clan:** Thompson
- **Email:** juan.jo15@hotmail.com
- **Document:** 1037662885
