
'use client';
import { cn } from '@/lib/utils';
import type { Euler } from 'three';

interface GyroscopeProps {
  orientation: Euler | null;
}

const GyroscopeDisplay = ({ orientation }: GyroscopeProps) => {
  const pitch = orientation ? orientation.x * (180 / Math.PI) : 0;
  const yaw = orientation ? orientation.y * (180 / Math.PI) : 0;
  const roll = orientation ? orientation.z * (180 / Math.PI) : 0;

  const sphereStyle = {
    transform: `rotateX(${-pitch}deg) rotateY(${-yaw}deg) rotateZ(${-roll}deg)`,
  };

  return (
    <div className="flex flex-col items-center gap-1 text-accent">
      <div className="w-24 h-24" style={{ perspective: '400px' }}>
        <div
          className="relative w-full h-full transition-transform duration-100 ease-linear"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg)' }}
        >
          {/* Sphere */}
          <div className="absolute w-full h-full rounded-full border-2 border-accent/50 bg-black/30" style={sphereStyle}>
            {/* Equator */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-accent/30"></div>
            {/* Prime Meridian */}
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-accent/30"></div>
            {/* North Pole Marker */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-400"></div>
            {/* Earth Vector Marker */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400"></div>
          </div>
          {/* Outer Ring */}
          <div className="absolute w-full h-full rounded-full border border-dashed border-accent/20"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-2 text-xs font-mono w-full max-w-[150px] text-center">
        <span>P: {pitch.toFixed(0)}°</span>
        <span>Y: {yaw.toFixed(0)}°</span>
        <span>R: {roll.toFixed(0)}°</span>
      </div>
    </div>
  );
};


export function Gyroscope({ orientation }: GyroscopeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/20 backdrop-blur-sm">
      <GyroscopeDisplay orientation={orientation} />
    </div>
  );
}
