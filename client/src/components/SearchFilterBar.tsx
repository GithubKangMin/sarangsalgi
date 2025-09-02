import React from 'react';
import { ConcernCategory } from '../types';

interface SearchFilterBarProps {
  searchQuery: string;
  selectedCategory: ConcernCategory | '';
  sortOrder: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: ConcernCategory | '') => void;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  selectedCategory,
  sortOrder,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  totalCount,
}) => {
  const categories: { value: ConcernCategory | ''; label: string }[] = [
    { value: '', label: '전체 카테고리' },
    { value: '학업', label: '학업' },
    { value: '진로', label: '진로' },
    { value: '인간관계', label: '인간관계' },
    { value: '생활_재정', label: '생활/재정' },
    { value: '건강_멘탈', label: '건강/멘탈' },
    { value: '기타', label: '기타' },
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
  ];

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <label htmlFor="search" className="sr-only">
            고민 검색
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field w-full"
            placeholder="제목, 내용, 이름, 학번으로 검색..."
            aria-label="고민 검색"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div>
            <label htmlFor="category" className="sr-only">
              카테고리 필터
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as ConcernCategory | '')}
              className="input-field w-full sm:w-auto"
              aria-label="카테고리 필터"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="sr-only">
              정렬 순서
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-field w-full sm:w-auto"
              aria-label="정렬 순서"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        총 {totalCount}개의 고민
      </div>
    </div>
  );
};

export default SearchFilterBar;