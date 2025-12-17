
'use client';
import { Scan, Magnet, Menu, Flame, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ActiveTool } from '@/components/game/orbital-sync-app';

const CockpitFrame = () => (
    <svg viewBox="0 0 1440 900" className="absolute bottom-0 left-0 right-0 w-full h-auto pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M-33 900L720 750L1473 900" stroke="hsl(var(--accent))" strokeOpacity="0.1" />
        <path d="M220 900L720 800L1220 900" stroke="hsl(var(--accent))" strokeOpacity="0.1" />
    </svg>
);

const Reticle = () => (
  <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 35 V 0 M50 65 V 100 M65 50 H 100 M35 50 H 0" stroke="hsl(var(--accent))" strokeOpacity="0.4" strokeWidth="1"/>
        <circle cx="50" cy="50" r="10" stroke="hsl(var(--accent))" strokeOpacity="0.7" strokeWidth="1"/>
    </svg>
  </div>
);

interface PodDashboardProps {
  onToggleTerminal: () => void;
  onToolToggle: (tool: ActiveTool) => void;
  activeTool: ActiveTool;
  playClickSound: () => void;
}


export function PodDashboard({ onToggleTerminal, onToolToggle, activeTool, playClickSound }: PodDashboardProps) {
  const [kesslerScore, setKesslerScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setKesslerScore(Math.floor(Math.random() * 20) + 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToolClick = (tool: ActiveTool) => {
    onToolToggle(tool);
  }

  const handleToggleTerminalClick = () => {
    onToggleTerminal();
  }

  const getToolVariant = (tool: ActiveTool) => {
    return activeTool === tool ? 'default' : 'outline';
  }

  return (
    <div className="relative w-full">
        <CockpitFrame />
        <Reticle />
        <div className="relative z-10 flex h-full items-end justify-center md:justify-between flex-wrap-reverse md:flex-nowrap gap-2 px-1 py-2 md:px-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-lg">
            <div className="flex items-end gap-2">
                <Button 
                    onClick={() => handleToolClick('Scan')}
                    variant={getToolVariant('Scan')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-14 w-14 md:h-16 md:w-16 rounded-lg",
                        activeTool === 'Scan' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Scan className="h-6 w-6 md:h-8 md:w-8"/>
                    <span className="sr-only">Scan</span>
                </Button>
                <Button 
                    onClick={() => handleToolClick('Magnet')}
                    variant={getToolVariant('Magnet')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-14 w-14 md:h-16 md:w-16 rounded-lg",
                        activeTool === 'Magnet' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Magnet className="h-6 w-6 md:h-8 md:w-8"/>
                    <span className="sr-only">Magnet</span>
                </Button>
                <Button 
                    onClick={() => handleToolClick('Burner')}
                    variant={getToolVariant('Burner')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-14 w-14 md:h-16 md:w-16 rounded-lg",
                        activeTool === 'Burner' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Flame className="h-6 w-6 md:h-8 md:w-8"/>
                    <span className="sr-only">Plasma Burner</span>
                </Button>
            </div>

            <div className="hidden md:flex flex-grow flex-col items-center text-accent mx-4 text-center">
                <span className="text-sm font-light uppercase tracking-widest opacity-70">Kessler Likelihood</span>
                <span className="font-mono text-4xl font-bold">{kesslerScore}%</span>
            </div>

            <div className="flex items-end gap-2">
                <div className="hidden md:flex h-16 items-center gap-4 rounded-lg border border-accent/50 bg-background/50 px-4 text-accent">
                    <Fuel className="h-8 w-8" />
                    <div className="text-right">
                        <div className="font-mono text-3xl font-bold">98%</div>
                        <div className="text-xs font-light uppercase tracking-widest opacity-70">Fuel</div>
                    </div>
                </div>
                <Button onClick={handleToggleTerminalClick} variant="outline" className="h-14 md:h-16 gap-2 rounded-lg border-accent/50 px-3 md:px-4 text-accent hover:bg-accent/10 hover:text-accent">
                    <Menu className="h-6 w-6 md:h-8 md:w-8" />
                    <span className="text-lg md:text-xl">DATA</span>
                </Button>
            </div>
        </div>
    </div>
  );
}
