# I built an open-source update risk checker for self-hosted Docker Compose stacks

GitHub: https://github.com/kozinkaihatusya/updatesentinel

I built UpdateSentinel, a small open-source CLI that scans `docker-compose.yml` files and prints a Markdown report about update risks.

Why I built it: I kept seeing self-hosted stacks where services used `latest`, floating tags, or auto-update tools without an obvious backup or rollback plan. That can be fine for some stateless services, but it gets risky around databases and apps with persistent data.

What it checks:

- unpinned images like `nginx`
- `latest` tags like `postgres:latest`
- floating tags like `stable`, `edge`, `nightly`, `main`, `rolling`, `beta`
- Watchtower/Ouroboros-style auto-update services
- DIUN-style update monitoring
- stateful services like Postgres, MySQL, Redis, Nextcloud, Gitea, Immich, Jellyfin, Home Assistant, etc.
- missing backup, rollback, and update-process hints

It runs locally with Node or Docker:

```bash
docker build -t updatesentinel .
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/docker-compose.yml --format markdown
```

It does not update containers, pull images, query registries, or send Compose files anywhere. The MVP is just a read-only heuristic review tool, so it does not replace changelog review, tested backups, or restore tests.

I am also collecting interest for a hosted SelfHostGuard dashboard and update setup reviews, but the CLI itself is free and open source.

I would appreciate feedback from people running real self-hosted stacks. False positives and missing rules are especially useful. If it seems useful, a GitHub star would also help the project get initial visibility, but feedback matters more right now.
