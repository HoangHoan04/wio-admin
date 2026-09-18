# Deploy — wio-admin

CD trên `develop` / `main` dùng GitHub Environment (`development` / `production`). Image: `ghcr.io/hoanghoan04/wio-admin`.

`VITE_API_BASE_URL` bake lúc build. Secret nằm trong Environment.

| Nhánh | Environment | Container | Host bind |
|---|---|---|---|
| `main` | `production` | `wio_admin_prod` | `127.0.0.1:5003` → `80` |
| `develop` | `development` | `wio_admin_dev` | `127.0.0.1:4003` → `80` |

## GitHub Environment secrets

| Secret | Mục đích |
|---|---|
| `SERVER_HOST` / `SERVER_USER` / `SSH_PRIVATE_KEY` | SSH VPS |
| `VITE_API_BASE_URL` | Bake vào image (`https://api.tiemcuoitanthoi.id.vn`) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Notify |
| `DEPLOY_URL` | Optional |

## VPS

- Thư mục: `/opt/wio/prod/admin` hoặc `/opt/wio/dev/admin`
- Network: `wio_net`
- Nginx host proxy tới `127.0.0.1:5003` (prod)

`nginx.conf` là nginx **trong image** (SPA + `/healthz`). `nginx/site.conf` là nginx **host** (TLS).
