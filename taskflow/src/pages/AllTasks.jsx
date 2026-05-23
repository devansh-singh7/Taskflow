import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, CheckCircle, Circle, Calendar, Search } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import AddTaskModal from '../components/tasks/AddTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import toast from 'react-hot-toast';
import { formatDueDate, isOverdue, isDueSoon } from '../utils/helpers';

export default function AllTasks() {
  const { tasks, toggleTask, deleteTask, categories } = useTaskStore();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [prioF, setPrioF] = useState('all');
  const [catF, setCatF] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const PRIO_COLORS = { high:'#f87171', medium:'#fcd34d', low:'#6ee7b7' };

  const filtered = tasks
    .filter(t => {
      if (statusF === 'completed' && !t.completed) return false;
      if (statusF === 'pending' && t.completed) return false;
      if (prioF !== 'all' && t.priority !== prioF) return false;
      if (catF !== 'all' && t.categoryId !== catF) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

  const pill = (active) => ({
    padding:'5px 12px', borderRadius:8, fontSize:11, fontWeight:500, cursor:'pointer',
    border: active ? '1px solid rgba(124,106,247,0.45)' : '1px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.03)',
    color: active ? '#a78bfa' : '#6b7280', fontFamily:'Geist, sans-serif', textTransform:'capitalize', transition:'all .15s',
  });

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:'Instrument Serif, serif', fontSize:26, color:'#e8eaed', fontWeight:400 }}>All Tasks</h1>
            <p style={{ fontSize:12, color:'#3a3d44', marginTop:4, fontFamily:'Geist, sans-serif' }}>
              {tasks.length} total · {tasks.filter(t => t.completed).length} completed · {tasks.filter(t => !t.completed).length} pending
            </p>
          </div>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }} onClick={() => setShowAdd(true)}
            style={{ padding:'0 18px', height:36, borderRadius:10, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontSize:13, fontWeight:600, fontFamily:'Geist, sans-serif', cursor:'pointer', display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 14px rgba(124,106,247,0.4)' }}>
            <Plus size={14} /> Add Task
          </motion.button>
        </div>
      </motion.div>

      {/* Search + filters */}
      <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
        <div style={{ position:'relative', marginBottom:12 }}>
          <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#3a3d44' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
            style={{ width:'100%', padding:'9px 12px 9px 34px', borderRadius:9, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', color:'#e8eaed', fontSize:13, fontFamily:'Geist, sans-serif', outline:'none' }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
          {['all','pending','completed'].map(s => <button key={s} onClick={() => setStatusF(s)} style={pill(statusF===s)}>{s}</button>)}
          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />
          {['all','high','medium','low'].map(p => <button key={p} onClick={() => setPrioF(p)} style={pill(prioF===p)}>{p}</button>)}
          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />
          <button onClick={() => setCatF('all')} style={pill(catF==='all')}>all cats</button>
          {categories.map(c => <button key={c.id} onClick={() => setCatF(c.id)} style={pill(catF===c.id)}>{c.icon} {c.name}</button>)}
        </div>
      </div>

      {/* Task list */}
      <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✦</div>
            <div style={{ fontFamily:'Instrument Serif, serif', fontSize:18, color:'#3a3d44', marginBottom:8 }}>No tasks found</div>
            <button onClick={() => setShowAdd(true)} style={{ padding:'8px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Geist, sans-serif' }}>Create Task</button>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((task, i) => {
              const cat = categories.find(c => c.id === task.categoryId) || categories[0];
              const overdue = isOverdue(task.dueDate) && !task.completed;
              return (
                <motion.div key={task.id} layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, height:0 }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition:'background .15s' }}
                  onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  {/* Priority bar */}
                  <div style={{ width:3, height:36, borderRadius:2, background:PRIO_COLORS[task.priority], opacity:task.completed?.3:.8, flexShrink:0 }} />
                  {/* Checkbox */}
                  <button onClick={() => { toggleTask(task.id); if (!task.completed) toast.success('Task done! 🎉'); }}
                    style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0, padding:2 }}>
                    {task.completed ? <CheckCircle size={18} style={{ color:'#10b981' }} /> : <Circle size={18} style={{ color:'#3a3d44' }} />}
                  </button>
                  {/* Emoji */}
                  <span style={{ fontSize:16, opacity:task.completed?.4:1, flexShrink:0 }}>{task.emoji}</span>
                  {/* Content */}
                  <div style={{ flex:1, minWidth:0, opacity:task.completed?.5:1 }}>
                    <div style={{ fontSize:13, color: task.completed ? '#3a3d44' : '#c8cad2', textDecoration:task.completed?'line-through':'none', fontFamily:'Geist, sans-serif', marginBottom:3 }}>{task.title}</div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
                      <span style={{ fontSize:9, fontWeight:600, padding:'2px 7px', borderRadius:5, background:`${cat.color}18`, color:cat.color, border:`1px solid ${cat.color}28`, fontFamily:'Geist, sans-serif' }}>{cat.icon} {cat.name}</span>
                      <span style={{ fontSize:9, fontWeight:600, padding:'2px 7px', borderRadius:5, background:`${PRIO_COLORS[task.priority]}18`, color:PRIO_COLORS[task.priority], fontFamily:'Geist, sans-serif', textTransform:'capitalize' }}>{task.priority}</span>
                      {task.dueDate && <span style={{ fontSize:9, padding:'2px 7px', borderRadius:5, background: overdue?'rgba(239,68,68,.1)':'rgba(255,255,255,0.04)', color:overdue?'#f87171':'#6b7280', fontFamily:'Geist, sans-serif', display:'flex', alignItems:'center', gap:3 }}><Calendar size={8} />{formatDueDate(task.dueDate)}</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button onClick={() => setEditTask(task)} style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#3a3d44', transition:'all .15s' }}
                      onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#e8eaed'; }}
                      onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#3a3d44'; }}>
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => { deleteTask(task.id); toast.success('Deleted'); }} style={{ width:30, height:30, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#3a3d44', transition:'all .15s' }}
                      onMouseOver={e => { e.currentTarget.style.background='rgba(239,68,68,.1)'; e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(239,68,68,.3)'; }}
                      onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#3a3d44'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <AddTaskModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <EditTaskModal isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
    </div>
  );
}
