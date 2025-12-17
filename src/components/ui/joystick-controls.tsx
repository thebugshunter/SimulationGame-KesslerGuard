
'use client';
import { Joystick } from '@/components/ui/joystick';

interface JoystickControlsProps {
    onJoystickMove: (x: number, y: number) => void;
    onToggle: () => void;
    isActive: boolean;
    label: string;
}

export function JoystickControls({ onJoystickMove, onToggle, isActive, label }: JoystickControlsProps) {
    return (
        <div className="pointer-events-auto flex flex-col items-center gap-2">
            <Joystick onMove={onJoystickMove} onToggle={onToggle} isActive={isActive} />
            <span className="text-xs uppercase tracking-widest text-accent/80">{label}</span>
        </div>
    );
}
