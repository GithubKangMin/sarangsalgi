import React, { useState, useEffect } from 'react';
import { topicsApi } from '../api/topics';
import { Topic, Answer } from '../types';
import AnswerForm from './AnswerForm';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ topic, onBack }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadAnswers();
  }, [topic.id]);

  const loadAnswers = async () => {
    try {
      setLoading(true);
      const data = await topicsApi.getAnswers(topic.id);
      setAnswers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '답변을 불러오는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmitted = () => {
    loadAnswers();
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

  return (
    <div className="max-w-4xl mx-auto" role="main">
      <button
        onClick={onBack}
        className="btn-secondary mb-4 flex items-center space-x-2"
        aria-label="토픽 목록으로 돌아가기"
      >
        <span>←</span>
        <span>목록으로</span>
      </button>

      <div className="card mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          {topic.title}
        </h1>
        
        <div className="text-gray-600 mb-4 whitespace-pre-wrap">
          {topic.content}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{answers.length}개 답변</span>
          <span>작성일: {formatDate(topic.createdAt)}</span>
        </div>
      </div>

      <AnswerForm topicId={topic.id} onSubmitted={handleAnswerSubmitted} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          답변 ({answers.length})
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">답변을 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <button onClick={loadAnswers} className="btn-primary">
              다시 시도
            </button>
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">아직 작성된 답변이 없습니다.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {answer.name && (
                      <div className="font-medium text-gray-900">{answer.name}</div>
                    )}
                    <div className="text-sm text-gray-500">{answer.studentId}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(answer.createdAt)}
                  </div>
                </div>
                
                <div className="text-gray-700 whitespace-pre-wrap">
                  {answer.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;