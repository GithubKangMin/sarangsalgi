-- 사랑살기 데이터베이스 초기화 스크립트

-- 확장 설치 (UUID 지원)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 테이블 생성 (IF NOT EXISTS 사용)
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS concerns (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    content VARCHAR(2000) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS answers (
    id BIGSERIAL PRIMARY KEY,
    topic_id UUID,
    content VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);


-- 샘플 토픽 데이터
INSERT INTO topics (id, title, content, created_at, updated_at) VALUES 
(uuid_generate_v4(), '대학생활 팁 공유', '대학생활을 하면서 유용했던 팁들을 자유롭게 공유해보세요! 공부법, 생활 노하우, 인간관계 등 무엇이든 좋습니다.', NOW(), NOW()),
(uuid_generate_v4(), '진로 고민 나누기', '진로에 대한 고민이나 경험담을 나누어보세요. 취업 준비, 전공 선택, 진로 변경 등 다양한 이야기를 환영합니다.', NOW(), NOW()),
(uuid_generate_v4(), '스트레스 관리법', '학업이나 일상에서 받는 스트레스를 건강하게 관리하는 방법들을 공유해주세요.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_concerns_created_at ON concerns(created_at);
CREATE INDEX IF NOT EXISTS idx_concerns_category ON concerns(category);
CREATE INDEX IF NOT EXISTS idx_concerns_student_id ON concerns(student_id);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at);
CREATE INDEX IF NOT EXISTS idx_answers_topic_id ON answers(topic_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at);
