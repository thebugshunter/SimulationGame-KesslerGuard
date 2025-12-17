
'use client';
import { Joystick } from '@/components/ui/joystick';

interface JoystickControlsProps {
    onJoystickMove: (x: number, y: number) => void;
    label: string;
}

export function JoystickControls({ onJoystickMove, label }: JoystickControlsProps) {
    return (
        <div className="pointer-events-auto flex flex-col items-center gap-1 md:gap-2">
            <Joystick onMove={onJoystickMove} />
            <span className="text-xs uppercase tracking-widest text-accent/80">{label}</span>
        </div>
    );
}
