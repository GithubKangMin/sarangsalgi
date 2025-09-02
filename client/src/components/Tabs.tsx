import React, { useRef, useEffect } from 'react';
import { TabType } from '../types';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const HeartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'concerns' as TabType, label: '고민거울', icon: '🪞' },
    { id: 'topics' as TabType, label: '고민해우', icon: '💬' },
    { id: 'admin' as TabType, label: '관리자', icon: '⚙️' },
  ];

  useEffect(() => {
    if (indicatorRef.current && tabsContainerRef.current) {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      const tabElements = tabsContainerRef.current.children;
      const activeTabElement = tabElements[activeIndex] as HTMLButtonElement;
      
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        indicatorRef.current.style.left = `${offsetLeft}px`;
        indicatorRef.current.style.width = `${offsetWidth}px`;
      }
    }
  }, [activeTab, tabs]);

  return (
    <header className="bg-warm-gradient-light relative overflow-hidden">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="relative px-4 py-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="text-rose-500 animate-float">
              <HeartIcon />
            </div>
            <h1 className="text-3xl font-bold bg-warm-gradient bg-clip-text text-transparent">
              사랑살기
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            따뜻한 마음으로 함께하는 고민 나눔 공간
          </p>
        </div>
        
        <nav 
          ref={tabsContainerRef}
          className="relative flex justify-center gap-2 px-4"
          role="tablist"
          aria-label="메인 네비게이션"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`
                flex items-center space-x-2 py-3 px-4 rounded-full font-medium text-sm
                transition-all duration-500 transform relative z-10
                focus:outline-none focus:ring-4 focus:ring-primary-200
                ${activeTab === tab.id 
                  ? 'text-white scale-105' 
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 active:scale-95'
                }
              `}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          
          {/* 움직이는 인디케이터 바 */}
          <div
            ref={indicatorRef}
            className="absolute top-0 h-full bg-warm-gradient rounded-full shadow-warm 
                      transition-all duration-700 ease-in-out transform z-0"
            style={{ left: 0, width: 0 }}
            aria-hidden="true"
          />
        </nav>
      </div>
    </header>
  );
};

export default Tabs;