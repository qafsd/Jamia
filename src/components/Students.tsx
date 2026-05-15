import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Trash2, Hash, Banknote, User } from 'lucide-react';
import type { useAppData } from '../hooks/useAppData';

export default function Students({ data }: { data: ReturnType<typeof useAppData> }) {
  const { students, addStudent, deleteStudent } = data;
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [fee, setFee] = useState('');

  const handleAdd = () => {
    if (!name || !roll) return alert('براہ کرم معلومات مکمل کریں');
    addStudent({
      id: Date.now(),
      name,
      roll,
      fee: Number(fee) || 1000,
      joinedAt: new Date().toISOString()
    });
    setName('');
    setRoll('');
    setFee('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-[2rem] shadow-md border border-slate-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <UserPlus size={20} />
          </div>
          <h3 className="font-bold text-slate-800 urdu">نیا طالب علم</h3>
        </div>
        
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            type="text" 
            placeholder="نام" 
            className="w-full bg-slate-50 p-3 pl-10 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all text-right urdu"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              value={roll}
              onChange={e => setRoll(e.target.value)}
              type="text" 
              placeholder="رول نمبر" 
              className="w-full bg-slate-50 p-3 pl-10 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all text-right"
            />
          </div>
          <div className="relative flex-1">
            <Banknote className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              value={fee}
              onChange={e => setFee(e.target.value)}
              type="number" 
              placeholder="فیس" 
              className="w-full bg-slate-50 p-3 pl-10 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all text-right"
            />
          </div>
        </div>

        <button 
          onClick={handleAdd}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl font-bold urdu transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          شامل کریں
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-slate-500 text-xs font-bold urdu px-2 uppercase tracking-wider">طلباء کی فہرست</h3>
        {students.length === 0 ? (
          <div className="text-center py-10 text-slate-400 urdu">کوئی طالب علم موجود نہیں</div>
        ) : (
          students.map((s, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={s.id} 
              className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50 group hover:border-red-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 urdu">{s.name}</p>
                  <p className="text-xs text-slate-400 font-medium">رول: {s.roll} | فیس: {s.fee}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteStudent(s.id)}
                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
