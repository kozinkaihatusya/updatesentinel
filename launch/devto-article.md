# Why latest tags can break your self-hosted Docker setup

Self-hosted Docker Compose stacks are easy to start and surprisingly easy to make fragile.

One small line can carry a lot of risk:

```yaml
services:
  db:
    image: postgres:latest
```

This may work for months. Then one update changes a major version, a migration path, a default setting, or a dependency assumption. For a stateless container, that may be annoying. For a database or app with persistent state, it can become downtime or data recovery work.

## Why updates are risky in self-hosted stacks

Self-hosted systems often mix very different services in one Compose file:

- databases
- reverse proxies
- media servers
- note apps
- Git hosting
- monitoring tools
- backup jobs
- update notification or auto-update services

These services do not all have the same update risk. Updating a small stateless helper is not the same as updating Postgres, Nextcloud, Gitea, Immich, or Home Assistant.

The risky part is not updating itself. The risky part is updating without knowing what changed, without a backup, and without a rollback path.

## Mistake 1: Using latest tags for stateful services

`latest` does not mean stable. It usually means "whatever the publisher currently points this tag at."

For stateful services, that can be dangerous:

```yaml
services:
  db:
    image: postgres:latest
```

A better pattern is to pin a specific version:

```yaml
services:
  db:
    image: postgres:16.2
```

Pinning does not make updates safe by itself. It makes updates intentional.

## Mistake 2: Blind auto-updates without backups

Tools like Watchtower can be useful, especially for small stateless services.

The risk increases when auto-updates apply to databases or apps with persistent state and there is no visible backup or restore process.

Before using auto-updates, ask:

- Which services are excluded?
- Are databases excluded?
- Are backups current?
- Has restore been tested?
- Is there a rollback plan?

## Mistake 3: No rollback plan

Rollback is not just "use the old image."

For stateful services, an update may change data formats or run migrations. Downgrading the image may not be enough.

A rollback plan should answer:

- What was the previous image tag?
- Where is the backup?
- How do I restore it?
- How long does restore take?
- What data may be lost?

## Mistake 4: Not reviewing changelogs

Pinned versions make it easier to review what changed.

Before updating, check:

- release notes
- breaking changes
- migration notes
- minimum version requirements
- backup recommendations

For a homelab this may sound heavy, but a quick review can prevent a long recovery session later.

## Mistake 5: Treating all services the same

Not every container has the same blast radius.

A reverse proxy, database, media server, and disposable test service should not always share the same update policy.

Useful questions:

- Is the service stateful?
- Does it hold user data?
- Does it have migrations?
- Is it public-facing?
- Can it be rebuilt from config?
- Can it be restored from backup?

## Why I built UpdateSentinel

I built UpdateSentinel as a small open-source CLI for reviewing these patterns in Docker Compose files.

It scans `docker-compose.yml` and reports things like:

- `latest` tags
- unpinned images
- floating tags like `stable`, `edge`, `nightly`, `main`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services using risky tags
- missing backup or rollback hints

It runs locally and prints Markdown. The MVP is read-only: it does not update containers, pull images, query registries, connect to containers, or send Compose files anywhere.

It is not a guarantee that an update is safe. It is a lightweight checklist for common Compose risks before you change a stack.

## GitHub link placeholder

GitHub: https://github.com/kozinkaihatusya/updatesentinel
