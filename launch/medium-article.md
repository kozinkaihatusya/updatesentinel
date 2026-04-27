# Why `latest` tags can break your self-hosted Docker setup

Self-hosted Docker Compose stacks often grow from a few simple services into important personal or small-team infrastructure.

That makes update behavior matter.

One line like this can be enough to create avoidable risk:

```yaml
services:
  db:
    image: postgres:latest
```

It may work for a long time. Then an upstream tag moves, a major version changes, a migration runs, or a default changes. For stateless services this might be a quick fix. For databases and applications with persistent state, it can become downtime or recovery work.

## Why updates are risky in self-hosted stacks

Self-hosted Compose files often mix services with very different risk profiles:

- databases
- reverse proxies
- media servers
- Git services
- note apps
- backup jobs
- update monitors
- auto-update services

The problem is not updating. The problem is updating without knowing what changed, without a working backup, and without a rollback path.

## Mistake 1: Using `latest` tags for stateful services

`latest` does not mean safe. It usually means the tag can move when the publisher decides to move it.

For stateful services, prefer explicit versions:

```yaml
services:
  db:
    image: postgres:16.2
```

This does not make the update safe by itself. It makes the update intentional and reviewable.

## Mistake 2: Blind auto-updates without backups

Auto-update tools can be useful, especially for low-risk services. They are much riskier when they touch databases or applications that own persistent data.

Before enabling blind auto-updates, check whether stateful services are excluded and whether restore has been tested.

## Mistake 3: No rollback plan

Rolling back a stateful service can be more complicated than using the old image tag.

An update might run migrations or change stored data. A real rollback plan should include the previous image tag, backup location, restore command, and expected data-loss window.

## Mistake 4: Not reviewing changelogs

Pinned versions make changelog review practical. Before updating, look for breaking changes, migration notes, version requirements, and backup recommendations.

## Mistake 5: Treating all services the same

A disposable helper service, a reverse proxy, and a database should not necessarily share the same update policy.

Ask whether the service is stateful, public-facing, recoverable from config, backed up, and safe to downgrade.

## Why I built UpdateSentinel

I built UpdateSentinel as an open-source CLI that scans Docker Compose files and reports common update-risk patterns:

- `latest` tags
- unpinned images
- floating tags such as `stable`, `edge`, `nightly`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services using risky tags
- missing backup or rollback hints

It runs locally and prints Markdown. The MVP is read-only: it does not update containers, pull images, query registries, connect to containers, or send Compose files anywhere.

It is not a guarantee of safe updates. It is a small checklist for catching common Compose risks before changing a stack.

GitHub: https://github.com/kozinkaihatusya/updatesentinel
