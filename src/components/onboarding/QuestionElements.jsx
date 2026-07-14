import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const LargeInput = ({ value, onChange, placeholder, type = 'text', icon: Icon }) => (
  <div className="relative group w-full">
    <div className="absolute inset-0 bg-slate-200/50 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
    <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl group-focus-within:border-blue-500 group-focus-within:shadow-xl transition-all duration-300 overflow-hidden">
      {Icon && (
        <div className="pl-5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={24} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-5 text-lg font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
      />
    </div>
  </div>
);

export const SelectionGrid = ({ options, selectedValue, onSelect, columns = 2, themeColor = 'blue' }) => {
  const themeStyles = {
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    purple: 'border-purple-500 bg-purple-50 text-purple-700',
    pink: 'border-pink-500 bg-pink-50 text-pink-700',
    orange: 'border-orange-500 bg-orange-50 text-orange-700',
    green: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  };
  
  const activeStyle = themeStyles[themeColor] || themeStyles.blue;

  return (
    <div className={`grid gap-3 w-full`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value || selectedValue === opt.label || selectedValue === opt;
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const Icon = opt.icon;
        
        return (
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            key={val}
            onClick={() => onSelect(val)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 text-center
              ${isSelected 
                ? `${activeStyle} shadow-md` 
                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow text-slate-600'}
            `}
          >
            {Icon && <Icon size={24} className={`mb-2 ${isSelected ? '' : 'text-slate-400'}`} />}
            <span className="font-semibold text-sm">{label}</span>
            
            {isSelected && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${activeStyle.split(' ')[0].replace('border', 'bg')}`}
              >
                <Check size={14} strokeWidth={3} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
