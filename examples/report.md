# UpdateSentinel Report

Scanned file: `examples/risky-compose.yml`

Total services: 6
Total images: 6
Total findings: 17

> Risk classification is based on local Docker Compose configuration heuristics. UpdateSentinel does not update containers, pull images, query registries, or contact running containers.

## Image Summary

| Service | Image | Pinning |
| --- | --- | --- |
| `app` | `ghcr.io/example/app:stable` | floating:stable |
| `db` | `postgres:latest` | floating:latest |
| `cache` | `redis` | unpinned |
| `media` | `jellyfin/jellyfin:nightly` | floating:nightly |
| `watchtower` | `containrrr/watchtower:latest` | floating:latest |
| `diun` | `crazymax/diun:latest` | floating:latest |

## Auto-update Services Detected

- `watchtower`: auto-update (containrrr/watchtower:latest)
- `diun`: monitor (crazymax/diun:latest)

## Stateful Services Detected

- `db`
- `cache`
- `media`

## Hints Detected

- Backup hints: none detected
- Update hints: `diun`, `watchtower`
- Rollback hints: none detected

## HIGH Risk

### Stateful service uses the latest tag

Service: `db`
Rule: `STATEFUL_SERVICE_LATEST_TAG`
Severity: `high`

Description:
Service `db` appears stateful and uses `postgres:latest`.

Evidence:
`postgres:latest`

Recommendation:
Pin the service to a specific version. Review release notes, take a backup, and verify restore steps before upgrading.

### Stateful service has no explicit image tag

Service: `cache`
Rule: `STATEFUL_SERVICE_UNPINNED_IMAGE`
Severity: `high`

Description:
Service `cache` appears stateful and uses an unpinned image.

Evidence:
`redis`

Recommendation:
Pin stateful services to specific versions and verify backup and restore steps before updating.

### Auto-update service is present without a visible backup hint

Service: `stack`
Rule: `AUTO_UPDATE_WITH_STATEFUL_SERVICES_NO_BACKUP`
Severity: `high`

Description:
Auto-update services (watchtower) and stateful services (db, cache, media) are present, but no backup hint was found.

Evidence:
`auto-update: watchtower; stateful: db, cache, media`

Recommendation:
Disable blind auto-updates for stateful services or add clear backup and restore procedures before enabling them.

## MEDIUM Risk

### Image uses the latest tag

Service: `db`
Rule: `IMAGE_LATEST_TAG`
Severity: `medium`

Description:
Service `db` uses `postgres:latest`, which can change without an explicit version decision.

Evidence:
`postgres:latest`

Recommendation:
Replace latest with a specific version and review changelogs before upgrading.

### Image has no explicit tag

Service: `cache`
Rule: `IMAGE_UNPINNED`
Severity: `medium`

Description:
Service `cache` does not specify an image tag or digest.

Evidence:
`redis`

Recommendation:
Pin the image to a specific version tag or digest before routine updates.

### Image uses the latest tag

Service: `watchtower`
Rule: `IMAGE_LATEST_TAG`
Severity: `medium`

Description:
Service `watchtower` uses `containrrr/watchtower:latest`, which can change without an explicit version decision.

Evidence:
`containrrr/watchtower:latest`

Recommendation:
Replace latest with a specific version and review changelogs before upgrading.

### Image uses the latest tag

Service: `diun`
Rule: `IMAGE_LATEST_TAG`
Severity: `medium`

Description:
Service `diun` uses `crazymax/diun:latest`, which can change without an explicit version decision.

Evidence:
`crazymax/diun:latest`

Recommendation:
Replace latest with a specific version and review changelogs before upgrading.

### Image uses floating tag stable

Service: `app`
Rule: `FLOATING_IMAGE_TAG`
Severity: `medium`

Description:
Service `app` uses `ghcr.io/example/app:stable`, and `stable` is commonly moved by upstream maintainers.

Evidence:
`ghcr.io/example/app:stable`

Recommendation:
Use a specific release version or digest for predictable updates.

### Image uses floating tag nightly

Service: `media`
Rule: `FLOATING_IMAGE_TAG`
Severity: `medium`

