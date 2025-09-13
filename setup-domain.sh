#!/bin/bash
set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 도메인 입력 받기
read -p "도메인을 입력하세요 (예: sarangsalgi.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ 도메인을 입력해주세요${NC}"
    exit 1
fi

echo -e "${GREEN}🌐 도메인 설정 시작: $DOMAIN${NC}"

# Certbot 설치
echo -e "${YELLOW}📦 Certbot 설치 중...${NC}"
sudo dnf install -y certbot python3-certbot-nginx

# 기존 컨테이너 중지
echo -e "${YELLOW}🛑 기존 서비스 중지 중...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# SSL 인증서 발급
echo -e "${YELLOW}🔒 SSL 인증서 발급 중...${NC}"
sudo certbot certonly --standalone \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email admin@$DOMAIN \
  --agree-tos \
  --non-interactive

# docker-compose.prod.yml에서 도메인 교체
echo -e "${YELLOW}⚙️  Docker 설정 업데이트 중...${NC}"
sed -i "s/yourdomain.com/$DOMAIN/g" docker-compose.prod.yml

# nginx 설정에서 server_name 교체
echo -e "${YELLOW}🌐 Nginx 설정 업데이트 중...${NC}"
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/g" docker/nginx.conf

# 인증서 자동 갱신 설정
echo -e "${YELLOW}🔄 SSL 인증서 자동 갱신 설정 중...${NC}"
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.prod.yml restart app") | sudo crontab -

# 서비스 재시작
echo -e "${YELLOW}🚀 서비스 시작 중...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build

echo -e "${GREEN}✅ 도메인 설정 완료!${NC}"
echo -e "${GREEN}🌐 웹사이트: https://$DOMAIN${NC}"
echo -e "${GREEN}📋 API 문서: https://$DOMAIN/swagger-ui.html${NC}"
echo -e "${GREEN}💊 헬스체크: https://$DOMAIN/health${NC}"

# DNS 전파 확인
echo -e "${YELLOW}🔍 DNS 전파 확인 중...${NC}"
sleep 5
for i in {1..3}; do
    if nslookup $DOMAIN | grep -q $(curl -s ifconfig.me); then
        echo -e "${GREEN}✅ DNS 전파 완료!${NC}"
        break
    else
        echo "DNS 전파 대기 중... ($i/3)"
        sleep 10
    fi
done