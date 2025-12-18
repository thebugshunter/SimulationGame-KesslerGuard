
'use client';

import { useState, useEffect } from 'react';
import { Rocket, Volume2, VolumeX, Fuel, Zap, Compass, AlertTriangle, Settings, Menu } from 'lucide-react';
import { Button } from './button';

interface StatusItemProps {
  icon: React.ReactNode;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'warning' | 'danger';
}

const StatusItem = ({ icon, value, unit, variant = 'default' }: StatusItemProps) => {
    const colors = {
        default: 'text-accent',
        warning: 'text-yellow-400',
        danger: 'text-red-500'
    };
    return (
        <div className={`flex items-center gap-2 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 px-2 py-1 ${colors[variant]}`}>
            <div className="h-4 w-4">{icon}</div>
            <div className="font-mono text-xs font-bold">{value}{unit}</div>
        </div>
    );
};

interface GameHeaderProps {
  isSoundMuted: boolean;
  onToggleSound: () => void;
  onToggleTerminal: () => void;
}

export function GameHeader({ isSoundMuted, onToggleSound, onToggleTerminal }: GameHeaderProps) {
  const [kesslerScore, setKesslerScore] = useState(0);
  const [gravityWarning, setGravityWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setKesslerScore(Math.floor(Math.random() * 20) + 5);
        setGravityWarning(Math.random() > 0.9);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-start justify-between gap-4 p-2 sm:p-4">
      {/* Left Group */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10">
          <Rocket className="h-5 w-5 text-accent" />
          <h1 className="hidden sm:block font-headline text-base font-bold tracking-tighter text-white">
            Kessler Guard
          </h1>
        </div>
      </div>
      
      {/* Center Group - Status Items */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <StatusItem icon={<Zap />} value={99} unit="%" />
          <StatusItem icon={<Fuel />} value={98} unit="%" />
          <StatusItem icon={<Compass />} value="Online" />
          <StatusItem 
              icon={<AlertTriangle />} 
              value={gravityWarning ? 'ALERT' : 'CLR'}
              variant={gravityWarning ? 'danger' : 'default'}
           />
           <StatusItem 
              icon={<span className="font-bold">K</span>}
              value={`${kesslerScore}%`}
              variant={kesslerScore > 15 ? 'warning' : 'default'}
          />
      </div>

      {/* Right Group */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
        <Button 
          onClick={onToggleTerminal} 
          variant="ghost" 
          size="icon" 
          className="text-accent h-9 w-9 hover:bg-accent/10 hover:text-accent rounded-lg bg-black/30 backdrop-blur-sm border border-white/10"
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Data Terminal</span>
        </Button>
        <Button 
          onClick={onToggleSound} 
          variant="ghost" 
          size="icon" 
          className="text-accent h-9 w-9 hover:bg-accent/10 hover:text-accent rounded-lg bg-black/30 backdrop-blur-sm border border-white/10"
        >
          {isSoundMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          <span className="sr-only">Toggle Sound</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-accent h-9 w-9 hover:bg-accent/10 hover:text-accent rounded-lg bg-black/30 backdrop-blur-sm border border-white/10"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Game Settings</span>
        </Button>
      </div>
    </header>
  );
}
