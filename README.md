# MathSprint

MathSprint is a full-stack maths practice app for students learning Smart Brain Abacus and Vedic Maths.

## Features

- Email/password registration and login with hashed passwords.
- Secure HTTP-only auth cookie, CSRF token cookie, CORS credentials, Helmet, and auth rate limiting.
- Smart Brain Abacus Level 0 through Level 7 based on the supplied syllabus.
- 33 Vedic Maths modules in the requested order.
- Infinite backend-generated questions with duplicate-repeat avoidance.
- Backend-only answer validation; `correctAnswer` is not sent until submission.
- Persistent progress by section and module: attempted, correct, accuracy, current streak, best streak.
- Animated abacus bead simulator.
- Live multiplayer scoring room with Socket.IO.
- Teacher/admin summary page for average scores, student results, classrooms, and enrollments.

## Structure

```text
maths-practice-app/
  client/   React + Vite + TypeScript
  server/   Express + TypeScript + Prisma + PostgreSQL
```

## Local setup

1. Create a PostgreSQL database.
2. Copy `server/.env.example` to `server/.env` and fill in values.
3. Install dependencies in both apps.
4. Run Prisma migration from `server`.
5. Start the API and frontend.

```bash
cd server
npm install
npm run prisma:migrate
npm run dev

cd ../client
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173`; the API defaults to `http://localhost:4000`.

## Deployment

### Netlify frontend

- Root directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-api.onrender.com`

`client/netlify.toml` includes the SPA rewrite to `index.html`.

### Render backend

- Service type: Web Service
- Runtime: Node
- Root directory: `server`
- Build command: `npm install && npm run build && npx prisma migrate deploy`
- Start command: `npm start`

Required environment variables:

```text
DATABASE_URL=postgresql://...
JWT_SECRET=long-random-secret
COOKIE_SECRET=long-random-secret
FRONTEND_URL=https://your-netlify-site.netlify.app
NODE_ENV=production
```

## Admin access

Users default to `student`. To make a teacher/admin, update the `User.role` field in PostgreSQL to `teacher` or `admin`.

## Tests

```bash
cd server && npm test
cd client && npm test
```
