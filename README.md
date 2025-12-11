# maktab-abubakr-frontend

Angular frontend for the Maktab Abubakr project. Implements the client UI and communicates with a Spring Boot backend.

## Project overview

- Framework: Angular (generated with Angular CLI v12.1.3)
- Purpose: Single-page application (SPA) frontend for the Maktab Abubakr system
- Backend: Spring Boot (Maven) API (separate repository)

## Technology stack

- Frontend: Angular, TypeScript, JavaScript, npm
- Backend (integration): Java, Spring Boot, Maven
- Data: SQL (used by backend)
- Tooling: Node.js, Angular CLI, npm
- Other: Python/pip may be used for auxiliary scripts

## Prerequisites

- Node.js >= 14 and npm
- Angular CLI (optional): `npm install -g @angular/cli`
- For backend integration: Java JDK 11+, Maven
- Ensure backend API is running and note the base API URL

## Setup

1. Clone the repo:
  - `git clone <repo-url>`
  - `cd maktab-abubakr-frontend`
2. Install dependencies:
  - `npm install`
3. Configure API base URL:
  - Edit `src/environments/environment.ts` (and `environment.prod.ts`) and set `apiBaseUrl` to your backend URL, e.g. `http://localhost:8080/api`

## Development

- Start dev server:
  - `ng serve`
  - Open `http://localhost:4200/`
- The app will reload on source changes.

## Build

- Development build:
  - `ng build`
- Production build:
  - `ng build --prod`
- Artifacts are in the `dist/` directory.

## Testing

- Unit tests (Karma + Jasmine):
  - `ng test`
- End-to-end tests:
  - `ng e2e` (requires an e2e test runner and backend running)

## Linting

- `ng lint`

## Common issues

- If you see: "Component AppComponent is standalone and cannot be used in the @NgModule.bootstrap array..." — use `bootstrapApplication` in `main.ts` for a standalone component bootstrap or convert the component to a non-standalone component and keep module bootstrap.
- Ensure `apiBaseUrl` in environment files points to the running backend.

## Contributing

- Follow existing code style and add tests for new features.
- Run `npm run lint` and `npm test` before submitting PRs.

## License

- Add project license information here.
