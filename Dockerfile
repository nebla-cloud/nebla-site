# Static build of nebla.dev, served by nginx. Coolify builds this with the Dockerfile build pack.
FROM node:24.21.0-bookworm-slim AS build
WORKDIR /site
# better-sqlite3 (Nuxt Content) compiles from source when no prebuilt binary matches.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/* && corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm generate && node scripts/check-site.mjs

FROM nginx:1.31.9-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/.output/public /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
