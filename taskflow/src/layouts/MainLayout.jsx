import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header  from '../components/layout/Header';
import Dashboard  from '../pages/Dashboard';
import AllTasks   from '../pages/AllTasks';
import Analytics  from '../pages/Analytics';
import Pomodoro   from '../pages/Pomodoro';

export default function MainLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showAdd, setShowAdd]       = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':  return <Dashboard showAdd={showAdd} onCloseAdd={() => setShowAdd(false)} />;
      case 'tasks':      return <AllTasks />;
      case 'analytics':  return <Analytics />;
      case 'pomodoro':   return <Pomodoro />;
      default:           return <Dashboard showAdd={showAdd} onCloseAdd={() => setShowAdd(false)} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--c-bg)' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          onAddTask={() => setShowAdd(true)}
        />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background:'var(--c-bg)', padding:'22px 24px' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
