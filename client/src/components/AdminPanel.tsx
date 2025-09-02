import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import { topicsApi } from '../api/topics';
import SearchFilterBar from './SearchFilterBar';
import { Concern, ConcernCategory, Topic, TopicRequest } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [view, setView] = useState<'concerns' | 'topics'>('concerns');
  
  // Concerns state
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [concernsLoading, setConcernsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ConcernCategory | ''>('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [totalCount, setTotalCount] = useState(0);
  
  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [topicForm, setTopicForm] = useState<TopicRequest>({ title: '', content: '' });

  useEffect(() => {
    loadConcerns();
  }, [searchQuery, selectedCategory, sortOrder]);

  useEffect(() => {
    if (view === 'topics') {
      loadTopics();
    }
  }, [view]);

  const loadConcerns = async () => {
    try {
      setConcernsLoading(true);
      const data = await adminApi.getConcerns({
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        sort: sortOrder,
      });
      setConcerns(data.concerns);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('고민 로딩 오류:', error);
    } finally {
      setConcernsLoading(false);
    }
  };

  const loadTopics = async () => {
    try {
      setTopicsLoading(true);
      const data = await topicsApi.getAll();
      setTopics(data);
    } catch (error) {
      console.error('토픽 로딩 오류:', error);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      onLogout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title.trim() || !topicForm.content.trim()) return;

    try {
      await adminApi.createTopic(topicForm);
      setTopicForm({ title: '', content: '' });
      setShowCreateForm(false);
      await loadTopics();
    } catch (error) {
      console.error('토픽 생성 오류:', error);
    }
  };

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !topicForm.title.trim() || !topicForm.content.trim()) return;

    try {
      await adminApi.updateTopic(editingTopic.id, topicForm);
      setEditingTopic(null);
      setTopicForm({ title: '', content: '' });
      await loadTopics();
    } catch (error) {
      console.error('토픽 수정 오류:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await adminApi.deleteTopic(topicId);
      await loadTopics();
    } catch (error) {
      console.error('토픽 삭제 오류:', error);
    }
  };

  const startEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicForm({ title: topic.title, content: topic.content });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingTopic(null);
    setTopicForm({ title: '', content: '' });
    setShowCreateForm(false);
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
    <div className="max-w-6xl mx-auto" role="main">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          관리자 패널
        </h2>
        <button
          onClick={handleLogout}
          className="btn-secondary"
        >
          로그아웃
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setView('concerns')}
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${
              view === 'concerns'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            고민 관리
          </button>
          <button
            onClick={() => setView('topics')}
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${
              view === 'topics'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            토픽 관리
          </button>
        </div>
      </div>

      {view === 'concerns' && (
        <div>
          <SearchFilterBar
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortOrder={sortOrder}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortOrder}
            totalCount={totalCount}
          />

          {concernsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">고민을 불러오는 중...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {concerns.map((concern) => (
                <div key={concern.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {concern.name || '미기명'}
                        </span>
                        <span className="text-sm text-gray-500">({concern.studentId})</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {concern.category.replace('_', '/')}
                        </span>
                      </div>
                      {concern.title && (
                        <h3 className="font-medium text-gray-900 mb-2">{concern.title}</h3>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(concern.createdAt)}
                    </div>
                  </div>
                  
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {concern.content}
                  </div>
                </div>
              ))}
              
              {concerns.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">검색 조건에 맞는 고민이 없습니다.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'topics' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingTopic(null);
                setTopicForm({ title: '', content: '' });
              }}
              className="btn-primary"
            >
              새 토픽 생성
            </button>
          </div>

          {(showCreateForm || editingTopic) && (
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTopic ? '토픽 수정' : '새 토픽 생성'}
              </h3>
              
              <form onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic} className="space-y-4">
                <div>
                  <label htmlFor="topicTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    id="topicTitle"
                    type="text"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    placeholder="토픽 제목 입력"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="topicContent" className="block text-sm font-medium text-gray-700 mb-1">
                    내용 *
                  </label>
                  <textarea
                    id="topicContent"
                    value={topicForm.content}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, content: e.target.value }))}
                    className="input-field w-full h-32 resize-vertical"
                    placeholder="토픽 내용 입력"
                    maxLength={2000}
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary">
                    {editingTopic ? '수정' : '생성'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn-secondary"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {topicsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">토픽을 불러오는 중...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <div key={topic.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {topic.title}
                    </h3>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => startEditTopic(topic)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 mb-3 whitespace-pre-wrap">
                    {topic.content}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{topic.answersCount}개 답변</span>
                    <div className="text-right">
                      <div>생성: {formatDate(topic.createdAt)}</div>
                      <div>최종: {formatDate(topic.lastUpdatedAt)}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {topics.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">등록된 토픽이 없습니다.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;