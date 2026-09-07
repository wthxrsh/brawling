# brawling

A full-stack "player flex card" generator for Brawl Stars. Enter any player tag and
get share-ready stats cards — with an animated on-screen preview and a one-click
high-resolution PNG export.

## Features

- **Live stats** — aggregates single-player, trio, solo, and duo victory counts from
  the official Brawl Stars API.
- **Flex card dashboard** — animated stat counters, brawler highlight, club + rank
  badges, and a canvas-style card render.
- **PNG export** — renders the card to a float-precision, device-pixel-ratio-aware
  image via `html-to-image`, so social posts stay crisp.
- **Resilient by design** — lazy-validated API credentials, typed error responses,
  and a `@ControllerAdvice` that maps upstream/downstream failures to a consistent
  error contract.

## Architecture

```
┌─────────────────┐         /api/v1/players/{tag}         ┌──────────────────────┐
│ React 19 + Vite │ ────────────────────────────────────▶ │ Spring Boot / Java 21 │
│  PlayerDashboard│        (vite dev proxy / CORS)        │  PlayerController      │
└─────────────────┘                                       └──────────┬───────────┘
                                                                     │
                                                            PlayerService
                                                                     │
                                                            BrawlStarsClient
                                                        (RestClient, bearer auth)
                                                                     │
                                                     https://api.brawlstars.com
```

The client (`frontend/frontend`) runs Vite's dev proxy (`/api` → `localhost:8080`);
the API also allows CORS from `http://localhost:5173` for direct calls.

## Tech stack

| Layer    | Technologies |
|----------|--------------|
| Backend  | Java 21, Spring Boot 4.1.1, Spring Web, Bean Validation, `RestClient` |
| Client   | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Framer Motion, `html-to-image`, `lucide-react` |
| Testing  | JUnit 5, Mockito, `MockRestServiceServer`, JaCoCo (backend) · Vitest 5, Testing Library, `jsdom` (client) |
| Tooling  | Maven Wrapper, oxlint, GitHub (`main`) |

## Repository layout

```
├── pom.xml                     # Spring Boot backend (JaCoCo enabled)
├── src/main/java/…/brawling/
│   ├── client/BrawlStarsClient.java   # upstream API client (RestClient + bearer)
│   ├── config/                        # RestClient.Builder + CORS
│   ├── controller/PlayerController    # GET /api/v1/players/{tag}
│   ├── dto/                           # API → stats mapping models
│   ├── exception/                     # ApiError + GlobalExceptionHandler
│   └── service/                       # PlayerService / StatsService
├── src/test/java/…/brawling/          # 16 tests (see Metrics)
└── frontend/frontend/
    ├── src/api/playerApi.ts           # typed client for the backend API
    ├── src/components/                # FlexCard + PlayerDashboard
    └── src/api|components/*.test.*    # Vitest suites (see Metrics)
```

## API

### `GET /api/v1/players/{playerTag}`

Fetches a player's aggregated stats.

| Parameter | Rules |
|-----------|-------|
| `playerTag` | must match `^#[A-Za-z0-9]{3,}$` (e.g. `#2VQJPYJE2`) |

**200 OK**

```json
{
  "tag": "#2VQJPYJE2",
  "name": "BrawlQueen",
  "trophies": 45000,
  "highestTrophies": 47000,
  "totalVictories": 5000,
  "threeVsThreeVictories": 3000,
  "soloVictories": 1200,
  "duoVictories": 800,
  "brawlerCount": 87,
  "highestTrophyBrawler": "Shelly",
  "highestBrawlerTrophies": 1200,
  "highestTrophyBrawlerRank": 35,
  "clubName": "Squad",
  "rankedRankName": "Diamond"
}
```

**Error contract** — all failures return a single shape via `ApiError`:

```json
{
  "timestamp": "2026-09-07T12:34:56.789Z",
  "status": 404,
  "error": "Not Found",
  "message": "Player not found",
  "path": "/api/v1/players/%23noop"
}
```

| Status | Case |
|--------|------|
| `400`  | invalid player tag `@Pattern` violation |
| `403`  | upstream rejected the API key |
| `404`  | player tag unknown to the upstream API |
| `429`  | upstream rate limit |
| `502`  | upstream unavailable |
| `500`  | unhandled server error |

## Getting started

### Prerequisites

- JDK 21+
- Node.js 20+ and npm
- A free Brawl Stars API token from
  [the developer portal](https://developer.brawlstars.com)

### Backend

```bash
export BRAWLSTARS_API_TOKEN="your-api-token"
./mvnw spring-boot:run        # http://localhost:8080
```

**Config via environment**

| Property | Default | Notes |
|----------|---------|-------|
| `BRAWLSTARS_API_TOKEN` | *(unset)* | Required to serve stats; the client validates lazily and fails with a clear `IllegalStateException` if missing when a request arrives. |
| `brawlstars.api.base-url` | `https://api.brawlstars.com` | Overridable in `application.properties`. |

> Engineering note: this project targets Spring Boot 4.1.1, where
> `RestClient.Builder` is **not** auto-configured by default (the
> `spring-boot-restclient` module is not on the classpath), so `RestClientConfig`
> declares the builder bean explicitly. The API token placeholder is consumed from
> `application.properties` (default `""`) to keep the context loadable in tests
> without credentials.

### Frontend

```bash
cd frontend/frontend
npm install
npm run dev                  # http://localhost:5173 (proxies /api → :8080)
```

Optional: point the client at a deployed API with
`VITE_API_BASE_URL` (defaults to `/api/v1`).

## Testing & metrics

Every change is verified on both sides; CI-friendly commands:

```bash
./mvnw clean test            # backend tests + JaCoCo report
cd frontend/frontend
npm run lint                 # oxlint
npm test                     # Vitest (jsdom) unit + component tests
npm run build                # tsc -b && vite build (typecheck + production bundle)
```

```
mvn test | Tests run: 16, Failures: 0, Errors: 0, Skipped: 0 [BUILD SUCCESS]
vitest  | Test Files  3 passed (3) | Tests 8 passed (8)
oxlint  | no warnings
```

### Backend coverage (JaCoCo, `target/site/jacoco/index.html`)

| Metric       | Coverage |
|--------------|----------|
| Instruction  | **97.1%** |
| Line         | **95.2%** |
| Branch       | **90.9%** |
| Method       | **93.1%** |
| Complexity   | **90.2%** |
| Class        | **92.9%** |

Suite breakdown (16 tests, 0 failures):

- `BrawlStarsClientTest` (3) — payload mapping, header/token propagation, error
  translation, via `MockRestServiceServer` bound to `RestClient.Builder`.
- `PlayerControllerTest` (5) — `@WebMvcTest` slice: happy path, tag-validation
  (`400`), upstream `404` → `404`, missing token → `500`, generic failure → `500`.
- `PlayerServiceTest` (1) — service-layer delegation.
- `StatsServiceTest` (6) — aggregation math for solo/duo/trio/total victories and
  brawler highlighting.
- `BrawlingApplicationTests` (1) — Spring context loads (works without credentials).

### Frontend tests (8 pass, ~2s)

- `playerApi.test.ts` (2) — fetch wrapper/URL handling.
- `FlexCard.test.tsx` (3) — identity/stats rendering, trophy-progress capping,
  and capture-ref/export-mode wiring.
- `PlayerDashboard.test.tsx` (3) — never calls the network, renders the flex card,
  and drives the BACK + EXPORT PNG flows with `user-event` (export is mocked).