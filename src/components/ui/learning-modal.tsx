
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Move, Mouse, Scan, Target, Smartphone } from 'lucide-react';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LearningModal({ isOpen, onClose }: LearningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-background/80 backdrop-blur-md border-accent/50 flex flex-col max-h-[90vh]" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="font-headline text-accent text-2xl">Welcome to Kessler Guard</DialogTitle>
          <DialogDescription>
            Your mission is to help clean up low-earth orbit. You are pioneering the future of remote work, performing critical operations in space, all from Earth.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow my-4">
          <div className="grid gap-4 pr-6">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2 mt-1">
                <Move className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Movement</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">[Desktop]</span> Use WASD to thrust, Q/E to roll, and Space/Shift to move vertically.
                  <br/>
                  <span className="font-bold">[Mobile]</span> Use the left on-screen joystick to move.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2 mt-1">
                <Mouse className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Camera Control</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">[Desktop]</span> Click and drag with the left mouse button to look around.
                  <br/>
                  <span className="font-bold">[Mobile]</span> Use the right on-screen joystick to look.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2 mt-1">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Targeting</h4>
                <p className="text-sm text-muted-foreground">Click on any object to select it. The reticle in the center of your screen is your scanner's aimpoint.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2 mt-1">
                <Scan className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Tools</h4>
                <p className="text-sm text-muted-foreground">Use your pod's tools via the dashboard. Be careful—your actions have consequences!</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-muted p-2 mt-1">
                <Smartphone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">Mobile Experience</h4>
                <p className="text-sm text-muted-foreground">For the best experience on a mobile device, please tilt your phone to landscape mode.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-auto pt-4 border-t border-border/20">
          <Button onClick={onClose} className="w-full bg-accent text-background hover:bg-accent/90">Start Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