Description:
Service `media` uses `jellyfin/jellyfin:nightly`, and `nightly` is commonly moved by upstream maintainers.

Evidence:
`jellyfin/jellyfin:nightly`

Recommendation:
Use a specific release version or digest for predictable updates.

### Auto-update service detected

Service: `watchtower`
Rule: `AUTO_UPDATE_SERVICE_DETECTED`
Severity: `medium`

Description:
Watchtower/Ouroboros-style services commonly update containers automatically. This can be useful, but it increases update risk when used without backups and rollback steps.

Evidence:
`containrrr/watchtower:latest`

Recommendation:
Avoid blind auto-updates for stateful services. Document backup, restore, and rollback steps.

### Watchtower configuration hint detected

Service: `app`
Rule: `WATCHTOWER_HINT_DETECTED`
Severity: `medium`

Description:
Service `app` includes Watchtower-related configuration.

Evidence:
`com.centurylinklabs.watchtower.enable`

Recommendation:
Confirm whether this service can be updated automatically and document exclusions for stateful services.

### Watchtower configuration hint detected

Service: `watchtower`
Rule: `WATCHTOWER_HINT_DETECTED`
Severity: `medium`

Description:
Service `watchtower` includes Watchtower-related configuration.

Evidence:
`WATCHTOWER_CLEANUP`

Recommendation:
Confirm whether this service can be updated automatically and document exclusions for stateful services.

### Watchtower configuration hint detected

Service: `watchtower`
Rule: `WATCHTOWER_HINT_DETECTED`
Severity: `medium`

Description:
Service `watchtower` includes Watchtower-related configuration.

Evidence:
`WATCHTOWER_POLL_INTERVAL`

Recommendation:
Confirm whether this service can be updated automatically and document exclusions for stateful services.

### Stateful service uses a floating tag

Service: `media`
Rule: `STATEFUL_SERVICE_FLOATING_TAG`
Severity: `medium`

Description:
Service `media` appears stateful and uses the floating tag `nightly`.

Evidence:
`jellyfin/jellyfin:nightly`

Recommendation:
Prefer explicit version tags for databases and other stateful services.

### No backup hint found for stateful services

Service: `stack`
Rule: `NO_BACKUP_HINT_FOR_STATEFUL_SERVICES`
Severity: `medium`

Description:
Stateful services were detected (db, cache, media), but no obvious backup hint was found in the Compose file.

Evidence:
`db, cache, media`

Recommendation:
Document backups near the stack or add a backup service such as restic, borg, kopia, pgBackRest, rclone, or snapshots.

### No rollback hint found for stateful services

Service: `stack`
Rule: `NO_ROLLBACK_HINT_FOR_STATEFUL_SERVICES`
Severity: `medium`

Description:
Stateful services were detected (db, cache, media), but no obvious rollback, restore, snapshot, previous-version, pinning, or downgrade hint was found.

Evidence:
`db, cache, media`

Recommendation:
Document rollback steps before upgrading stateful services, including restore commands and the previous known-good image tag.

## LOW Risk

### Update monitoring service detected

Service: `diun`
Rule: `UPDATE_MONITOR_SERVICE_DETECTED`
Severity: `low`

Description:
DIUN is usually notification-focused, so UpdateSentinel classifies it as update monitoring.

Evidence:
`crazymax/diun:latest`

Recommendation:
Use monitoring alerts as input to a documented update process with changelog review.

## Update Readiness Checklist

- [ ] Pin image versions.
- [ ] Avoid latest for stateful services.
- [ ] Review changelogs before updating.
- [ ] Take backups before updating stateful services.
- [ ] Run restore tests.
- [ ] Roll out updates gradually.
- [ ] Document rollback steps.
- [ ] Avoid blind auto-updates for databases.

## Limitations

- Heuristic checks based on Docker Compose configuration only.
- No registry lookup in the MVP.
- No CVE scanning in the MVP.
- No Kubernetes support in the MVP.
- No hosted dashboard in the MVP.
- No actual update execution.
- Does not replace release-note review, tested backups, restore drills, or staged rollouts.

