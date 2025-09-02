import React, { useState } from 'react';
import { concernsApi } from '../api/concerns';
import { ConcernCategory, ConcernRequest } from '../types';

const MirrorIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const SendIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const ConcernForm: React.FC = () => {
  const [formData, setFormData] = useState<ConcernRequest>({
    studentId: '',
    name: '',
    category: '학업',
    title: '',
    content: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories: ConcernCategory[] = [
    '학업', '진로', '인간관계', '생활_재정', '건강_멘탈', '기타'
  ];

  const categoryIcons: Record<ConcernCategory, string> = {
    '학업': '📚',
    '진로': '🎯',
    '인간관계': '👥',
    '생활_재정': '💰',
    '건강_멘탈': '🧘',
    '기타': '💭',
  };

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
      await concernsApi.create({
        ...formData,
        studentId: formData.studentId.trim(),
        name: formData.name?.trim() || undefined,
        title: formData.title?.trim() || undefined,
        content: formData.content.trim(),
      });
      
      setFormData({
        studentId: '',
        name: '',
        category: '학업',
        title: '',
        content: '',
      });
      setErrors({});
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : '제출 중 오류가 발생했습니다' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ConcernRequest, value: string | ConcernCategory) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient-light pb-24 relative" role="main">
      <div className="absolute inset-0 bg-white/40"></div>
      
      <div className="relative max-w-lg mx-auto px-4 pt-4">
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl shadow-sm animate-bounce-gentle">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✅</span>
              <span className="font-medium">고민이 성공적으로 등록되었습니다!</span>
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-warm-lg border border-white/50 overflow-hidden">
          <div className="bg-warm-gradient-soft p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="text-primary-600">
                <MirrorIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                고민거울
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              마음속 고민을 편안하게 나누어보세요
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                  학번 *
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className={`
                    w-full px-4 py-3 bg-white border-2 rounded-2xl text-gray-800
                    placeholder-gray-400 transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400
                    hover:shadow-md
                    ${errors.studentId ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                  `}
                  placeholder="8-10자리 숫자를 입력해주세요"
                  aria-describedby={errors.studentId ? 'studentId-error' : undefined}
                  aria-invalid={!!errors.studentId}
                />
                {errors.studentId && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-red-500">⚠️</span>
                    <p id="studentId-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.studentId}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 (선택)
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800
                    placeholder-gray-400 transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400
                    hover:shadow-md"
                  placeholder="이름을 입력해주세요"
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  카테고리
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as ConcernCategory)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800
                      transition-all duration-300 appearance-none cursor-pointer
                      focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400
                      hover:shadow-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryIcons[category]} {category.replace('_', '/')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  제목 (선택)
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800
                    placeholder-gray-400 transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400
                    hover:shadow-md"
                  placeholder="제목을 입력해주세요"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  고민 내용 *
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={`
                    w-full px-4 py-3 bg-white border-2 rounded-2xl text-gray-800
                    placeholder-gray-400 transition-all duration-300 resize-none
                    focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400
                    hover:shadow-md min-h-[120px]
                    ${errors.content ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                  `}
                  placeholder="마음속 고민을 편안하게 적어주세요...&#10;혼자 고민하지 마시고 함께 나누어요 💝"
                  maxLength={2000}
                  aria-describedby={errors.content ? 'content-error' : undefined}
                  aria-invalid={!!errors.content}
                />
                {errors.content && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-red-500">⚠️</span>
                    <p id="content-error" className="text-sm text-red-600 font-medium" role="alert">
                      {errors.content}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {formData.content.length}/2000자
                  </p>
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, Math.ceil(formData.content.length / 400)))].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-2 rounded-full bg-primary-300"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl" role="alert">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">❌</span>
                  <span className="font-medium">{errors.submit}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`
          fixed bottom-6 right-6 w-16 h-16 bg-warm-gradient rounded-full
          shadow-warm-lg hover:shadow-2xl active:shadow-md
          flex items-center justify-center text-white
          transition-all duration-300 transform
          hover:scale-110 active:scale-95 active:animate-bounce-gentle
          focus:outline-none focus:ring-4 focus:ring-primary-300
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          z-50
        `}
        aria-label={isSubmitting ? '등록 중...' : '고민 등록하기'}
      >
        {isSubmitting ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <SendIcon />
        )}
      </button>
    </div>
  );
};

export default ConcernForm;