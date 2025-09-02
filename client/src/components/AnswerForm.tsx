import React, { useState } from 'react';
import { topicsApi } from '../api/topics';
import { AnswerRequest } from '../types';

interface AnswerFormProps {
  topicId: string;
  onSubmitted: () => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ topicId, onSubmitted }) => {
  const [formData, setFormData] = useState<AnswerRequest>({
    studentId: '',
    name: '',
    content: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = '학번은 필수입니다';
    } else if (!/^\d{8,10}$/.test(formData.studentId.trim())) {
      newErrors.studentId = '학번은 8-10자리 숫자여야 합니다';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '내용은 필수입니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await topicsApi.createAnswer(topicId, {
        ...formData,
        studentId: formData.studentId.trim(),
        name: formData.name?.trim() || undefined,
        content: formData.content.trim(),
      });
      
      setFormData({
        studentId: '',
        name: '',
        content: '',
      });
      setErrors({});
      onSubmitted();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : '답변 작성 중 오류가 발생했습니다' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AnswerRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        답변 작성
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="answerStudentId" className="block text-sm font-medium text-gray-700 mb-1">
              학번 *
            </label>
            <input
              id="answerStudentId"
              type="text"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className={`input-field w-full ${errors.studentId ? 'border-red-500' : ''}`}
              placeholder="8-10자리 숫자"
              aria-describedby={errors.studentId ? 'answerStudentId-error' : undefined}
              aria-invalid={!!errors.studentId}
            />
            {errors.studentId && (
              <p id="answerStudentId-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.studentId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="answerName" className="block text-sm font-medium text-gray-700 mb-1">
              이름 (선택)
            </label>
            <input
              id="answerName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field w-full"
              placeholder="이름 입력"
              maxLength={20}
            />
          </div>
        </div>

        <div>
          <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
            내용 *
          </label>
          <textarea
            id="answerContent"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`input-field w-full h-24 resize-vertical ${errors.content ? 'border-red-500' : ''}`}
            placeholder="답변을 작성해주세요"
            maxLength={2000}
            aria-describedby={errors.content ? 'answerContent-error' : undefined}
            aria-invalid={!!errors.content}
          />
          {errors.content && (
            <p id="answerContent-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.content}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.content.length}/2000자
          </p>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '작성 중...' : '답변 작성'}
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;