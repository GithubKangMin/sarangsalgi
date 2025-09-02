import React, { useState } from 'react';
import { adminApi } from '../api/admin';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await adminApi.login({ password });
      onLoginSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto" role="main">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          관리자 로그인
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className={`input-field w-full ${error ? 'border-red-500' : ''}`}
              placeholder="관리자 비밀번호 입력"
              aria-describedby={error ? 'password-error' : undefined}
              aria-invalid={!!error}
              autoComplete="current-password"
            />
            {error && (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;