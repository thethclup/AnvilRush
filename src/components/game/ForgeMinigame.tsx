import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Hammer } from 'lucide-react';

interface ForgeMinigameProps {
  onComplete: (success: boolean) => void;
}

export function ForgeMinigame({ onComplete }: ForgeMinigameProps) {
  const [sliderPos, setSliderPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  
  const targetZone = { start: 40, end: 60 }; // Sweet spot (%)
  const speed = 2; // Speed of slider
  
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (finished) return;

    const animate = () => {
      setSliderPos((prev) => {
        let nextPos = prev + (speed * direction);
        let nextDir = direction;
        if (nextPos >= 100) {
          nextPos = 100;
          nextDir = -1;
          setDirection(-1);
        } else if (nextPos <= 0) {
          nextPos = 0;
          nextDir = 1;
          setDirection(1);
        }
        return nextPos;
      });
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [direction, finished]);

  const handleStrike = () => {
    if (finished) return;
    setFinished(true);
    cancelAnimationFrame(frameRef.current);
    
    // Check if within target zone
    const success = sliderPos >= targetZone.start && sliderPos <= targetZone.end;
    
    if (success) {
      // Vibrate if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
         navigator.vibrate([100, 50, 100]);
      }
      setResultMsg('LEGENDARY FORGE!');
    } else {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
         navigator.vibrate(50);
      }
      setResultMsg('MISSED!');
    }

    // Auto close after brief delay to show result
    setTimeout(() => {
      onComplete(success);
    }, 800);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0502]/80 backdrop-blur-xl"
         onClick={handleStrike} // Tap anywhere to strike
    >
      <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="w-full max-w-sm px-6 text-center"
      >
        <div className="mb-6 flex justify-center animate-bounce text-orange-500 drop-shadow-[0_0_15px_rgba(255,78,0,0.8)]">
           <Hammer size={64} />
        </div>

        <h2 className={`font-display text-4xl font-extrabold uppercase drop-shadow-md mb-8 tracking-tight ${finished ? (resultMsg.includes('LEGENDARY') ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-white' : 'text-slate-400') : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-100'}`}>
          {finished ? resultMsg : 'STRIKE!'}
        </h2>
        
        {/* Slider Track */}
        <div className="relative h-12 w-full bg-black/40 rounded-full border border-white/10 overflow-hidden shadow-inner">
           {/* Target Zone */}
           <div className="absolute h-full bg-[#4facfe]/30 backdrop-blur-md border-x border-[#4facfe] shadow-[0_0_20px_rgba(79,172,254,0.6)]" 
                style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }} />
           
           {/* Slider */}
           <div className="absolute h-full w-2 bg-white -ml-1 shadow-[0_0_15px_#fff]"
                style={{ left: `${sliderPos}%` }} />
        </div>
        
        <p className="mt-8 text-[10px] text-white/40 font-mono uppercase tracking-widest">Tap anywhere to forge</p>
      </motion.div>
    </div>
  );
}
