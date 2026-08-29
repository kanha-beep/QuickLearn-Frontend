# qckRecall Frontend

React + Vite client for the study platform.

## API Target

The frontend is intended to call the dedicated Java backend in `../java-server`.

Set:

```bash
VITE_API_URL=http://localhost:3000
```

All app requests use `api.js`, which forwards:

- auth routes
- class, subject, chapter, and section routes
- dashboard/report routes
- contact routes

## Run

```bash
npm install
npm run dev
```

Start the Java backend before opening the app. In local development, if no API URL is set, the client falls back to the Vite `/api` proxy which targets `http://localhost:3000`.
"# qckRecall-java-front" 
