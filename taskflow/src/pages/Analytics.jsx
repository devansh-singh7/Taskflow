import { motion } from 'framer-motion';
import { useTaskStore } from '../store/taskStore';
import { CheckCircle, Clock, TrendingUp, Zap, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Analytics() {
  const { tasks, categories } = useTaskStore();

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed);
  const pending = tasks.filter(t => !t.completed);
  const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
  const pct = total ? Math.round(completed.length / total * 100) : 0;

  // Speed: avg time to complete (createdAt → completedAt)
  const timed = completed.filter(t => t.completedAt && t.createdAt);
  const avgMs = timed.length ? timed.reduce((acc, t) => acc + (new Date(t.completedAt) - new Date(t.createdAt)), 0) / timed.length : 0;
  const avgHrs = Math.round(avgMs / 1000 / 60 / 60);

  // Per priority
  const prioStats = ['high','medium','low'].map(p => {
    const all = tasks.filter(t => t.priority === p);
    const done = all.filter(t => t.completed).length;
    return { p, total: all.length, done, pct: all.length ? Math.round(done/all.length*100) : 0 };
  });

  // Per category
  const catStats = categories.map(cat => {
    const all = tasks.filter(t => t.categoryId === cat.id);
    const done = all.filter(t => t.completed).length;
    return { ...cat, total: all.length, done, pct: all.length ? Math.round(done/all.length*100) : 0 };
  }).filter(c => c.total > 0);

  // Recent completions
  const recent = [...completed].sort((a,b) => new Date(b.completedAt||0) - new Date(a.completedAt||0)).slice(0, 5);

  const statCard = (icon, label, value, sub, color) => (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-16, right:-16, width:70, height:70, borderRadius:'50%', background:`radial-gradient(circle, ${color}22 0%, transparent 70%)` }} />
      <div style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:10, fontFamily:'Geist, sans-serif' }}>{label}</div>
      <div style={{ fontFamily:'Instrument Serif, serif', fontSize:34, color:'#e8eaed', lineHeight:1, marginBottom:5 }}>{value}</div>
      <div style={{ fontSize:11, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>{sub}</div>
      <div style={{ position:'absolute', top:14, right:14, width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.05)', border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {icon}
      </div>
    </motion.div>
  );

  const PRIO_COLORS = { high:'#f87171', medium:'#fcd34d', low:'#6ee7b7' };

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Instrument Serif, serif', fontSize:26, color:'#e8eaed', fontWeight:400 }}>Analytics</h1>
        <p style={{ fontSize:12, color:'#3a3d44', marginTop:4, fontFamily:'Geist, sans-serif' }}>Completion rate and speed insights</p>
      </motion.div>

      {/* Top stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {statCard(<TrendingUp size={15} style={{ color:'#a78bfa' }} />, 'Completion Rate', `${pct}%`, `${completed.length} of ${total} done`, '#7c6af7')}
        {statCard(<CheckCircle size={15} style={{ color:'#10b981' }} />, 'Completed', completed.length, 'tasks finished', '#10b981')}
        {statCard(<Clock size={15} style={{ color:'#3b82f6' }} />, 'Avg. Speed', avgHrs > 0 ? `${avgHrs}h` : '—', avgHrs > 0 ? 'avg to complete' : 'no data yet', '#3b82f6')}
        {statCard(<Zap size={15} style={{ color:'#f87171' }} />, 'Overdue', overdue.length, 'need attention', '#ef4444')}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Category breakdown */}
        <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px' }}>
          <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:16, fontFamily:'Geist, sans-serif' }}>By Category</div>
          {catStats.length === 0 ? <div style={{ fontSize:12, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>No tasks yet</div> : catStats.map((cat, i) => (
            <div key={cat.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:13, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>{cat.icon} {cat.name}</span>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#e8eaed', fontFamily:'Geist, sans-serif' }}>{cat.pct}%</span>
                  <span style={{ fontSize:10, color:'#3a3d44', fontFamily:'Geist, sans-serif', marginLeft:6 }}>{cat.done}/{cat.total}</span>
                </div>
              </div>
              <div style={{ height:5, borderRadius:20, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${cat.pct}%` }} transition={{ duration:.9, delay:i*.08, ease:[0.34,1.56,0.64,1] }}
                  style={{ height:'100%', borderRadius:20, background:cat.color, boxShadow:`0 0 8px ${cat.color}66` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Priority breakdown */}
        <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px' }}>
          <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:16, fontFamily:'Geist, sans-serif' }}>By Priority</div>
          {prioStats.map((ps, i) => (
            <div key={ps.p} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:PRIO_COLORS[ps.p], boxShadow:`0 0 7px ${PRIO_COLORS[ps.p]}88` }} />
                  <span style={{ fontSize:13, color:'#6b7280', fontFamily:'Geist, sans-serif', textTransform:'capitalize' }}>{ps.p}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#e8eaed', fontFamily:'Geist, sans-serif' }}>{ps.pct}% <span style={{ fontSize:10, color:'#3a3d44', fontWeight:400 }}>({ps.done}/{ps.total})</span></span>
              </div>
              <div style={{ height:8, borderRadius:20, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${ps.pct}%` }} transition={{ duration:.9, delay:i*.1, ease:[0.34,1.56,0.64,1] }}
                  style={{ height:'100%', borderRadius:20, background:PRIO_COLORS[ps.p], boxShadow:`0 0 8px ${PRIO_COLORS[ps.p]}66` }} />
              </div>
              <div style={{ marginTop:4, fontSize:9, color:'#2a2d35', fontFamily:'Geist, sans-serif' }}>{ps.total} tasks total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent completions */}
      <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px' }}>
        <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:16, fontFamily:'Geist, sans-serif' }}>Recent Completions</div>
        {recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'30px 0', fontSize:13, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>Complete tasks to see them here</div>
        ) : recent.map((t, i) => {
          const cat = categories.find(c => c.id === t.categoryId) || categories[0];
          return (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i < recent.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <CheckCircle size={14} style={{ color:'#10b981', flexShrink:0 }} />
              <span style={{ fontSize:13, color:'#6b7280', fontFamily:'Geist, sans-serif', flex:1 }}>{t.emoji} {t.title}</span>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:5, background:`${cat.color}18`, color:cat.color, fontFamily:'Geist, sans-serif' }}>{cat.name}</span>
              {t.completedAt && <span style={{ fontSize:10, color:'#2a2d35', fontFamily:'Geist, sans-serif', flexShrink:0 }}>{formatDistanceToNow(new Date(t.completedAt), { addSuffix:true })}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
