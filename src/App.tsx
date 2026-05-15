/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ClipboardList, Wallet, Users, BarChart3 } from 'lucide-react';
import { useAppData } from './hooks/useAppData';
import { cn } from './types';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Fees from './components/Fees';
import Students from './components/Students';
import Reports from './components/Reports';

type View = 'dashboard' | 'attendance' | 'fees' | 'students' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const appData = useAppData();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'ڈیش بورڈ' },
    { id: 'attendance', icon: ClipboardList, label: 'حاضری' },
    { id: 'fees', icon: Wallet, label: 'فیس' },
    { id: 'students', icon: Users, label: 'طلباء' },
    { id: 'reports', icon: BarChart3, label: 'رپورٹ' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={appData} />;
      case 'attendance': return <Attendance data={appData} />;
      case 'fees': return <Fees data={appData} />;
      case 'students': return <Students data={appData} />;
      case 'reports': return <Reports data={appData} />;
    }
  };

  const today = new Date().toLocaleDateString('ur-PK', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 sticky top-0 z-40 flex flex-col items-center shadow-lg safe-top">
        <h1 className="text-xl font-bold urdu text-center w-full drop-shadow-sm">
          جامعہ عبداللہ بن عباس فیصل آباد
        </h1>
        <div className="flex justify-between w-full mt-2 items-center px-2">
          <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">تعلیمی مینجر</span>
          <div className="text-[10px] opacity-90 font-medium">{today}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around p-2 nav-shadow z-50 safe-bottom">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center p-2 transition-all duration-300 relative rounded-xl",
              currentView === item.id ? "text-indigo-600 scale-110" : "text-slate-400"
            )}
          >
            {currentView === item.id && (
              <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-indigo-50 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon size={22} className={cn("mb-1", currentView === item.id ? "stroke-[2.5px]" : "stroke-[2px]")} />
            <span className="text-[10px] font-bold urdu">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
