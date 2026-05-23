import { motion } from 'framer-motion';
import { useTaskStore } from '../../store/taskStore';
import { RefreshCw, Quote } from 'lucide-react';

export default function ProductivityBar() {
  const { getStats, getCurrentQuote, getRandomQuote } = useTaskStore();
  const s = getStats();
  const q = getCurrentQuote();
  const emos = ['💤','🌱','📈','⚡','🔥'];
  const emo = emos[Math.min(Math.floor(s.productivity / 20), 4)];

  const prodColor = s.productivity >= 75 ? '#10b981' : s.productivity >= 40 ? '#f0c040' : '#7c6af7';

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
      style={{
        background:'linear-gradient(145deg, #0e0f14 0%, #0c0d11 100%)',
        border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, marginBottom:10, overflow:'hidden',
      }}>
      {/* Productivity section */}
      <div style={{ padding:'16px 18px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>
            Productivity
          </span>
          <span style={{ fontSize:11, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>{emo}</span>
        </div>

        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:12 }}>
          <span style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:38, color:'#e8eaed', lineHeight:1 }}>
            {s.productivity}
          </span>
          <span style={{ fontSize:16, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>%</span>
        </div>

        {/* Progress bar */}
        <div style={{ height:5, borderRadius:20, background:'rgba(255,255,255,0.05)', overflow:'hidden', marginBottom:12, position:'relative' }}>
          <motion.div initial={{ width:0 }} animate={{ width:`${s.productivity}%` }} transition={{ duration:1.2, delay:.4, ease:[0.34,1.56,0.64,1] }}
            style={{ height:'100%', borderRadius:20, background:`linear-gradient(90deg, ${prodColor}88, ${prodColor})` }} />
        </div>

        <div style={{ display:'flex', gap:16 }}>
          {[
            { label:'Done', val:s.completed, c:'#10b981' },
            { label:'Active', val:s.pending, c:'#7c6af7' },
            { label:'Overdue', val:s.overdue, c:'#f87171' }
          ].map(item => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:item.c, boxShadow:`0 0 6px ${item.c}66` }} />
              <span style={{ fontSize:11, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>
                <span style={{ color:'#e8eaed', fontWeight:500 }}>{item.val}</span> {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:'1px', background:'rgba(255,255,255,0.05)', margin:'0 18px' }} />

      {/* Quote card — prominent */}
      {q && (
        <div className="quote-card" style={{ padding:'18px 18px 14px', position:'relative' }}>
          {/* Large decorative quote mark */}
          <div style={{
            position:'absolute', top:10, left:14,
            fontFamily:'Instrument Serif, serif', fontSize:72, lineHeight:1,
            color:'rgba(124,106,247,0.12)', pointerEvents:'none', userSelect:'none',
          }}>"</div>

          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <div style={{
                width:20, height:20, borderRadius:6,
                background:'rgba(124,106,247,0.15)',
                border:'1px solid rgba(124,106,247,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Quote size={10} color="#a78bfa" />
              </div>
              <span style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>
                Daily Inspiration
              </span>
            </div>

            <p style={{
              fontFamily:'Instrument Serif, serif',
              fontStyle:'italic', fontSize:16, color:'#c4c8d4',
              lineHeight:1.7, marginBottom:10, paddingLeft:4,
            }}>
              "{q.text}"
            </p>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:18, height:1.5, background:'rgba(124,106,247,0.5)', borderRadius:1 }} />
                <p style={{ fontSize:11, color:'#6b7280', fontFamily:'Geist, sans-serif', fontWeight:500 }}>
                  {q.author}
                </p>
              </div>
              <motion.button onClick={getRandomQuote} whileTap={{ scale:0.9, rotate:180 }}
                style={{
                  width:28, height:28, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(255,255,255,0.04)', color:'#6b7280', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.borderColor='rgba(124,106,247,0.3)'; e.currentTarget.style.background='rgba(124,106,247,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}>
                <RefreshCw size={12} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
