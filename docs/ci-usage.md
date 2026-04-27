# CI Usage

UpdateSentinel is a lightweight Compose-based update risk review tool. It runs locally in CI, reads Docker Compose files, and reports heuristic update risks.

It does not guarantee safe updates. It does not update containers, pull images, query Docker Hub, GHCR, or any external registry, connect to running containers, or send Compose files or reports anywhere.

## Local Usage

```bash
npm install
npm run build
node dist/cli.js scan examples/risky-compose.yml --format markdown
```

Markdown remains the default:

```bash
node dist/cli.js scan docker-compose.yml
```

## Docker Usage

```bash
docker build -t updatesentinel .
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/docker-compose.yml --format markdown
```

JSON output works the same way:

```bash
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/docker-compose.yml --format json
```

## JSON Output

Use JSON when another tool needs to parse the report:

```bash
node dist/cli.js scan docker-compose.yml --format json > updatesentinel-report.json
```

The JSON report includes:

- tool name and version
- scanned file path
- generated timestamp
- summary counts
- image risk entries
- stateful service detections
- auto-update detections
- backup and rollback hints
- findings with rule IDs, severities, evidence, and recommendations

## Fail-on Thresholds

Use `--fail-on` to turn findings into CI failures:

```bash
node dist/cli.js scan docker-compose.yml --fail-on high
node dist/cli.js scan docker-compose.yml --format json --fail-on medium
```

Supported thresholds:

- `none`: always exit `0`
- `high`: exit `1` if any high finding exists
- `medium`: exit `1` if any medium or high finding exists
- `low`: exit `1` if any low, medium, or high finding exists

The default is `none` for backward compatibility.

## Exit Codes

- `0`: scan completed and the selected threshold was not violated
- `1`: scan completed and the selected `--fail-on` threshold was violated
- `2`: invalid CLI usage, unsupported option value, file read error, or Compose parsing error

## GitHub Actions Example

See [github-actions-example.yml](github-actions-example.yml).

Minimal example:

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

The bundled example uses `examples/risky-compose.yml`, which intentionally contains high-risk findings. Replace it with the path to your Compose file before enabling a strict threshold on a real project.

## Recommended Usage for Self-hosted Projects

- Start with `--fail-on none` to collect reports without blocking changes.
- Move to `--fail-on high` once false positives are understood.
- Use JSON output when reports need to be archived or parsed by CI tooling.
- Keep Compose snippets in public CI logs free of secrets.
- Review changelogs, take backups, and test restores before updating stateful services.
