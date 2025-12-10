<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dc8jniR0ZQOmoxign0msaWVkhQX2M5Hv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) or `API_KEY` in a `.env` for Docker when running the backend.
3. Run the app (Next.js):
   `npm run dev`

## Docker

- **Build image:** `docker build -t smartinvoice-validator:latest .`
- **Run (single container):**

   ```bash
   docker run -it --rm -p 8080:80 -e API_KEY="$API_KEY" smartinvoice-validator:latest
   ```

- **Run with Docker Compose:**

   If you have a `.env` file with `API_KEY=...` (or export `API_KEY` in your shell), start with:

   ```bash
   docker compose up --build
   ```

- **Environment variable note:** the app reads `process.env.API_KEY`. If you currently set `GEMINI_API_KEY` in `.env.local` for development, either rename it to `API_KEY` or set `API_KEY` when running the container.

- **Security:** Do not commit real API keys to the repository. Remove keys from tracked files and rotate them if they were committed.

### Backend proxy and Docker Compose

- This repository now includes a small backend that proxies requests to Google GenAI so your API key is never shipped to clients.
- Backend files are under `server/`. The backend listens on port `3001` and exposes `POST /api/extract`.
- Use `docker-compose.example.yml` to run both frontend and backend together (set `API_KEY` in a `.env` file or your shell).

### Exact Docker Compose commands

Create a `.env` file with your API key (DO NOT commit this file):

```bash
echo "API_KEY=your_real_api_key_here" > .env
# Optional: also set a short shared secret to protect the backend endpoint
echo "EXTRACT_API_KEY=some-short-secret" >> .env
```

Build and start both services (frontend + backend):

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f
```

Stop and remove containers:

```bash
docker compose down
```

Health check endpoints (when compose is running):

- Frontend: http://localhost:8080
- Backend: http://localhost:3001/health

Note: `docker compose` uses the `docker-compose.yml` in this repo. If you prefer the example file instead, run:

```bash
docker compose -f docker-compose.example.yml up --build
```


