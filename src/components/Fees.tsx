import { motion } from 'motion/react';
import { BadgeCheck, BadgeAlert, Coins } from 'lucide-react';
import type { useAppData } from '../hooks/useAppData';

export default function Fees({ data }: { data: ReturnType<typeof useAppData> }) {
  const { students, fees, toggleFee } = data;
  const monthKey = new Date().toLocaleString('ur-PK', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-lg font-bold text-slate-800 urdu">فیس ریکارڈ: {monthKey}</h2>
        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
          <Coins size={18} />
        </div>
      </div>

      <div className="space-y-3">
        {students.length === 0 ? (
          <p className="text-center text-slate-400 mt-10 urdu">کوئی ریکارڈ نہیں</p>
        ) : (
          students.map((s, idx) => {
            const isPaid = fees[s.id]?.[monthKey] === 'Paid';

            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={s.id} 
                className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-bold text-slate-800 urdu">{s.name}</p>
                    <p className="text-xs text-slate-400 font-bold">FEES: Rs {s.fee}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleFee(s.id, monthKey)}
                  className={`
                    px-4 py-2.5 rounded-2xl text-[10px] font-bold urdu transition-all flex items-center gap-2
                    ${isPaid 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-red-50 text-red-600 border border-red-100 animate-pulse'}
                  `}
                >
                  {isPaid ? <BadgeCheck size={14} /> : <BadgeAlert size={14} />}
                  {isPaid ? 'ادا شدہ' : 'بقایا (ادا کریں)'}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
