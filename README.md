# UpdateSentinel

Open-source update risk checker for self-hosted Docker Compose stacks.

UpdateSentinel scans a `docker-compose.yml` file and prints a local Markdown or JSON report about update-related risks: unpinned images, `latest` tags, risky floating tags, auto-update services, stateful services, and missing backup, rollback, or update-process hints.

It is built for self-hosters, homelab users, small teams, and developers running services on VPSes, NAS devices, home servers, Tailscale, WireGuard, reverse proxies, or public cloud servers.

UpdateSentinel is a lightweight Compose-based update risk review tool. It runs locally. It does not guarantee safe updates, update containers, pull images, query registries in the MVP, or send your Compose file or report anywhere.

## Why This Exists

Self-hosted Docker Compose stacks often start simple:

```yaml
services:
  db:
    image: postgres:latest
```

That works until an update changes something important. For stateless services, that may be a quick rollback. For databases and apps with persistent state, a surprise update can mean downtime, migrations, backup restores, or data loss.

UpdateSentinel is a lightweight configuration review tool. It does not guarantee safe updates and it does not replace release-note review, tested backups, restore drills, or gradual rollouts. It gives you a quick local checklist before you change a stack.

## What It Checks

- images with no explicit tag, such as `nginx`
- `latest` tags, such as `postgres:latest`
- floating tags, such as `stable`, `edge`, `nightly`, `main`, `master`, `rolling`, `beta`, and `alpha`
- semver-pinned images, such as `postgres:16.2`
- digest-pinned images, such as `image@sha256:...`
- Watchtower and Ouroboros-style auto-update services
- DIUN-style update monitoring services
- Watchtower labels and `WATCHTOWER_*` environment variables
- stateful/database-like services, including Postgres, MySQL, MariaDB, MongoDB, Redis, Elasticsearch, OpenSearch, Nextcloud, Gitea, Immich, Jellyfin, Home Assistant, and Paperless
- backup hints such as `restic`, `borg`, `kopia`, `pgbackrest`, `rclone`, `snapshot`, and `dump`
- update strategy hints such as `renovate`, `dependabot`, `release`, and `changelog`
- rollback hints such as `rollback`, `restore`, `previous`, `pinned`, and `downgrade`

## Who It Is For

- self-hosters reviewing a Compose stack before upgrades
- homelab users running services on a NAS or home server
- small teams running internal tools with Docker Compose
- developers running apps on VPSes, reverse proxies, WireGuard, Tailscale, or public cloud servers

## Quick Start

```bash
git clone https://github.com/kaibuild/updatesentinel.git
cd updatesentinel
npm install
npm run build
node dist/cli.js scan examples/risky-compose.yml --format markdown
```

The CLI command is:

```bash
updatesentinel scan ./docker-compose.yml --format markdown
```

When running from a clone without installing the package globally:

```bash
node dist/cli.js scan ./docker-compose.yml --format markdown
```

JSON output is available for CI and tooling:

```bash
node dist/cli.js scan ./docker-compose.yml --format json
```

## Run With Docker

```bash
docker build -t updatesentinel .
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/docker-compose.yml --format markdown
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/docker-compose.yml --format json
```

## JSON Output

Use JSON when another tool needs to parse the report:

```bash
updatesentinel scan ./docker-compose.yml --format json
```

The JSON report includes the tool name and version, scanned file path, generated timestamp, summary counts, image risk entries, stateful service detections, auto-update detections, backup and rollback hints, and findings with rule IDs, severities, evidence, and recommendations.

## CI Fail Thresholds

Use `--fail-on` to make UpdateSentinel return a non-zero exit code when findings meet a selected severity threshold:

```bash
updatesentinel scan ./docker-compose.yml --fail-on high
updatesentinel scan ./docker-compose.yml --format json --fail-on medium
```

Supported values:

- `none`: always exit `0`
- `high`: exit `1` if any high finding exists
- `medium`: exit `1` if any medium or high finding exists
- `low`: exit `1` if any low, medium, or high finding exists

The default is `none` for backward compatibility.

## Exit Codes

- `0`: scan completed and the selected threshold was not violated
- `1`: scan completed and the selected `--fail-on` threshold was violated
- `2`: invalid CLI usage, unsupported option value, file read error, or Compose parsing error

## CI Usage

UpdateSentinel can run in CI without contacting registries or Docker. It only reads Compose configuration.

See [docs/ci-usage.md](docs/ci-usage.md) and [docs/github-actions-example.yml](docs/github-actions-example.yml).

Minimal GitHub Actions example:

```yaml
name: UpdateSentinel

on:
  pull_request:

jobs:
  update-risk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: node dist/cli.js scan examples/risky-compose.yml --format json --fail-on high
```

`examples/risky-compose.yml` intentionally contains high-risk findings, so that strict example fails. Replace it with your Compose file before using it as a blocking CI gate.

## Example Report

Reports are Markdown and can be copied into issues, pull requests, runbooks, or internal docs after removing sensitive paths or infrastructure details.

```markdown
# UpdateSentinel Report

Scanned file: `examples/risky-compose.yml`

Total services: 6
Total images: 6
Total findings: 17

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
```

See [examples/report.md](examples/report.md) for a generated report.

## Update Readiness Checklist

- Pin image versions.
- Avoid `latest` for stateful services.
- Review changelogs before updating.
- Take backups before updating stateful services.
- Run restore tests.
- Roll out updates gradually.
- Document rollback steps.
- Avoid blind auto-updates for databases.

## Current Limitations

- No registry lookup in the MVP.
- No CVE scanning in the MVP.
- No Kubernetes support in the MVP.
- No hosted dashboard in the MVP.
- No actual update execution.
- Findings are heuristic checks based on Docker Compose configuration.
- It does not replace careful release-note review, backups, restore tests, or staged rollouts.

## Roadmap

- HTML report output
- Docker Hub and GHCR tag lookup
- Renovate config support
- Dependabot config support
- Watchtower config improvements
- changelog link hints
- CVE integration
- hosted dashboard

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md).

Good first areas:

- add more stateful service keywords
- improve Watchtower detection
- add JSON output
- document more real-world Compose patterns
- add rule documentation

## Community

Use GitHub Issues for bugs, false positives, rule ideas, and documentation improvements.

Please avoid posting private Compose files, credentials, internal hostnames, or sensitive infrastructure details in public issues.

## Hosted dashboard / paid support

UpdateSentinel is free and open source.

A hosted SelfHostGuard dashboard may come later for teams that want:

- scheduled update-risk checks
- scan history
- image tag risk diffs over time
- alerts when risky tags appear
- GitHub Actions integration
- Slack / Discord alerts
- multi-stack monitoring
- team reports

If you want early access, open an [Early Access Request](https://github.com/kaibuild/updatesentinel/issues/new?template=early_access_request.md) issue.

If you need help reviewing your self-hosted update, Watchtower, backup-before-update, or rollback setup, open a [Setup Review Request](https://github.com/kaibuild/updatesentinel/issues/new?template=setup_review_request.md).

The hosted dashboard does not exist yet, support availability is not guaranteed, and UpdateSentinel does not guarantee safe updates. Real backups, changelog review, and restore testing are still required.

See [docs/paid-support.md](docs/paid-support.md) for more context.

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
