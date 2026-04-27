---
name: Setup review request
about: Request interest in a paid update-risk or setup review
title: "setup review: "
labels: setup-review
assignees: ""
---

## Safety

Do not paste secrets, credentials, private compose files, or sensitive infrastructure details.

## What kind of update setup do you want reviewed?

Example: Docker Compose update process, Watchtower setup, rollback plan, backup-before-update workflow.

## Main concern

Choose any that apply:

- latest tags
- Watchtower
- rollback plan
- backups before updates
- stateful services
- other

## Approximate number of services

Example: 5 services, 20 services, multiple stacks.

## Update tools currently used

Example: Watchtower, Diun, Renovate, Dependabot, manual updates, custom scripts.

## Docker Compose snippet, optional

Remove secrets, credentials, private hostnames, internal IPs, and sensitive paths.

```yaml
services:
  app:
    image: example/app:1.2.3
```

## Preferred contact method, optional

GitHub is fine. Add another contact method only if you are comfortable sharing it publicly.

## Urgency, optional

Example: no rush, before next maintenance window, active incident.
