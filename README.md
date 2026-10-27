# MediNest REST API — Doctor CRUD

ExpressJS + MongoDB Atlas + Mongoose REST API for managing doctor records.

## Setup
1. Install Node.js 18+ and create a MongoDB Atlas cluster/database user.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your actual connection string.
3. Run `npm install` and `npm start`.
4. Open `http://localhost:3000`.

Never commit `.env` or share database credentials.

## Endpoints
- `GET /` — API information
- `GET /api/health` — database health
- `POST /api/doctors` — create record (201)
- `GET /api/doctors` — list records (200), supports `page`, `limit`, `specialty`, `available`
- `GET /api/doctors/:id` — retrieve one record (200; 400 invalid ID; 404 missing record)
- `PUT /api/doctors/:id` — update record (200; 400 invalid input; 404 missing record)
- `DELETE /api/doctors/:id` — delete record (200; 400 invalid ID; 404 missing record)

Example JSON:
```json
{
  "fullName": "Dr Aditi Sharma",
  "specialty": "Cardiology",
  "email": "aditi.sharma.demo@example.com",
  "phone": "9876543210",
  "clinic": "MediNest Heart Clinic",
  "consultationFee": 800,
  "available": true
}
```

## Postman
Import `postman/MediNest-REST-API.postman_collection.json`. Set `baseUrl` to `http://localhost:3000` or the deployed public URL. Run Create first; the collection stores the returned ID in `doctorId`. Then test list, retrieve, update, delete and negative cases. Capture genuine Postman screenshots for your submission.

## Deploy to Render
Push this source to GitHub, create a Render Web Service, use `npm install` as build command and `npm start` as start command. Add `MONGODB_URI` and `NODE_ENV=production` in environment settings. Confirm MongoDB Atlas network access allows the hosted service to connect. After deployment, test `https://YOUR-SERVICE.onrender.com/api/health`, set Postman `baseUrl` to that service URL, and repeat all requests.

This package is not yet deployed to a live URL; hosting requires your own account and environment variables. In-memory storage is not used: records persist in MongoDB. Use fictional demo doctor data. Add authentication, authorization, rate limiting, audit logs and security review before production.
