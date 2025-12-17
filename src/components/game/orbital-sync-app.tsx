
'use client';

import { useState, useRef, useCallback } from 'react';
import { Scene } from './scene';
import { PodDashboard } from '@/components/ui/pod-dashboard';
import { Terminal } from '@/components/ui/terminal';
import type { SpaceObject, SpaceObjectType } from '@/lib/space-objects';
import { useGameControls } from '@/hooks/use-game-controls';
import { JoystickControls } from '@/components/ui/joystick-controls';

export type ActiveTool = 'Scan' | 'Magnet' | 'Burner' | null;
export type JoystickMode = 'move' | 'look' | null;

interface OrbitalSyncAppProps {
  audioRefs: React.MutableRefObject<{ [key: string]: HTMLAudioElement | null }>;
  isSoundMuted: boolean;
  updateProximityVolume: (distance: number | null) => void;
  updateThrottleSound: (thrust: number) => void;
  playClickSound: () => void;
}

const initialFilters = {
  Debris: true,
  Satellite: true,
  Asteroid: true,
  Comet: true,
};

export function OrbitalSyncApp({ audioRefs, isSoundMuted, updateProximityVolume, updateThrottleSound, playClickSound }: OrbitalSyncAppProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null);
  const [scanResults, setScanResults] = useState<SpaceObject[]>([]);
  const [filters, setFilters] = useState<Record<SpaceObjectType, boolean>>(initialFilters);
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  
  const controls = useGameControls({
    targetRef: sceneRef, 
    updateThrottleSound, 
    activeTool,
    onScan: () => {
        const scanAudio = audioRefs.current.scan;
        if (scanAudio && !isSoundMuted) {
          scanAudio.currentTime = 0;
          scanAudio.play().catch(e => {});
        }
    }
  });

  const handleToggleTerminal = () => {
    setIsTerminalOpen(prev => !prev);
    playClickSound();
  };

  const handleToolToggle = (tool: ActiveTool) => {
    const newTool = activeTool === tool ? null : tool;
    setActiveTool(newTool);
    playClickSound();
  };

  const handleSelectObject = (object: SpaceObject | null) => {
    setSelectedObject(object);
    if(object !== null) {
      playClickSound();
    }
  }

  const handleFilterChange = (objectType: SpaceObjectType, isVisible: boolean) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [objectType]: isVisible,
    }));
    playClickSound();
  };

  const setMoveJoystickState = useCallback((x: number, y: number) => {
    controls.setMoveJoystickState(x, y);
  }, [controls]);

  const setLookJoystickState = useCallback((x: number, y: number) => {
    controls.setLookJoystickState(x, y);
  }, [controls]);


  return (
    <>
      <div className="absolute inset-0" ref={sceneRef}>
        <Scene 
          setSelectedObject={handleSelectObject} 
          controls={controls} 
          setScanResults={setScanResults}
          updateProximityVolume={updateProximityVolume}
          selectedObjectId={selectedObject?.id ?? null}
          filters={filters}
        />
      </div>
      
      {/* Unified Bottom Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-1 md:gap-4 md:p-4">
          {/* Left Joystick */}
          <div className="pointer-events-auto shrink-0">
              <JoystickControls 
                  onJoystickMove={setMoveJoystickState}
                  label="Move"
              />
          </div>
          
          {/* Center Dashboard - takes up remaining space */}
          <div className="pointer-events-auto flex-1 pb-1 md:pb-0 min-w-0">
              <PodDashboard 
                  onToggleTerminal={handleToggleTerminal} 
                  onToolToggle={handleToolToggle}
                  activeTool={activeTool}
                  playClickSound={playClickSound}
              />
          </div>

          {/* Right Joystick */}
          <div className="pointer-events-auto shrink-0">
               <JoystickControls 
                  onJoystickMove={setLookJoystickState} 
                  label="Look"
              />
          </div>
      </div>

      <div className="pointer-events-auto">
        <Terminal 
          isOpen={isTerminalOpen} 
          selectedObject={selectedObject}
          scanResults={scanResults}
          playClickSound={playClickSound}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
}
