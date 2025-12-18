
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
import { Move, Mouse, Crosshair, Wrench } from 'lucide-react';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructions = [
  {
    icon: Move,
    title: 'Movement',
    desktop: 'Use WASD to thrust, Q/E to roll, and Space/Shift to move vertically.',
    mobile: 'Use the left on-screen joystick to move.',
  },
  {
    icon: Mouse,
    title: 'Camera Control',
    desktop: 'Click and drag with the left mouse button to look around.',
    mobile: 'Use the right on-screen joystick to look.',
  },
  {
      icon: Crosshair,
      title: 'Targeting & Interaction',
      desktop: 'Click on an object to select it for analysis.',
      mobile: 'Tap on an object to select it.',
  },
  {
      icon: Wrench,
      title: 'Tools',
      desktop: 'Activate tools like the Scanner or Magnet using the dashboard buttons. Left-click to use the active tool.',
      mobile: 'Tap the dashboard buttons to activate tools. The active tool is used automatically.',
  },
];


export function LearningModal({ isOpen, onClose }: LearningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl bg-background/80 backdrop-blur-md border-accent/50 flex flex-col max-h-[90vh]" hideCloseButton>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-headline text-accent text-2xl">Welcome to Kessler Guard</DialogTitle>
          <DialogDescription>
            Your mission is to help clean up low-earth orbit. You are pioneering the future of remote work, performing critical operations in space, all from Earth.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow my-4 min-h-0">
          <ScrollArea className="h-full pr-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {instructions.map(({ icon: Icon, title, desktop, mobile }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="rounded-md bg-muted p-2 mt-1">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold">[Desktop]</span> {desktop}
                      <br />
                      <span className="font-bold">[Mobile]</span> {mobile}
                    </p>
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-6 text-center text-sm text-accent/80 p-2 rounded-md bg-muted/50">
              <span className="font-bold">Mobile Tip:</span> For the best experience, please tilt your phone to landscape mode.
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t border-border/20 flex-shrink-0">
          <Button onClick={onClose} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Start Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
