---
title: Docs | Nebla
description: Where to find Nebla's documentation, from installing the panel and preparing Proxmox to configuration, the REST API and the CLI.
---

# Docs

Nebla's documentation lives with the code on GitHub, so it always matches the version you run.

## Get started

- [Install Nebla](/install) covers Docker Compose, the first admin account, connecting a cluster and the CLI.
- [Proxmox setup](https://github.com/nebla-cloud/nebla/blob/main/docs/proxmox-setup.md) lists the roles, API token, TLS fingerprint, storages, templates and firewall setting.

## Reference

- [Configuration](https://github.com/nebla-cloud/nebla#configuration) lists every environment variable the panel reads.
- [REST API](https://github.com/nebla-cloud/nebla/blob/main/api/openapi.yaml) is described by an OpenAPI 3 spec. All endpoints sit under `/v1` and take a bearer token.
- The [CLI](https://github.com/nebla-cloud/nebla) uses the same API. Run `nebla help` or `nebla <command> --help` for every command and flag.

## Help

- Ask questions in [GitHub Discussions](https://github.com/nebla-cloud/nebla/discussions).
- Report bugs in [GitHub issues](https://github.com/nebla-cloud/nebla/issues).
