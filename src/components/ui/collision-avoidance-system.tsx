
'use client';

import { cn } from '@/lib/utils';
import { Triangle } from 'lucide-react';

export interface CollisionWarning {
  threatScreenX: number;
  threatScreenY: number;
  escapeScreenX: number;
  escapeScreenY: number;
  urgency: number; // 0 to 1
}

interface CollisionAvoidanceSystemProps {
  warning: CollisionWarning | null;
}

export function CollisionAvoidanceSystem({ warning }: CollisionAvoidanceSystemProps) {
  if (!warning) {
    return null;
  }

  // Clamp the screen coordinates to prevent indicators from going completely off-screen
  const clamp = (val: number) => Math.max(-0.95, Math.min(0.95, val));
  
  const threatX = clamp(warning.threatScreenX) * 50;
  const threatY = clamp(-warning.threatScreenY) * 50; // Y is inverted in screen space
  const escapeX = clamp(warning.escapeScreenX) * 50;
  const escapeY = clamp(-warning.escapeScreenY) * 50;

  const threatAngle = Math.atan2(warning.threatScreenY, warning.threatScreenX) * (180 / Math.PI) - 90;
  const escapeAngle = Math.atan2(warning.escapeScreenY, warning.escapeScreenX) * (180 / Math.PI) - 90;

  const urgencyClass = warning.urgency > 0.7 ? 'text-red-500' : 'text-yellow-400';
  const animationClass = warning.urgency > 0.5 ? 'animate-pulse' : '';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Global Warning Flash */}
      <div
        className="absolute inset-0 bg-red-500 transition-opacity duration-500"
        style={{ opacity: warning.urgency * 0.2, mixBlendMode: 'hard-light' }}
      />
      
      {/* Threat Indicator */}
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-100',
          urgencyClass,
          animationClass
        )}
        style={{
          transform: `translate(${threatX}vw, ${threatY}vh) rotate(${threatAngle}deg) scale(${1 + warning.urgency})`,
        }}
      >
        <Triangle className="h-10 w-10 fill-current" />
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center text-xs uppercase tracking-widest text-white">
            Threat
        </div>
      </div>

      {/* Escape Vector Indicator */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-100 text-cyan-400"
        style={{
          transform: `translate(${escapeX}vw, ${escapeY}vh) rotate(${escapeAngle}deg) scale(${1 + warning.urgency})`,
        }}
      >
        <div className="relative h-12 w-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-current" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-current" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-current" />
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center text-xs uppercase tracking-widest text-white">
            Escape
        </div>
      </div>
    </div>
  );
}
