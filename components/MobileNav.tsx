import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Top Bar */}
      <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">Dadu</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 shadow-xl transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            {/* Reuse Sidebar Logic - simplified for this demo to just mount a version of it or custom links */}
            <div className="h-full overflow-y-auto pb-20">
               <div className="px-6 py-2 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Menu functionality is same as desktop.
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;