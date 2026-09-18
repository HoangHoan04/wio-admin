# Deploy — wio-admin

Repo này push độc lập. Image: `ghcr.io/<owner>/wio-admin`.

| Môi trường | Domain | Port trong container | Bind trên VPS |
|---|---|---|---|
| Production | `https://admin.tiemcuoitanthoi.id.vn` | `80` (nginx trong image) | `127.0.0.1:3005` |

`VITE_API_BASE_URL` bake lúc **build image**. Đổi API URL phải build lại.

## 1. GitHub Secrets

| Secret | Mục đích |
|---|---|
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Thông báo CI/CD |
| `SSH_HOST` / `SSH_USER` / `SSH_KEY` | SSH vào VPS |
| `SSH_PORT` | Tùy chọn, mặc định `22` |
| `DEPLOY_PATH` | Mặc định `/opt/wio-admin` |
| `GHCR_TOKEN` | PAT `read:packages` để VPS pull |
| `VITE_API_BASE_URL` | `https://api.tiemcuoitanthoi.id.vn` |

## 2. Lần đầu trên VPS (Docker Compose)

Chạy **wio-api** trước:

```bash
sudo mkdir -p /opt/wio-admin /var/www/certbot
sudo git clone git@github.com:<owner>/wio-admin.git /opt/wio-admin
cd /opt/wio-admin
cp .env.production.example .env
nano .env

sudo cp nginx/site.conf /etc/nginx/sites-available/wio-admin.conf
sudo ln -sf /etc/nginx/sites-available/wio-admin.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot certonly --webroot -w /var/www/certbot \
  -d admin.tiemcuoitanthoi.id.vn

export GHCR_OWNER=<owner>
export TAG=latest
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

`nginx.conf` trong repo là config **trong container** (SPA + `/healthz`). `nginx/site.conf` là config **nginx host** (TLS + proxy `3005`).

Push `main`: Actions build (kèm `VITE_API_BASE_URL`) → GHCR → SSH pull/up.

## 3. Kubernetes (tùy chọn)

```bash
sed -i 's/YOUR_GH_OWNER/<owner>/g' k8s/*.yml
kubectl apply -k k8s
```

Namespace `wio` dùng chung. Nếu GHCR private, tạo secret `ghcr-pull` rồi thêm `imagePullSecrets` vào `k8s/deployment.yml`.

## 4. File trong repo này

- `Dockerfile` — Vite build → `nginx:1.27-alpine`
- `nginx.conf` — nginx trong image
- `docker-compose.yml` — local
- `docker-compose.prod.yml` — VPS
- `nginx/site.conf` — TLS reverse proxy trên host
- `k8s/` — deployment, service, ingress, hpa
- `.github/workflows/ci.yml` / `cd.yml`
