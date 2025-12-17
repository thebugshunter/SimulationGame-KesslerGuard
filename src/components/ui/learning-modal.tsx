import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Move, Mouse, Scan, Target } from 'lucide-react';

interface LearningModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function LearningModal({ isOpen, onOpenChange }: LearningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-md border-accent/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-accent text-2xl">Welcome to OrbitalSync</DialogTitle>
          <DialogDescription>
            Your mission is to help clean up low-earth orbit. The Kessler Syndrome is a real threat, and this simulation is a training ground for the science and engineering needed to solve it. You are pioneering the future of remote work, performing critical operations in space, all from Earth.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-muted p-2">
              <Move className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Movement</h4>
              <p className="text-sm text-muted-foreground">Use WASD to thrust, Space/Shift to move vertically.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-muted p-2">
              <Mouse className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Camera</h4>
              <p className="text-sm text-muted-foreground">Click and drag on the screen to look around.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-muted p-2">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Targeting</h4>
              <p className="text-sm text-muted-foreground">Click on any object to get its data in the terminal.</p>
            </div>
          </div>
           <div className="flex items-center gap-4">
            <div className="rounded-md bg-muted p-2">
              <Scan className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Tools</h4>
              <p className="text-sm text-muted-foreground">Use your pod's tools to interact with objects. But be careful!</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-accent text-background hover:bg-accent/90">Start Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
