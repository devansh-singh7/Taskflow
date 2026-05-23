import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

const Card = ({ icon: Icon, label, value, sub, iconColor, gradientFrom, gradientTo, delay }) => (
  <motion.div
    initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:.4, ease:[0.22,1,0.36,1] }}
    whileHover={{ y:-3, transition:{ duration:.18 } }}
    style={{
      background:`linear-gradient(145deg, ${gradientFrom} 0%, #0c0d11 100%)`,
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:14, padding:'16px 18px',
      position:'relative', overflow:'hidden', cursor:'default',
      boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
    }}>
    {/* Subtle glow circle */}
    <div style={{
      position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%',
      background:`radial-gradient(circle, ${iconColor}22 0%, transparent 70%)`,
      pointerEvents:'none',
    }} />
    <div style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:10, fontFamily:'Geist, sans-serif' }}>
      {label}
    </div>
    <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:34, color:'#e8eaed', lineHeight:1, marginBottom:6 }}>
      {value}
    </div>
    <div style={{ fontSize:11, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>{sub}</div>
    <div style={{
      position:'absolute', top:14, right:14, width:32, height:32, borderRadius:9,
      background:`rgba(255,255,255,0.05)`,
      border:`1px solid ${iconColor}33`,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <Icon size={15} style={{ color: iconColor }} />
    </div>
  </motion.div>
);

export default function StatsCards() {
  const { getStats } = useTaskStore();
  const s = getStats();
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
      <Card icon={TrendingUp}    label="Total Tasks" value={s.total}      sub="all time"              iconColor="#7c6af7" gradientFrom="#100e1a" delay={0}    />
      <Card icon={CheckCircle}   label="Completed"   value={s.completed}  sub={`${s.productivity}% rate`} iconColor="#10b981" gradientFrom="#0a1512" delay={0.06} />
      <Card icon={Clock}         label="Pending"     value={s.pending}    sub="in progress"           iconColor="#3b82f6" gradientFrom="#0a0e18" delay={0.12} />
      <Card icon={AlertTriangle} label="Overdue"     value={s.overdue}    sub="needs attention"       iconColor="#f87171" gradientFrom="#180a0a" delay={0.18} />
    </div>
  );
}
