import { Rocket, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

interface GameHeaderProps {
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export function GameHeader({ isSoundMuted, onToggleSound }: GameHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-6 w-6 text-accent" />
        <h1 className="font-headline text-2xl font-bold tracking-tighter text-white">
          OrbitalSync
        </h1>
      </div>
      <Button onClick={onToggleSound} variant="ghost" size="icon" className="text-accent hover:bg-accent/10 hover:text-accent">
        {isSoundMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        <span className="sr-only">Toggle Sound</span>
      </Button>
    </header>
  );
}
