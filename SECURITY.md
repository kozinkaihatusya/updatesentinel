# Security Policy

UpdateSentinel is a local, read-only Docker Compose configuration review tool.

The MVP:

- does not update containers
- does not pull images
- does not query Docker Hub, GHCR, or external registries
- does not connect to running containers
- does not send Compose files or reports anywhere

UpdateSentinel is not a full security audit, reliability audit, CVE scanner, backup validator, or release-note review replacement.

## Reporting Security Concerns

Please report security concerns by contacting the maintainer through the GitHub profile. Do not post secrets, credentials, private compose files, or sensitive infrastructure details in public issues.

## Handling Sensitive Compose Files

Before opening an issue:

- remove passwords, tokens, API keys, private hostnames, internal IPs, and volume paths that reveal sensitive details
- reduce the Compose file to the smallest snippet that reproduces the behavior
- avoid uploading private infrastructure configuration unless you are comfortable making it public
