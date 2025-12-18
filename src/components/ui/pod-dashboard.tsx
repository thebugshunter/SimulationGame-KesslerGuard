
'use client';
import { Scan, Magnet, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ActiveTool } from '@/components/game/kessler-guard-app';


const CockpitFrame = () => (
    <svg viewBox="0 0 1440 900" className="absolute bottom-0 left-0 right-0 w-full h-auto pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M-33 900L720 750L1473 900" stroke="hsl(var(--accent))" strokeOpacity="0.1" />
        <path d="M220 900L720 800L1220 900" stroke="hsl(var(--accent))" strokeOpacity="0.1" />
    </svg>
);

const Reticle = () => (
  <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 35 V 0 M50 65 V 100 M65 50 H 100 M35 50 H 0" stroke="hsl(var(--accent))" strokeOpacity="0.4" strokeWidth="1"/>
        <circle cx="50" cy="50" r="10" stroke="hsl(var(--accent))" strokeOpacity="0.7" strokeWidth="1"/>
    </svg>
  </div>
);

interface PodDashboardProps {
  onToolToggle: (tool: ActiveTool) => void;
  activeTool: ActiveTool;
  playClickSound: () => void;
}


export function PodDashboard({ onToolToggle, activeTool }: PodDashboardProps) {

  const handleToolClick = (tool: ActiveTool) => {
    onToolToggle(tool);
  }

  const getToolVariant = (tool: ActiveTool) => {
    return activeTool === tool ? 'default' : 'outline';
  }

  return (
    <div className="relative w-full h-full">
        <CockpitFrame />
        <Reticle />
        <div className="relative z-10 flex h-full items-end justify-center gap-1 md:gap-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-1 md:p-0 rounded-lg">
            {/* Tool Buttons */}
            <div className="flex items-end gap-1 md:gap-2">
                <Button 
                    onClick={() => handleToolClick('Scan')}
                    variant={getToolVariant('Scan')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-12 w-12 md:h-16 md:w-16 rounded-lg p-2",
                        activeTool === 'Scan' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Scan className="h-full w-full"/>
                    <span className="sr-only">Scan</span>
                </Button>
                <Button 
                    onClick={() => handleToolClick('Magnet')}
                    variant={getToolVariant('Magnet')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-12 w-12 md:h-16 md:w-16 rounded-lg p-2",
                        activeTool === 'Magnet' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Magnet className="h-full w-full"/>
                    <span className="sr-only">Magnet</span>
                </Button>
                 <Button 
                    onClick={() => handleToolClick('Burner')}
                    variant={getToolVariant('Burner')}
                    size="lg" 
                    className={cn(
                        "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent aspect-square h-12 w-12 md:h-16 md:w-16 rounded-lg p-2",
                        activeTool === 'Burner' && "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}>
                    <Flame className="h-full w-full"/>
                    <span className="sr-only">Plasma Burner</span>
                </Button>
            </div>
        </div>
    </div>
  );
}
