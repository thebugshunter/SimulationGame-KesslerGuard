
'use client';

import { useState, useEffect } from 'react';
import { Rocket, Volume2, VolumeX, Fuel, Zap, Compass, AlertTriangle, Settings, Menu } from 'lucide-react';
import { Button } from './button';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'warning' | 'danger';
}

const StatusItem = ({ icon, label, value, unit, variant = 'default' }: StatusItemProps) => {
    const colors = {
        default: 'text-accent',
        warning: 'text-yellow-400',
        danger: 'text-red-500'
    };
    return (
        <div className={`flex items-center gap-2 md:gap-3 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 ${colors[variant]}`}>
            {icon}
            <div className="text-left">
                <div className="font-mono text-base md:text-xl font-bold -mb-1">{value}{unit}</div>
                <div className="text-xs font-light uppercase tracking-widest opacity-70">{label}</div>
            </div>
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
    <header className="absolute top-0 left-0 right-0 z-20 grid grid-cols-3 items-start gap-4 p-4">
      <div className="flex items-center gap-2 self-center justify-self-start">
        <Rocket className="h-6 w-6 text-accent" />
        <h1 className="font-headline text-xl md:text-2xl font-bold tracking-tighter text-white">
          Kessler Guard
        </h1>
      </div>

      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 md:gap-4 col-start-1 col-span-3 lg:col-start-2 lg:col-span-1 order-3 lg:order-2 mt-2 lg:mt-0">
          <StatusItem icon={<Zap className="h-5 w-5" />} label="Power" value={99} unit="%" />
          <StatusItem icon={<Fuel className="h-5 w-5" />} label="Fuel" value={98} unit="%" />
          <StatusItem icon={<Compass className="h-5 w-5" />} label="Gyroscope" value="Online" />
          <StatusItem 
              icon={<AlertTriangle className="h-5 w-5" />} 
              label="Proximity" 
              value={gravityWarning ? 'ALERT' : 'Clear'}
              variant={gravityWarning ? 'danger' : 'default'}
           />
           <StatusItem 
              icon={<div className="h-5 w-5 text-sm font-bold flex items-center justify-center">K</div>}
              label="Kessler Risk"
              value={kesslerScore}
              unit="%"
              variant={kesslerScore > 15 ? 'warning' : 'default'}
          />
      </div>

      <div className="flex items-center gap-2 order-2 lg:order-3 self-center justify-self-end">
        <Button 
          onClick={onToggleTerminal} 
          variant="ghost" 
          size="icon" 
          className="text-accent hover:bg-accent/10 hover:text-accent"
        >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Data Terminal</span>
        </Button>
        <Button 
          onClick={onToggleSound} 
          variant="ghost" 
          size="icon" 
          className="text-accent hover:bg-accent/10 hover:text-accent"
        >
          {isSoundMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          <span className="sr-only">Toggle Sound</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-accent hover:bg-accent/10 hover:text-accent"
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">Game Settings</span>
        </Button>
      </div>
    </header>
  );
}
