import { motion } from 'framer-motion';
import { useTaskStore } from '../../store/taskStore';

export default function Analytics() {
  const { tasks, categories } = useTaskStore();

  const data = categories.map(cat => {
    const ct = tasks.filter(t => t.categoryId === cat.id);
    const done = ct.filter(t => t.completed).length;
    return { ...cat, total: ct.length, done, pct: ct.length ? Math.round(done / ct.length * 100) : 0 };
  }).filter(c => c.total > 0);

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
      style={{
        background:'linear-gradient(145deg, #0e0f14 0%, #0c0d11 100%)',
        border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 18px',
      }}>
      <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:14, fontFamily:'Geist, sans-serif' }}>
        📈 Category Progress
      </div>
      {data.length === 0 ? (
        <div style={{ fontSize:12, color:'#3a3d44', fontFamily:'Geist, sans-serif', padding:'8px 0' }}>
          Add tasks to see progress
        </div>
      ) : (
        data.map((cat, i) => (
          <div key={cat.id} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
              <span style={{ fontSize:12, color:'#6b7280', fontFamily:'Geist, sans-serif', display:'flex', alignItems:'center', gap:6 }}>
                <span>{cat.icon}</span> {cat.name}
              </span>
              <span style={{ fontSize:12, fontWeight:600, color:'#e8eaed', fontFamily:'Geist, sans-serif' }}>{cat.pct}%</span>
            </div>
            <div style={{ height:4, borderRadius:20, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
              <motion.div
                initial={{ width:0 }} animate={{ width:`${cat.pct}%` }}
                transition={{ duration:.9, delay:.15 + i * .07, ease:[0.34,1.56,0.64,1] }}
                style={{ height:'100%', borderRadius:20, background:cat.color, boxShadow:`0 0 8px ${cat.color}66` }} />
            </div>
            <div style={{ fontSize:9, color:'#2a2d35', marginTop:3, fontFamily:'Geist, sans-serif' }}>{cat.done}/{cat.total} completed</div>
          </div>
        ))
      )}
    </motion.div>
  );
}
