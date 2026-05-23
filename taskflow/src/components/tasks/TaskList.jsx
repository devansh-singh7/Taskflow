import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import toast from 'react-hot-toast';

const FILTERS = { status: ['all','pending','completed'], priority: ['all','high','medium','low'] };

export default function TaskList({ externalShowAdd, onExternalClose }) {
  const { getFilteredTasks, reorderTasks, tasks, filter, setFilter, categories, getSmartSuggestions, addTask } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showFilt, setShowFilt] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const [suggestions] = useState(() => getSmartSuggestions());

  // When used inside Dashboard, externalShowAdd is controlled by MainLayout.
  // Still allow this component's own "Add Task" button to work.
  const isAddOpen = externalShowAdd !== undefined ? externalShowAdd : showAdd;
  const closeAdd = externalShowAdd !== undefined
    ? () => onExternalClose?.({ type: 'close' })
    : () => setShowAdd(false);

  const openAdd = () => {
    // In Dashboard mode, toggle is controlled by parent via externalShowAdd.
    // We always set local state too, so the modal opens immediately.
    setShowAdd(true);

    if (externalShowAdd !== undefined) {
      onExternalClose?.({ type: 'open' });
      return;
    }
  };


  const rawFiltered = getFilteredTasks();
  // Sort: pending first, completed pushed to bottom
  const filtered = [...rawFiltered].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oi = tasks.findIndex(t => t.id === active.id);
    const ni = tasks.findIndex(t => t.id === over.id);
    reorderTasks(arrayMove(tasks, oi, ni));
  };

  const fb = (active) => ({
    padding:'4px 11px', borderRadius:7, fontSize:11, fontWeight:500, cursor:'pointer',
    fontFamily:'Geist, sans-serif', transition:'all .15s', textTransform:'capitalize',
    border: active ? '1px solid rgba(124,106,247,0.45)' : '1px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.03)',
    color: active ? '#a78bfa' : '#6b7280',
  });

  const hb = { height:30, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', cursor:'pointer', display:'flex', alignItems:'center', gap:5, padding:'0 11px', fontSize:12, fontWeight:500, color:'#6b7280', transition:'all .15s', fontFamily:'Geist, sans-serif' };

  const pendingCount = filtered.filter(t => !t.completed).length;
  const doneCount = filtered.filter(t => t.completed).length;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:18, color:'#e8eaed' }}>My Tasks</div>
          <div style={{ fontSize:11, color:'#3a3d44', marginTop:2, fontFamily:'Geist, sans-serif' }}>
            {pendingCount} pending · {doneCount} completed
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <button style={{ ...hb, ...(showSugg?{color:'#a78bfa',borderColor:'rgba(124,106,247,0.3)',background:'rgba(124,106,247,0.1)'}:{}) }} onClick={() => setShowSugg(!showSugg)}>
            <Sparkles size={12} /> AI
          </button>
          <button style={{ ...hb, ...(showFilt?{color:'#e8eaed',borderColor:'rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.06)'}:{}) }} onClick={() => setShowFilt(!showFilt)}>
            <SlidersHorizontal size={12} /> Filter
          </button>


        </div>
      </div>

      <AnimatePresence>
        {showSugg && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:12 }}>
            <div style={{ background:'rgba(124,106,247,0.06)', border:'1px solid rgba(124,106,247,0.2)', borderRadius:12, padding:'12px 14px' }}>
              <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#7c6af7', marginBottom:9, fontFamily:'Geist, sans-serif', display:'flex', alignItems:'center', gap:5 }}><Sparkles size={10} /> Smart Suggestions</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {suggestions.map((s, i) => (
                  <motion.button key={i} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*.06 }}
                    onClick={() => { addTask({ title:s, priority:'medium', categoryId:'work', description:'' }); toast.success('Smart task added!'); }}
                    style={{ background:'rgba(124,106,247,0.1)', border:'1px solid rgba(124,106,247,0.25)', borderRadius:20, padding:'5px 12px', fontSize:11, fontWeight:500, color:'#a78bfa', cursor:'pointer', fontFamily:'Geist, sans-serif', transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.background='rgba(124,106,247,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background='rgba(124,106,247,0.1)'; }}>
                    + {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilt && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:12 }}>
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'13px 14px', display:'flex', flexDirection:'column', gap:10 }}>
              {[{ label:'Status', key:'status', opts:FILTERS.status, cur:filter.status },{ label:'Priority', key:'priority', opts:FILTERS.priority, cur:filter.priority }].map(row => (
                <div key={row.key} style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:10, fontWeight:600, color:'#3a3d44', width:52, flexShrink:0, fontFamily:'Geist, sans-serif', textTransform:'uppercase', letterSpacing:'.08em' }}>{row.label}</span>
                  {row.opts.map(o => <button key={o} onClick={() => setFilter(row.key, o)} style={fb(row.cur===o)}>{o}</button>)}
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:10, fontWeight:600, color:'#3a3d44', width:52, flexShrink:0, fontFamily:'Geist, sans-serif', textTransform:'uppercase', letterSpacing:'.08em' }}>Category</span>
                <button onClick={() => setFilter('category','all')} style={fb(filter.category==='all')}>all</button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFilter('category', c.id)}
                    style={fb(filter.category===c.id)}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
        {FILTERS.status.map(s => <button key={s} onClick={() => setFilter('status', s)} style={fb(filter.status===s)}>{s}</button>)}
        <div style={{ width:'1px', background:'rgba(255,255,255,0.08)', margin:'0 2px', alignSelf:'stretch' }} />
        {['high','medium','low'].map(p => <button key={p} onClick={() => setFilter('priority', p)} style={fb(filter.priority===p)}>{p}</button>)}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <>
                  {/* Pending tasks */}
                  {filtered.filter(t => !t.completed).map(task => <TaskCard key={task.id} task={task} />)}
                  {/* Completed separator */}
                  {filtered.some(t => t.completed) && filtered.some(t => !t.completed) && (
                    <div style={{ display:'flex', alignItems:'center', gap:10, margin:'10px 0 6px' }}>
                      <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }} />
                      <span style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em', color:'#2a2d35', fontFamily:'Geist, sans-serif' }}>Completed</span>
                      <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)' }} />
                    </div>
                  )}
                  {/* Completed tasks */}
                  {filtered.filter(t => t.completed).map(task => <TaskCard key={task.id} task={task} />)}
                </>
              ) : (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ textAlign:'center', padding:'52px 20px', borderRadius:14, border:'1px dashed rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>{filter.search ? '🔍' : filter.status==='completed' ? '🎉' : '✦'}</div>
                  <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:17, color:'#3a3d44', marginBottom:7 }}>
                    {filter.search ? 'No tasks found' : filter.status==='completed' ? 'Nothing completed yet' : 'No tasks here'}
                  </div>
                  <p style={{ fontSize:12, color:'#2a2d35', marginBottom:16, fontFamily:'Geist, sans-serif' }}>
                    {filter.search ? 'Try a different search term' : 'Create your first task to get started'}
                  </p>
                  {!filter.search && (
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }} onClick={() => setShowAdd(true)}
                      style={{ padding:'9px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Geist, sans-serif', display:'inline-flex', alignItems:'center', gap:6, boxShadow:'0 4px 14px rgba(124,106,247,0.4)' }}>
                      <Plus size={13} /> Create Task
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      <AddTaskModal isOpen={isAddOpen} onClose={closeAdd} />
    </div>
  );
}
