import { Web3Provider } from './providers/Web3Provider';
import { useGameEngine } from './hooks/useGameEngine';
import { HUD } from './components/game/HUD';
import { ForgeMinigame } from './components/game/ForgeMinigame';
import { Button } from './components/ui/Button';
import { Web3Dashboard } from './components/game/Web3Dashboard';
import { Hammer } from 'lucide-react';
import { useEffect } from 'react';

function GameOverlay() {
  const { gameState, score, multiplier, highestScore, canvasRef, startGame, jump, finishForging } = useGameEngine();

  // Prevent default touch behaviors like scrolling to allow smooth jumping
  useEffect(() => {
     const preventScroll = (e: TouchEvent) => {
        if (gameState === 'PLAYING') e.preventDefault();
     };
     document.addEventListener('touchmove', preventScroll, { passive: false });
     return () => document.removeEventListener('touchmove', preventScroll);
  }, [gameState]);

  return (
    <div 
      className="relative w-full h-screen bg-[#0a0502] font-sans text-white overflow-hidden select-none flex flex-col"
      onClick={jump} // Tap anywhere to jump
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ff4e00] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4facfe] rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0502_90%)]"></div>
      </div>

      <div className="relative z-10 flex flex-1 w-full h-full">
        <canvas 
           ref={canvasRef} 
           className="absolute inset-0 w-full h-full block z-10" 
           // Optional: add some background glow based on multiplier
           style={{ boxShadow: multiplier > 1 ? `inset 0 0 ${multiplier * 10}px rgba(255,78,0,0.2)` : 'none', opacity: 0.8, mixBlendMode: 'screen' }}
        />

        {gameState === 'PLAYING' && (
           <HUD score={score} multiplier={multiplier} highestScore={highestScore} />
        )}

        {gameState === 'FORGING' && (
           <div className="absolute inset-0 z-50">
             <ForgeMinigame onComplete={finishForging} />
           </div>
        )}

        {(gameState === 'MENU' || gameState === 'GAME_OVER') && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
              <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full flex flex-col items-center">
                 <div className="mb-6 animate-pulse flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,78,0,0.6)]">
                      <Hammer size={40} className="text-white" />
                    </div>
                 </div>
                 
                 <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-100 drop-shadow-md text-center mb-2">
                    MYTHIC ANVIL
                 </h1>
                 <p className="text-[10px] text-orange-400 font-mono tracking-widest uppercase mb-6">Rush Protocol v1.5</p>
                 
                 {gameState === 'GAME_OVER' && (
                   <div className="text-center mb-8 w-full">
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Run Finished</p>
                      <div className="flex flex-col items-center justify-center bg-white/5 py-4 rounded-xl border border-white/10 mb-6">
                        <p className="text-4xl font-bold font-mono text-orange-500">{score}<span className="text-sm text-white/40 ml-1">m</span></p>
                      </div>
                      <Web3Dashboard score={score} />
                   </div>
                 )}

                 {gameState === 'MENU' && (
                   <div className="text-center mb-8 w-full">
                      <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6">
                         <p className="text-sm text-white/60 mb-2">Run endlessly. Forge powerfully.</p>
                         <p className="text-sm font-bold text-white mb-2">Become a Legend.</p>
                      </div>
                      <Web3Dashboard />
                   </div>
                 )}

                 <div className="w-full h-px bg-white/10 my-6" />

                 <Button variant="mythic" size="lg" className="w-full bg-gradient-to-r from-orange-600 to-red-600 border-t border-white/20 shadow-[0_10px_40px_rgba(234,88,12,0.5)] rounded-2xl text-xl font-black tracking-widest uppercase" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                    {gameState === 'MENU' ? 'START RUSH' : 'RUSH AGAIN'}
                 </Button>
                 
                 <p className="mt-6 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    Tap/Click to Jump • Tap Anvil to Forge
                 </p>
              </div>
           </div>
        )}
      </div>

      {/* Bottom Attribution Ticker */}
      <div className="h-8 bg-black/60 border-t border-white/5 px-6 flex items-center justify-between z-50">
        <div className="flex gap-4">
          <span className="text-[10px] font-mono text-white/40">BUILDER: bc_xhh7du90</span>
          <span className="text-[10px] font-mono text-white/40">PROTOCOL: ERC-8021 / 8004</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40">TX STATUS:</span>
          <span className="text-[10px] text-[#4facfe] font-bold uppercase tracking-widest">Syncing Realm...</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameOverlay />
    </Web3Provider>
  );
}
