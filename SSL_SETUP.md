# SSL 인증서 설정 가이드

## 프로덕션 배포 전 SSL 인증서 준비

### 1. Let's Encrypt 사용 (권장)
```bash
# Certbot 설치
sudo apt-get update
sudo apt-get install certbot

# 인증서 발급 (도메인명 변경 필요)
sudo certbot certonly --standalone -d yourdomain.com

# 인증서를 Docker 볼륨에 복사
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/lib/docker/volumes/sarangsalgi_ssl_certs/_data/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/lib/docker/volumes/sarangsalgi_ssl_private/_data/key.pem
```

### 2. 자체 서명 인증서 (테스트용)
```bash
# 자체 서명 인증서 생성
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem \
    -out cert.pem \
    -subj "/C=KR/ST=Seoul/L=Seoul/O=Sarangsalgi/CN=localhost"

# Docker 볼륨에 복사
docker volume create sarangsalgi_ssl_certs
docker volume create sarangsalgi_ssl_private
docker run --rm -v $(pwd):/src -v sarangsalgi_ssl_certs:/dest alpine cp /src/cert.pem /dest/
docker run --rm -v $(pwd):/src -v sarangsalgi_ssl_private:/dest alpine cp /src/key.pem /dest/
```

### 3. AWS Certificate Manager (ALB 사용 시)
```bash
# ALB를 사용하는 경우 nginx에서 SSL 설정 제거하고 HTTP만 사용
# docker/nginx.conf에서 HTTPS 블록 제거하고 HTTP만 유지
```

## 배포 후 확인
- `https://yourdomain.com/health` 접속 확인
- SSL Labs에서 보안 등급 확인: https://www.ssllabs.com/ssltest/