
'use client';
import { cn } from '@/lib/utils';
import type { Euler } from 'three';
import { useShipState } from '@/components/game/ship-state';

const GyroscopeDisplay = () => {
  const { shipState } = useShipState();
  const { orientation } = shipState;

  const pitch = orientation.x * (180 / Math.PI);
  const yaw = orientation.y * (180 / Math.PI);
  const roll = orientation.z * (180 / Math.PI);

  const sphereStyle = {
    transform: `rotateX(${-pitch}deg) rotateY(${-yaw}deg) rotateZ(${-roll}deg)`,
  };

  return (
    <div className="flex flex-col items-center gap-2 text-accent p-2 rounded-lg bg-black/20">
      <div className="w-32 h-32" style={{ perspective: '500px' }}>
        <div
          className="relative w-full h-full transition-transform duration-100 ease-linear"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(20deg)' }}
        >
          {/* Sphere */}
          <div className="absolute w-full h-full rounded-full border-2 border-accent/50 bg-black/30" style={sphereStyle}>
            {/* Equator */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-accent/30"></div>
            {/* Prime Meridian */}
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-accent/30"></div>
            {/* North Pole Marker */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-400/80"></div>
            {/* Earth Vector Marker */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400/80"></div>
          </div>
          {/* Outer Rings */}
          <div className="absolute w-full h-full rounded-full border border-dashed border-accent/20" style={{transform: 'rotateX(90deg)'}}></div>
          <div className="absolute w-full h-full rounded-full border border-dashed border-accent/20" style={{transform: 'rotateY(90deg)'}}></div>

        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-4 text-sm font-mono w-full max-w-xs text-center">
        <span>P: {pitch.toFixed(0)}°</span>
        <span>Y: {yaw.toFixed(0)}°</span>
        <span>R: {roll.toFixed(0)}°</span>
      </div>
    </div>
  );
};


export function Gyroscope() {
  return (
      <GyroscopeDisplay />
  );
}
