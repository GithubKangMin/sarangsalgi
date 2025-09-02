import React, { useState, useEffect } from 'react';
import { topicsApi } from '../api/topics';
import { Topic } from '../types';

interface TopicListProps {
  onTopicSelect: (topic: Topic) => void;
}

const TopicList: React.FC<TopicListProps> = ({ onTopicSelect }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await topicsApi.getAll();
      setTopics(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '토픽을 불러오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">토픽을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadTopics}
          className="btn-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">아직 등록된 토픽이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" role="main">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        토픽 목록
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onTopicSelect(topic)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTopicSelect(topic);
              }
            }}
            aria-label={`토픽: ${topic.title}. ${topic.answersCount}개 답변. 마지막 업데이트: ${formatDate(topic.lastUpdatedAt)}`}
          >
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {topic.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {topic.content}
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{topic.answersCount}개 답변</span>
              <span>{formatDate(topic.lastUpdatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;