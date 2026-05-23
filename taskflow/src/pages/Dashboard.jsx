import { motion } from 'framer-motion';
import { useTaskStore } from '../store/taskStore';
import StatsCards from '../components/dashboard/StatsCards';
import ProductivityBar from '../components/dashboard/ProductivityBar';
import TaskList from '../components/tasks/TaskList';
import PomodoroWidget from '../components/dashboard/PomodoroWidget';
import Analytics from '../components/dashboard/Analytics';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';

export default function Dashboard({ showAdd, onCloseAdd }) {
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const greetEmoji = h < 12 ? '☀️' : h < 17 ? '🌤️' : '🌙';
  const { user } = useAuthStore();
  const name = user?.name?.split(' ')[0] || 'there';

  return (
    <div style={{ maxWidth:1320, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <h1 style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:26, color:'#e8eaed', letterSpacing:'-.01em' }}>{greet}, {name}</h1>
          <span style={{ fontSize:20 }}>{greetEmoji}</span>
        </div>
        <p style={{ fontSize:12, color:'#3a3d44', marginTop:4, fontFamily:'Geist, sans-serif' }}>
          {format(now, 'EEEE, MMMM do yyyy')} &nbsp;·&nbsp; Let's make today count
        </p>
      </motion.div>

      <StatsCards />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 258px', gap:16 }}>
        <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'18px' }}>
          <TaskList externalShowAdd={showAdd} onExternalClose={(action) => {
            // Action object comes from TaskList
            if (action && action.type === 'open') return;
            if (action && action.type === 'close') onCloseAdd?.();
            // Backwards compatibility: if a boolean is ever passed
            if (typeof action === 'boolean' && !action) onCloseAdd?.();
          }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          <ProductivityBar />
          <PomodoroWidget />
          <Analytics />
        </div>
      </div>
    </div>
  );
}
