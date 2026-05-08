import { useState, useEffect, useRef } from 'react';

export type GameState = 'MENU' | 'PLAYING' | 'FORGING' | 'GAME_OVER';

interface Runner {
  y: number;
  vy: number;
  isJumping: boolean;
  score: number;
  multiplier: number;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

interface Anvil {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [speed, setSpeed] = useState(5);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game Entities State (Refs for performance to avoid re-renders on every frame)
  const runner = useRef<Runner>({ y: 0, vy: 0, isJumping: false, score: 0, multiplier: 1 });
  const obstacles = useRef<Obstacle[]>([]);
  const anvils = useRef<Anvil[]>([]);
  const dts = useRef<number>(performance.now());

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setMultiplier(1);
    setSpeed(5);
    runner.current = { y: 0, vy: 0, isJumping: false, score: 0, multiplier: 1 };
    obstacles.current = [];
    anvils.current = [];
    dts.current = performance.now();
  };

  const jump = () => {
    if (!runner.current.isJumping && gameState === 'PLAYING') {
      runner.current.vy = -12;
      runner.current.isJumping = true;
    }
  };

  const startForging = () => {
    setGameState('FORGING');
  };

  const finishForging = (success: boolean) => {
    setGameState('PLAYING');
    if (success) {
      setMultiplier(m => Math.min(m + 1, 10)); // Max multiplier 10x
      setSpeed(s => Math.min(s + 1, 15)); // Increase speed slightly
    } else {
      setMultiplier(1); // Reset multiplier on fail
    }
    dts.current = performance.now(); // Reset delta time
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (runner.current.score > highestScore) {
      setHighestScore(Math.floor(runner.current.score));
    }
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const gravity = 0.6;
    const baseGroundY = 100; // From bottom

    const render = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Delta time (though assuming 60fps for simple physics)
      // const deltaTime = time - dts.current;
      dts.current = time;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics - Runner
      runner.current.y += runner.current.vy;
      if (runner.current.y < canvas.height - baseGroundY - 40) { // 40 = runner height
        runner.current.vy += gravity; // Apply gravity
      } else {
        runner.current.y = canvas.height - baseGroundY - 40;
        runner.current.vy = 0;
        runner.current.isJumping = false;
      }

      // Update Score
      runner.current.score += (speed / 60) * multiplier;
      setScore(Math.floor(runner.current.score));

      // Spawn Obstacles
      if (Math.random() < 0.01 * (speed / 5)) {
        // Prevent spawning too close
        if (obstacles.current.length === 0 || obstacles.current[obstacles.current.length - 1].x < canvas.width - 200) {
           obstacles.current.push({
              x: canvas.width,
              width: 30,
              height: 40 + Math.random() * 40
           });
        }
      }

      // Spawn Anvils (Forging opportunity)
      if (Math.random() < 0.005) {
         if (anvils.current.length === 0 || anvils.current[anvils.current.length-1].x < canvas.width - 300) {
            anvils.current.push({
               x: canvas.width + 100,
               y: canvas.height - baseGroundY - 120 - Math.random() * 50, // Floating Anvil
               width: 50,
               height: 40,
               active: true
            });
         }
      }

      // Draw Background - Transparent to let CSS atmosphere show through
      // Removed solid background gradient fill

      // Draw Ground
      const groundGradient = ctx.createLinearGradient(0, canvas.height - baseGroundY, 0, canvas.height);
      groundGradient.addColorStop(0, 'rgba(255, 78, 0, 0.4)'); // orange border
      groundGradient.addColorStop(0.1, 'rgba(10, 5, 2, 0.8)'); // solid dark
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height - baseGroundY, canvas.width, baseGroundY);

      // Draw and Update Obstacles
      ctx.fillStyle = '#ff4e00'; // Orange obstacle
      ctx.shadowColor = '#ff4e00';
      ctx.shadowBlur = 10;
      for (let i = obstacles.current.length - 1; i >= 0; i--) {
        const obs = obstacles.current[i];
        obs.x -= speed;

        ctx.fillRect(obs.x, canvas.height - baseGroundY - obs.height, obs.width, obs.height);

        // Collision Check Runner vs Obstacle
        const runnerRect = { x: 50, y: runner.current.y, w: 40, h: 40 };
        const obsRect = { x: obs.x, y: canvas.height - baseGroundY - obs.height, w: obs.width, h: obs.height };
        
        if (runnerRect.x < obsRect.x + obsRect.w &&
            runnerRect.x + runnerRect.w > obsRect.x &&
            runnerRect.y < obsRect.y + obsRect.h &&
            runnerRect.y + runnerRect.h > obsRect.y) {
           gameOver();
        }

        if (obs.x + obs.width < 0) {
          obstacles.current.splice(i, 1);
        }
      }
      ctx.shadowBlur = 0;

      // Draw and Update Anvils
      for (let i = anvils.current.length - 1; i >= 0; i--) {
        const anvil = anvils.current[i];
        anvil.x -= speed;

        if (anvil.active) {
            // Anvil Glow
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#1a1a1a'; // Dark anvil
            ctx.fillRect(anvil.x + 5, anvil.y + 10, anvil.width - 10, anvil.height - 10);
            
            ctx.fillStyle = '#fbbf24'; // Divine gold anvil top
            ctx.fillRect(anvil.x, anvil.y, anvil.width, 10);
            
            // Draw spark indicator
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(anvil.x + 10, anvil.y - 10, 5, 5);
        }

        // Tap/Collision Check for Anvil -> Forging
        const runnerRect = { x: 50, y: runner.current.y, w: 40, h: 40 };
        // Increase hit box for anvil slightly for mobile forgiveness
        const anvilRect = { x: anvil.x - 20, y: anvil.y - 20, w: anvil.width + 40, h: anvil.height + 40 };
        
        if (anvil.active &&
            runnerRect.x < anvilRect.x + anvilRect.w &&
            runnerRect.x + runnerRect.w > anvilRect.x &&
            runnerRect.y < anvilRect.y + anvilRect.h &&
            runnerRect.y + runnerRect.h > anvilRect.y) {
            
            anvil.active = false;
            startForging();
        }

        if (anvil.x + anvil.width < 0) {
          anvils.current.splice(i, 1);
        }
      }

      // Draw Runner
      ctx.shadowColor = '#4facfe';
      ctx.shadowBlur = multiplier > 1 ? 30 * multiplier : 15;
      ctx.fillStyle = '#4facfe'; // Mystic blue runner
      ctx.fillRect(50, runner.current.y, 40, 40);
      
      // Reset Shadow
      ctx.shadowBlur = 0;

      if (gameState === 'PLAYING') {
         requestRef.current = requestAnimationFrame(render);
      }
    };

    requestRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, speed, multiplier]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    gameState,
    score,
    multiplier,
    highestScore,
    canvasRef,
    startGame,
    jump,
    finishForging
  };
}
