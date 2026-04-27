# I built an open-source update risk checker for Docker Compose stacks

GitHub: https://github.com/kozinkaihatusya/updatesentinel

I built UpdateSentinel, a small read-only CLI for self-hosters running Docker Compose.

It scans `docker-compose.yml` and reports update risks such as:

- `latest` tags
- images with no explicit tag
- floating tags like `stable`, `edge`, `nightly`, `main`, and `rolling`
- Watchtower/Ouroboros-style auto-update hints
- DIUN-style update monitoring
- stateful services using risky tags
- missing backup or rollback hints

It runs locally and prints Markdown. It does not update containers, pull images, query registries, or send Compose files anywhere.

This is not meant to guarantee safe updates. It is a lightweight checklist for common Compose patterns that can make updates riskier.

Feedback and rule ideas are welcome.
