# 사랑살기 API 테스트 cURL 명령어

## 1. 고민 등록 (학생)

```bash
curl -X POST http://localhost:8080/api/concerns \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024001234",
    "name": "홍길동",
    "category": "학업",
    "title": "진로 고민",
    "content": "졸업 후 취업에 대한 고민이 많습니다. 어떤 방향으로 준비해야 할까요?"
  }'
```

## 2. 토픽 목록 조회 (학생)

```bash
curl -X GET http://localhost:8080/api/topics
```

## 3. 토픽 상세 조회 (학생)

```bash
# 먼저 토픽 목록에서 ID 확인 후 사용
curl -X GET http://localhost:8080/api/topics/{topic-id}
```

## 4. 토픽 답변 목록 조회 (학생)

```bash
curl -X GET http://localhost:8080/api/topics/{topic-id}/answers
```

## 5. 토픽에 답변 작성 (학생)

```bash
curl -X POST http://localhost:8080/api/topics/{topic-id}/answers \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024005678",
    "name": "김학생",
    "content": "저도 비슷한 고민을 했었는데, 이렇게 해결했습니다..."
  }'
```

## 6. 관리자 로그인

```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "password": "admin123"
  }'
```

## 7. 관리자 세션 확인

```bash
curl -X GET http://localhost:8080/api/admin/session \
  -b cookies.txt
```

## 8. 고민 전체 조회 (관리자)

```bash
# 전체 조회
curl -X GET http://localhost:8080/api/admin/concerns \
  -b cookies.txt

# 검색 + 필터 + 정렬
curl -X GET "http://localhost:8080/api/admin/concerns?q=취업&category=진로&sort=latest" \
  -b cookies.txt
```

## 9. 토픽 생성 (관리자)

```bash
curl -X POST http://localhost:8080/api/admin/topics \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "대학생활 팁 공유",
    "content": "대학생활을 하면서 유용했던 팁들을 공유해보세요!"
  }'
```

## 10. 토픽 수정 (관리자)

```bash
curl -X PUT http://localhost:8080/api/admin/topics/{topic-id} \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "수정된 제목",
    "content": "수정된 내용"
  }'
```

## 11. 토픽 삭제 (관리자)

```bash
curl -X DELETE http://localhost:8080/api/admin/topics/{topic-id} \
  -b cookies.txt
```

## 12. 관리자 로그아웃

```bash
curl -X POST http://localhost:8080/api/admin/logout \
  -b cookies.txt
```

## 13. OpenAPI 문서 확인

```bash
# Swagger UI
open http://localhost:8080/swagger-ui.html

# OpenAPI JSON
curl -X GET http://localhost:8080/v3/api-docs
```

## 주의사항

1. `{topic-id}`는 실제 UUID로 교체해야 합니다
2. 관리자 API는 로그인 후 쿠키를 사용해야 합니다 (`-c cookies.txt`로 저장, `-b cookies.txt`로 사용)
3. 기본 관리자 비밀번호는 `admin123`입니다
4. 환경변수 `ADMIN_PASSWORD`로 비밀번호를 변경할 수 있습니다