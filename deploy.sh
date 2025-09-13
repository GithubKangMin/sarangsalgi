#!/bin/bash
set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 사랑살기 배포 스크립트${NC}"

# 환경변수 확인
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. .env.example을 복사해서 .env를 만드세요${NC}"
    echo "cp .env.example .env"
    exit 1
fi

# Docker 및 Docker Compose 확인
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker가 설치되지 않았습니다${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose가 설치되지 않았습니다${NC}"
    exit 1
fi

# Git 정보
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

echo -e "${YELLOW}📋 배포 정보${NC}"
echo "  - 브랜치: $BRANCH"
echo "  - 커밋: $COMMIT_HASH"
echo "  - 시간: $(date)"

# 프로덕션 환경으로 빌드 및 배포
echo -e "${YELLOW}🔨 Docker 이미지 빌드 중...${NC}"
docker-compose -f docker-compose.prod.yml build

echo -e "${YELLOW}🚀 서비스 시작 중...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}⏳ 서비스 상태 확인 중...${NC}"
sleep 10

# 헬스체크
echo -e "${YELLOW}🏥 헬스체크 수행 중...${NC}"
for i in {1..5}; do
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 서비스가 정상적으로 실행 중입니다!${NC}"
        echo -e "${GREEN}🌐 접속 URL: http://localhost${NC}"
        echo -e "${GREEN}📋 API 문서: http://localhost/swagger-ui.html${NC}"
        echo -e "${GREEN}💊 헬스체크: http://localhost:8080/actuator/health${NC}"
        exit 0
    fi
    echo "  시도 $i/5 실패, 10초 후 재시도..."
    sleep 10
done

echo -e "${RED}❌ 서비스 시작 실패${NC}"
echo -e "${YELLOW}📋 로그 확인:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=50
exit 1