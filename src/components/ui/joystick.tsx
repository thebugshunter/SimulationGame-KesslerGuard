
'use client';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  onToggle: () => void;
  isActive: boolean;
}

export function Joystick({ onMove, onToggle, isActive }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pointerId = useRef<number | null>(null);

  const resetStick = () => {
    if (stickRef.current) {
      stickRef.current.style.transform = `translate(0px, 0px)`;
    }
    onMove(0, 0);
    setIsDragging(false);
    pointerId.current = null;
  };

  const moveStick = (clientX: number, clientY: number) => {
    if (!baseRef.current || !stickRef.current) return;

    const baseRect = baseRef.current.getBoundingClientRect();
    const baseCenterX = baseRect.left + baseRect.width / 2;
    const baseCenterY = baseRect.top + baseRect.height / 2;
    const maxDist = (baseRect.width / 2);

    let dx = clientX - baseCenterX;
    let dy = clientY - baseCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    
    const x = dx / maxDist;
    const y = dy / maxDist;
    onMove(x, y);
  };
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    
    if (e.button !== 0) return;
    
    setIsDragging(true);
    pointerId.current = e.pointerId;
    target.setPointerCapture(e.pointerId);
    moveStick(e.clientX, e.clientY);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && e.pointerId === pointerId.current) {
      moveStick(e.clientX, e.clientY);
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
     if (e.pointerId === pointerId.current) {
      resetStick();
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    }
  };


  return (
    <div
      ref={baseRef}
      className={cn(
        "relative h-32 w-32 rounded-full bg-black/20 backdrop-blur-sm touch-none transition-colors duration-200 flex items-center justify-center cursor-pointer",
        isActive && "bg-accent/30"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={stickRef}
        className={cn(
            "absolute h-20 w-20 rounded-full bg-accent/50 transition-all duration-75 pointer-events-none",
            isDragging && "scale-110 bg-accent/80",
            isActive && "bg-accent/80 ring-2 ring-accent"
        )}
        style={{ transform: 'translate(0px, 0px)' }}
      />
    </div>
  );
}
