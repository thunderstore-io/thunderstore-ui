# Cyberstorm Remix (Nimbus)

This is the Remix application that powers the new Thunderstore frontend (codenamed Nimbus).

## Quick Start (Docker)

The easiest way to run the full stack (Backend + Frontend) is using Docker.

1.  **Clone Repositories**
    Ensure you have both `Thunderstore` (Backend) and `thunderstore-ui` (Frontend) cloned side-by-side.
    ```bash
    # Example structure
    # C:\projects\Thunderstore
    # C:\projects\thunderstore-ui
    ```

2.  **Start Backend**
    ```bash
    cd ../Thunderstore
    docker compose up -d
    docker compose exec django python manage.py setup_dev_env
    ```
    (If you have some pre-existing containers, please do `docker compose down -v`, `docker compose up -d --build` and `docker compose exec django python manage.py setup_dev_env`)

3.  **Start Frontend**
    ```bash
    cd ../thunderstore-ui
    docker compose -f docker-compose.remix.development.yml up -d
    ```
    (If you have some pre-existing containers, please do `docker compose -f docker-compose.remix.development.yml down -v` and `docker compose -f docker-compose.remix.development.yml up -d --build`)

4.  **Open Browser**
    -   **Frontend**: [http://new.localhost](http://new.localhost)
    -   **Backend**: [http://localhost](http://localhost)

## Manual Setup

If you prefer running Node locally instead of in Docker:

1.  **Install Dependencies**: `yarn install` (in repo root)
2.  **Configure Env**: Copy `.env.example` to `.env` in `apps/cyberstorm-remix`.
3.  **Run Dev Server**:
    ```bash
    yarn workspace @thunderstore/cyberstorm-remix dev --port 3000 --host 0.0.0.0
    ```
