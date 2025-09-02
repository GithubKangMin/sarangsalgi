# 사랑살기 (SarangSalgi)

대학생 참여형 고민 플랫폼

## 프로젝트 구조

```
sarangsalgi/
├── README.md
├── docker-compose.yml
├── server/          # Spring Boot 백엔드
└── client/          # Vite React TypeScript 프론트엔드
```

## 기능 개요

- **고민거울**: 학생들이 고민을 등록 (목록은 관리자만 열람)
- **고민해우**: 관리자가 올린 토픽에 학생들이 답변 작성
- **관리자**: 고민 열람, 토픽 관리, 답변 현황 확인

## 빠른 시작

### 1. 데이터베이스 준비 (선택사항)

PostgreSQL 사용 시:
```bash
docker-compose up -d
```

### 2. 백엔드 실행

```bash
cd server
./mvnw spring-boot:run
```

또는 PostgreSQL 사용:
```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

### 3. 프론트엔드 실행

```bash
cd client
npm install
npm run dev
```

## 환경변수

### 백엔드 (server)
- `ADMIN_PASSWORD`: 관리자 비밀번호 (기본값: admin123)
- `SPRING_PROFILES_ACTIVE`: prod (PostgreSQL 사용 시)

### 데이터베이스
- H2: 개발용 파일 데이터베이스 (기본)
- PostgreSQL: 프로덕션용 (docker-compose로 실행)

## API 문서

백엔드 실행 후 접속:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 주요 엔드포인트

### 학생용
- `POST /api/concerns` - 고민 등록
- `GET /api/topics` - 토픽 목록
- `GET /api/topics/{id}` - 토픽 상세
- `GET /api/topics/{id}/answers` - 토픽 답변 목록
- `POST /api/topics/{id}/answers` - 답변 작성

### 관리자용
- `POST /api/admin/login` - 로그인
- `POST /api/admin/logout` - 로그아웃
- `GET /api/admin/session` - 세션 상태 확인
- `GET /api/admin/concerns` - 고민 전체 열람
- `POST /api/admin/topics` - 토픽 생성
- `PUT /api/admin/topics/{id}` - 토픽 수정
- `DELETE /api/admin/topics/{id}` - 토픽 삭제

## 데이터 검증

### 학번 규칙
- 숫자 8~10자리: `^\d{8,10}$`

### 길이 제한
- 학번: 16자 이하
- 이름: 20자 이하
- 제목: 100자 이하
- 내용: 2000자 이하

### 카테고리
- 학업, 진로, 인간관계, 생활/재정, 건강/멘탈, 기타

## 보안

- 관리자 세션: HttpOnly 쿠키 기반
- CORS: 프론트엔드 도메인 허용
- XSS 방지: HTML 태그 렌더링 금지
- 입력값 검증 및 정리(trim)

## 기술 스택

### 백엔드
- Spring Boot 3.x
- Java 17+
- Spring Web, Security, JPA/Hibernate
- H2 Database (개발), PostgreSQL (프로덕션)
- Validation, OpenAPI 3

### 프론트엔드
- Vite
- React 18+ with TypeScript
- Tailwind CSS
- Fetch API for HTTP requests

## 테스트

### 백엔드
```bash
cd server
./mvnw test
```

### 프론트엔드
```bash
cd client
npm test
```

## 빌드

### 백엔드
```bash
cd server
./mvnw clean package
```

### 프론트엔드
```bash
cd client
npm run build
```