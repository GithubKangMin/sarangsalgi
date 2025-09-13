-- 사랑살기 데이터베이스 초기화 스크립트
-- RDS 마스터 사용자(sarangsalgidb)로 접속 후 실행

-- 데이터베이스 생성
CREATE DATABASE sarangsalgi;

-- 사용자 생성 및 권한 부여
CREATE USER sarangsalgi WITH PASSWORD 'sarangsalgi123';
GRANT ALL PRIVILEGES ON DATABASE sarangsalgi TO sarangsalgi;

-- sarangsalgi 데이터베이스에 연결하여 추가 권한 설정
\c sarangsalgi;

-- 스키마 권한 부여
GRANT ALL ON SCHEMA public TO sarangsalgi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sarangsalgi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sarangsalgi;

-- 기본 권한 설정 (향후 생성될 객체들에 대해)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO sarangsalgi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sarangsalgi;

-- 확인
\l
\du