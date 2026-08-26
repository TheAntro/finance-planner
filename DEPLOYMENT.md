# Deployment

Runs the whole stack — Next.js frontend, Spring Boot API, Postgres — with Docker Compose.
When you're done, the app is served on `127.0.0.1:3003` on the host.

Put a reverse proxy in front of that port to serve it publicly over TLS.

## Prerequisites

- Docker with Compose v2
- A [Logto](https://logto.io) instance (self-hosted or cloud)
- A base URL for the app — `http://localhost:3003` works for a local trial

Only the frontend is published to the host. The API and database have no published
ports and are reachable only on the internal Compose network.

## 1. Configure Logto

Create **two** things in the Logto console.

**An application**, type **Traditional Web**:

| Field | Value |
| --- | --- |
| Redirect URI | `<BASE_URL>/callback` |
| Post sign-out redirect URI | `<BASE_URL>` |

Note the App ID and App Secret.

**An API resource.** The identifier is a URI you choose and it never has to
resolve — it only ends up as the `aud` claim in access tokens, e.g.
`https://api.example.com`.

Without a registered API resource, Logto issues opaque tokens the API cannot
validate offline.

## 2. Configure the environment

```bash
git clone <repository-url> finance-planner
cd finance-planner
cp .env.example .env
chmod 600 .env
```

Fill in `.env`:

| Variable | Notes |
| --- | --- |
| `POSTGRES_DB` `POSTGRES_USER` `POSTGRES_PASSWORD` | Database credentials |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db:5432/<POSTGRES_DB>` |
| `SPRING_DATASOURCE_USERNAME` `SPRING_DATASOURCE_PASSWORD` | Must match the above |
| `API_BASE_URL` | `http://backend:8080` — the internal service name |
| `LOGTO_ENDPOINT` | Your Logto URL, no trailing slash |
| `LOGTO_APP_ID` `LOGTO_APP_SECRET` | From the application you created |
| `LOGTO_BASE_URL` | The app's own URL, must match the redirect URIs exactly |
| `LOGTO_COOKIE_SECRET` | 32 characters — `openssl rand -base64 24` |
| `API_RESOURCE_URI` | The API resource identifier |

`.env` holds secrets and is gitignored. Generate fresh values per environment
rather than reusing them.

`LOGTO_BASE_URL` also determines whether session cookies are marked `Secure`:
`https://` yes, `http://` no. That's why a local `http://localhost:3003` trial works.

## 3. Build and run

```bash
docker compose -f compose.prod.yaml up -d --build
```

The first build takes several minutes — the API image downloads its Maven
dependencies.

**Build on the target architecture.** Images built on arm64 will not run on an
x86_64 host. Either build on the machine that will run them, or build in CI on a
matching runner.

The build itself requires **no environment variables** — all configuration is
read at runtime, so one image can be promoted across environments unchanged.

## 4. Verify

```bash
curl -s localhost:3003/healthz          # {"status":"ok"}
docker compose -f compose.prod.yaml ps  # all services Up
docker stats --no-stream                # ~450 MB total
```

Then open the app, sign in, and create an item and a statement.

## Updating

```bash
git pull
docker compose -f compose.prod.yaml up -d --build
```

Database migrations run automatically at API startup.

## Data and backups

Postgres data lives in the `db-data` named volume. **There is no automatic
backup** — set up `pg_dump` on a schedule, copy the dumps off the host, and test
a restore before you rely on it.

`docker compose down -v` **deletes the volume and all data.** Never run it
against a live deployment.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `post_logout_redirect_uri not registered` | `LOGTO_BASE_URL` doesn't exactly match the Logto entry — check the trailing slash |
| Sign-in appears to work but no session | Serving over `http://` with an `https://` `LOGTO_BASE_URL`, so the `Secure` cookie is dropped |
| API returns 401 for everything | The token's `aud` doesn't match; check `API_RESOURCE_URI` against the API resource identifier |
| API won't start | It fetches OIDC discovery from `LOGTO_ENDPOINT` at startup and exits if unreachable |
| `/networth` errors, other pages fine | The frontend can't reach `API_BASE_URL` on the internal network |