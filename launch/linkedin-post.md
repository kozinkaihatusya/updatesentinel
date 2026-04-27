I built UpdateSentinel, an open-source CLI for reviewing update risk in self-hosted Docker Compose stacks.

It scans `docker-compose.yml` files and produces a Markdown report covering common update-risk patterns:

- `latest` and unpinned images
- floating tags such as `stable`, `edge`, `nightly`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services using risky tags
- missing backup, rollback, or update-process hints

The MVP is intentionally local and read-only. It does not update containers, pull images, query registries, or send Compose files anywhere.

It is not a replacement for release-note review, tested backups, or restore drills. The goal is to give self-hosters, homelab users, and small teams a quick configuration-based checklist before changing a stack.

GitHub: https://github.com/kozinkaihatusya/updatesentinel

Feedback, false positives, and rule ideas are welcome.
