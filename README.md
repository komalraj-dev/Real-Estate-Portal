# Estately — Premium Real Estate Portal

A full MERN stack real estate portal: React (Vite) + Tailwind on the frontend,
Node/Express + MongoDB (Mongoose) on the backend. JWT auth, property CRUD with
image upload, search & filters, favorites, an inquiry form, a user dashboard,
and an admin panel.

## Project Structure

```
real-estate-portal/
├── client/     React (Vite) frontend
└── server/     Express + MongoDB backend
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended), or
  - A local MongoDB instance (`mongodb://127.0.0.1:27017/real-estate-portal`)

## 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` (copy `.env.example`) and fill in your own values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/real-estate-portal
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=30d
```

> Get `MONGO_URI` from Atlas: Database → Connect → "Connect your application", then
> replace `<username>`, `<password>`, and add `/real-estate-portal` before the `?`.

Seed the database with an admin account and sample listings (optional but recommended):

```bash
npm run seed
```

This creates `admin@realestate.com` / `admin123` and 6 sample properties.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Visit `http://localhost:5000/api/health`
to confirm it's up.

## 2. Frontend Setup

Open a **second terminal**:

```bash
cd client
npm install
```

Create `client/.env` (copy `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Visit **http://localhost:5173** in your browser. The Vite dev server proxies
`/api` and `/uploads` requests to your backend on port 5000, so both must be
running at the same time.

## 3. Using the App

- **Register** a new account, or log in as the seeded admin:
  `admin@realestate.com` / `admin123`
- Browse `/listings`, filter by city/price/type/etc.
- Log in and go to **Dashboard → Add Property** to list your own property with photos.
- Favorite properties from any listing card; view them under **Dashboard → Favorites**.
- As the admin, visit `/admin` for the overview, property status/activation controls,
  and user management (block/delete).

## Building for Production

```bash
cd client
npm run build       # outputs client/dist
```

Serve `client/dist` with any static host, and deploy `server/` (e.g. Render,
Railway, or a VPS) with your production `.env` values. Set `VITE_API_URL` to
your deployed backend URL before building.

## Troubleshooting

- **"MongoDB Connection Error"** — double-check `MONGO_URI` in `server/.env`,
  and that your Atlas cluster's Network Access allows your IP (or `0.0.0.0/0`
  for local development).
- **Frontend loads but no properties show** — make sure the backend is running
  on port 5000 and you've run `npm run seed` at least once.
- **Images not showing** — uploaded images are served from `server/uploads`;
  make sure that folder exists (it's created automatically on first upload).
