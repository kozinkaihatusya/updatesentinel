# Why `latest` tags can break your self-hosted Docker setup

Docker Compose makes self-hosting approachable. It also makes it easy to hide update risk in plain sight.

This looks harmless:

```yaml
services:
  db:
    image: postgres:latest
```

It may run fine until the tag moves and an update changes behavior, defaults, migrations, or compatibility expectations.

## Why updates are risky in self-hosted stacks

A self-hosted Compose stack often contains databases, reverse proxies, app servers, media tools, backup jobs, and update monitors in one file.

Those services should not always have the same update strategy.

The highest-risk updates are usually the ones that combine persistent data, unclear version changes, and no tested restore path.

## Mistake 1: Using latest tags for stateful services

`latest` is not a stability promise. It is a moving pointer.

For stateful services, explicit versions are easier to review and roll back:

```yaml
services:
  db:
    image: postgres:16.2
```

The point is not to avoid updates. The point is to make updates deliberate.

## Mistake 2: Blind auto-updates without backups

Auto-update tools can reduce maintenance for low-risk services. They can also create surprise maintenance windows when used around databases or apps with persistent state.

If an auto-update tool is present, check whether backups and restore tests are also part of the stack's operating routine.

## Mistake 3: No rollback plan

Rollback for a stateful service is not always just "run the previous image."

Data migrations can make downgrades difficult or impossible without restore. A rollback plan should include the previous image tag, backup location, restore steps, and expected downtime.

## Mistake 4: Not reviewing changelogs

Changelogs are where breaking changes, migration requirements, and backup warnings usually appear.

Pinned versions make it much easier to compare the current version with the target version.

## Mistake 5: Treating all services the same

A stateless helper service and a database have different failure modes.

Before updating, ask whether the service has persistent data, migration steps, public exposure, backup coverage, and a tested recovery path.

## Why I built UpdateSentinel

I built UpdateSentinel as a small open-source CLI for reviewing Docker Compose update risk.

It scans `docker-compose.yml` and flags:

- `latest` tags
- images without explicit tags
- floating tags like `stable`, `edge`, `nightly`, `main`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services with risky tags
- missing backup and rollback hints

The MVP runs locally and is read-only. It does not update containers, pull images, query registries, connect to containers, or send Compose files anywhere.

It is a heuristic review tool, not a safety guarantee. The goal is to catch common risky patterns before a self-hosted update becomes a recovery task.

GitHub: https://github.com/kaibuild/updatesentinel
