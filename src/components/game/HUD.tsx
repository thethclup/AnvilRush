import { motion } from 'motion/react';
import { Zap, Shield, Crown } from 'lucide-react';

interface HUDProps {
  score: number;
  multiplier: number;
  highestScore: number;
}

export function HUD({ score, multiplier, highestScore }: HUDProps) {
  return (
    <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-40">
       <div className="flex gap-4">
         {/* Score / Distance */}
         <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
            <div>
               <p className="text-[10px] text-white/40 uppercase tracking-widest leading-tight">Distance</p>
               <p className="font-display text-2xl font-bold font-mono text-orange-500 leading-none">{score.toLocaleString()}<span className="text-sm text-white/40 ml-1">m</span></p>
            </div>
         </div>
         {/* Multiplier / Combo */}
         {multiplier > 1 && (
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               key={multiplier} // Re-animate on change
               className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2"
            >
               <div>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest leading-tight">Combo</p>
                 <p className="font-display text-2xl font-bold font-mono text-[#4facfe] leading-none">x{multiplier}</p>
               </div>
            </motion.div>
         )}
       </div>

       <div className="flex flex-col items-end gap-2">
         {multiplier > 5 && (
            <div className="px-4 py-2 bg-orange-600 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-bold tracking-tight">MYTHIC FORGE ACTIVE</span>
            </div>
         )}
         
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-right mt-2">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Best Run</p>
            <p className="font-display text-sm font-bold text-white/80">{highestScore.toLocaleString()}m</p>
         </div>
       </div>
    </div>
  );
}
