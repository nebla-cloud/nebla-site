---
title: Install Nebla
description: Run Nebla with Docker Compose next to Proxmox VE, create the first admin account, connect a cluster and install the CLI.
---

# Install Nebla

You need three things:

- A Proxmox VE 8 or 9 node or cluster.
- A Linux machine with Docker Compose that can reach the Proxmox API on port 8006. A small VM on the same host is enough.
- A URL for the panel, such as `https://panel.example.com`.

## 1. Prepare Proxmox

Nebla talks to Proxmox only through its API. It never uses SSH and installs nothing on the host. Run these once per cluster, in a root shell on any node:

- Create the `Nebla` role on `/` and the `NeblaISO` role on your ISO storage.
- Create the user `nebla@pve` and give it both roles.
- Create an API token with `pveum user token add nebla@pve panel --privsep 0`, and keep the secret it prints.
- Read the TLS fingerprint of the node you will connect to with `pvenode cert info`.

The [Proxmox setup guide](https://github.com/nebla-cloud/nebla/blob/main/docs/proxmox-setup.md) has the exact privilege lists for PVE 8 and 9, the storage requirements, and the firewall setting that tenant isolation needs.

## 2. Start Nebla

Make a folder and save this as `compose.yaml`:

```yaml
name: nebla

services:
  panel:
    image: ghcr.io/nebla-cloud/nebla:latest
    restart: unless-stopped
    stop_grace_period: 75s
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "${PANEL_PORT:-8080}:8080"
    environment:
      PANEL_DATABASE_URL: postgres://nebla:${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}@postgres:5432/nebla?sslmode=disable
      PANEL_LISTEN: ":8080"
      PANEL_BASE_URL: ${PANEL_BASE_URL:?set PANEL_BASE_URL in .env}
      PANEL_SECRET_KEY: ${PANEL_SECRET_KEY:?set PANEL_SECRET_KEY in .env}
      PANEL_SMTP_URL: ${PANEL_SMTP_URL:-}
      PANEL_TRUSTED_PROXIES: ${PANEL_TRUSTED_PROXIES:-}
    healthcheck:
      test: ["CMD", "/nebla-server", "healthcheck"]
      interval: 15s
      timeout: 5s
      start_period: 20s
      retries: 3

  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_DB: nebla
      POSTGRES_USER: nebla
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nebla -d nebla"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  pgdata:
```

Next to it, create `.env`:

```ini
PANEL_BASE_URL=https://panel.example.com
PANEL_SECRET_KEY=
POSTGRES_PASSWORD=
PANEL_PORT=8080
```

Fill in the two secrets:

```sh
openssl rand -base64 48   # PANEL_SECRET_KEY
openssl rand -hex 24      # POSTGRES_PASSWORD
```

Keep `PANEL_SECRET_KEY` safe. Nebla uses it to seal the Proxmox token secrets it stores, and without it they can't be read.

Start it and check that it answers:

```sh
docker compose up -d
curl -fs localhost:8080/v1/healthz
```

Optional settings, such as SMTP for invite emails, trusted reverse proxies and default quotas, are listed in the [configuration table](https://github.com/nebla-cloud/nebla#configuration).

## 3. Create the first admin account

Open the panel URL and create the first account. It becomes the panel admin. Later accounts come from the admin or from invite links. Open sign-up is off until you turn it on.

## 4. Connect your cluster

In the admin area:

1. Add a location with the Proxmox URL, the token ID `nebla@pve!panel`, its secret, the TLS fingerprint, and the disk and ISO storages.
2. Create server types, for example `small-2` with 2 vCPU, 4 GB of memory and a 40 GB disk.
3. Add an IP pool with the bridge, optional VLAN tag, CIDR, gateway, DNS and the address range servers may use.
4. Add images. On Proxmox VE 8.4 or later, enable official Debian, Ubuntu, Rocky Linux, AlmaLinux or Fedora images in one click. On any version you can register a cloud-init template you built yourself.

## 5. Install the CLI

```sh
brew install nebla-cloud/tap/nebla
```

Or download a binary for your platform from [GitHub Releases](https://github.com/nebla-cloud/nebla/releases). Then point it at your panel with an API token from a project:

```sh
nebla context create home
nebla server list
```

## Upgrading

```sh
docker compose pull
docker compose up -d
```

Nebla migrates its database on start. Back up the `pgdata` volume before major upgrades.
