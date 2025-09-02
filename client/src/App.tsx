import { useState } from 'react';
import Tabs from './components/Tabs';
import ConcernForm from './components/ConcernForm';
import TopicList from './components/TopicList';
import TopicDetail from './components/TopicDetail';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { TabType, Topic } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('concerns');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  const renderContent = () => {
    if (activeTab === 'concerns') {
      return <ConcernForm />;
    }
    
    if (activeTab === 'topics') {
      if (selectedTopic) {
        return (
          <TopicDetail 
            topic={selectedTopic} 
            onBack={handleBackToTopics}
          />
        );
      }
      return <TopicList onTopicSelect={handleTopicSelect} />;
    }
    
    if (activeTab === 'admin') {
      if (!isAdminLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />;
      }
      return <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-warm-gradient-light">
      <div className="max-w-6xl mx-auto">
        <Tabs 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'topics') {
              setSelectedTopic(null);
            }
          }}
        />
        <main className={activeTab === 'concerns' ? '' : 'p-4'}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;