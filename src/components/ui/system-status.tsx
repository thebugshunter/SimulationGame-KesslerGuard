
'use client';

import { useState, useEffect } from 'react';
import { Fuel, Zap, Compass, AlertTriangle } from 'lucide-react';

const StatusItem = ({ icon, label, value, unit, variant = 'default' }: { icon: React.ReactNode, label: string, value: string | number, unit?: string, variant?: 'default' | 'warning' | 'danger' }) => {
    const colors = {
        default: 'text-accent',
        warning: 'text-yellow-400',
        danger: 'text-red-500'
    };
    return (
        <div className={`flex items-center gap-2 md:gap-3 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 ${colors[variant]}`}>
            {icon}
            <div className="text-left">
                <div className="font-mono text-lg md:text-xl font-bold -mb-1">{value}{unit}</div>
                <div className="text-xs font-light uppercase tracking-widest opacity-70">{label}</div>
            </div>
        </div>
    );
};


export function SystemStatus() {
  const [kesslerScore, setKesslerScore] = useState(0);
  const [gravityWarning, setGravityWarning] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
        setKesslerScore(Math.floor(Math.random() * 20) + 5);
        setGravityWarning(Math.random() > 0.9);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute top-16 left-0 right-0 z-10 flex justify-center items-start p-4">
        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 md:gap-4">
            <StatusItem icon={<Zap className="h-6 w-6" />} label="Power" value={99} unit="%" />
            <StatusItem icon={<Fuel className="h-6 w-6" />} label="Fuel" value={98} unit="%" />
            <StatusItem icon={<Compass className="h-6 w-6" />} label="Gyroscope" value="Online" />
            <StatusItem 
                icon={<AlertTriangle className="h-6 w-6" />} 
                label="Proximity" 
                value={gravityWarning ? 'ALERT' : 'Clear'}
                variant={gravityWarning ? 'danger' : 'default'}
             />
             <StatusItem 
                icon={<div className="h-6 w-6 text-sm font-bold flex items-center justify-center">K</div>}
                label="Kessler Risk"
                value={kesslerScore}
                unit="%"
                variant={kesslerScore > 15 ? 'warning' : 'default'}
            />
        </div>
    </div>
  );
}
