# Show HN: UpdateSentinel - open-source update risk checker for Docker Compose

GitHub: https://github.com/kaibuild/updatesentinel

I built UpdateSentinel, a small open-source CLI for self-hosters who run Docker Compose stacks.

It scans a `docker-compose.yml` file and reports update-related risks:

- `latest` tags
- images with no explicit tag
- risky floating tags like `stable`, `edge`, `nightly`, `main`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services using risky tags
- missing backup, rollback, or update-process hints

It runs locally, prints Markdown, and is read-only. The MVP does not update containers, pull images, query Docker Hub/GHCR, or contact running containers.

This is intentionally heuristic and Compose-based, not a guarantee that an update is safe. The goal is to catch common risky patterns before changing a homelab or small-team stack.

I am also collecting interest in a possible future hosted dashboard, but the CLI is the main project and is free/open source.

Feedback, false positives, and rule ideas are very welcome.
