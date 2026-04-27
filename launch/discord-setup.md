# Discord Setup

Server name: `SelfHostGuard`

Create the server manually and add these channels:

- `#announcements` - release notes, project updates, and important maintainer messages.
- `#general` - general self-hosting and UpdateSentinel discussion.
- `#updatesentinel` - product-specific questions, roadmap discussion, and usage examples.
- `#support` - help with running the CLI and interpreting reports.
- `#feature-requests` - proposed rules, integrations, and output formats.
- `#bugs` - reproducible bugs and false positives with secrets removed.
- `#contributors` - implementation discussion for people contributing code or docs.

Recommended setup:

- Add a short rule asking users not to post secrets, private Compose files, credentials, tokens, internal hostnames, or sensitive infrastructure details.
- Pin the GitHub repo in `#updatesentinel`.
- Pin the security reporting note in `#bugs`.
- Keep launch traffic pointed at GitHub first.
