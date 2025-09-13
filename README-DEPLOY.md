# 🚀 사랑살기 배포 가이드

## 배포 전 준비사항

### 1. RDS 데이터베이스 설정

RDS에 접속하여 데이터베이스와 사용자를 생성하세요:

```sql
-- 마스터 사용자(sarangsalgidb)로 접속 후 실행
psql -h sarangsalgi.cjmecuk20rem.ap-northeast-2.rds.amazonaws.com \
     -U sarangsalgidb \
     -d postgres \
     -p 5432

-- 데이터베이스 및 사용자 생성
CREATE DATABASE sarangsalgi;
CREATE USER sarangsalgi WITH PASSWORD 'sarangsalgi123';
GRANT ALL PRIVILEGES ON DATABASE sarangsalgi TO sarangsalgi;
\q
```

### 2. 환경변수 설정

`.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

필요에 따라 `.env` 파일의 값들을 수정하세요.

### 3. EC2 보안 그룹 설정

EC2 보안 그룹에서 다음 포트들이 열려있는지 확인:

- **80 포트**: HTTP 웹 접근
- **443 포트**: HTTPS 웹 접근  
- **8080 포트**: API 직접 접근 (선택사항)

## 배포 실행

### 자동 배포 스크립트 사용

```bash
./deploy.sh
```

### 수동 배포

```bash
# 1. 이미지 빌드
docker-compose -f docker-compose.prod.yml build

# 2. 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

# 3. 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

## 배포 후 확인

- **웹사이트**: http://[EC2-IP]
- **API 문서**: http://[EC2-IP]/swagger-ui.html  
- **헬스체크**: http://[EC2-IP]:8080/actuator/health

## 관리 명령어

```bash
# 서비스 중지
docker-compose -f docker-compose.prod.yml down

# 서비스 재시작
docker-compose -f docker-compose.prod.yml restart

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f [service-name]

# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps
```

## 문제 해결

### 데이터베이스 연결 실패
1. RDS 보안 그룹 확인
2. 데이터베이스/사용자 생성 확인
3. 환경변수 확인

### 서비스 시작 실패
```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 개별 서비스 로그
docker-compose -f docker-compose.prod.yml logs app
```

### 포트 접근 불가
1. EC2 보안 그룹에서 포트 개방 확인
2. nginx 설정 확인
3. 방화벽 설정 확인