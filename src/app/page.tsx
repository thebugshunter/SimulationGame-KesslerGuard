
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { KesslerGuardApp } from '@/components/game/kessler-guard-app';
import { GameHeader } from '@/components/ui/game-header';
import { LearningModal } from '@/components/ui/learning-modal';


export default function Home() {
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [isClient, setIsClient] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartMission = useCallback(() => {
    setIsLearningModalOpen(false);
    if (!isSoundMuted) {
      Object.values(audioRefs.current).forEach(audio => {
          if (audio && audio.loop && audio.paused) {
              audio.play().catch(e => {});
          }
      });
    }
  }, [isSoundMuted]);

  // Effect to handle audio playback when isSoundMuted changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = isSoundMuted;
        if (!isSoundMuted && audio.loop && audio.paused && !isLearningModalOpen) {
          audio.play().catch(e => {});
        } else if (isSoundMuted) { // Always pause if muted
          audio.pause();
        }
      }
    });
  }, [isSoundMuted, isLearningModalOpen]);


  const onToggleSound = useCallback(() => {
    setIsSoundMuted(prevMuted => !prevMuted);
  }, []);

  const playClickSound = useCallback(() => {
    const clickAudio = audioRefs.current.click;
    if (clickAudio && !isSoundMuted) {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(e => {});
    }
  }, [isSoundMuted]);

  const updateProximityVolume = useCallback((distance: number | null) => {
    const proximityAudio = audioRefs.current.proximity;
    if (!proximityAudio) return;

    if (distance === null || distance > 30) {
      proximityAudio.volume = 0;
    } else {
      const volume = Math.max(0, 1 - (distance / 30));
      proximityAudio.volume = volume;
    }
  }, []);

  const updateThrottleSound = useCallback((thrust: number) => {
    const throttleAudio = audioRefs.current.throttle;
    if (!throttleAudio) return;

    if (thrust <= 0) {
        if (!throttleAudio.paused) {
          throttleAudio.volume = 0;
          // A brief fade out
          setTimeout(() => {
            if (throttleAudio.volume === 0) throttleAudio.pause();
          }, 200);
        }
        return;
    }

    if (throttleAudio.paused) {
        throttleAudio.play().catch(e => {});
    }
    const volume = Math.max(0, Math.min(1, thrust)) * 0.7; // Max volume 70%
    throttleAudio.volume = volume;
  }, []);
  
  const handleToggleTerminal = () => {
    setIsTerminalOpen(prev => !prev);
    playClickSound();
  };


  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-body text-foreground">
      {isClient && (
        <>
          <audio 
            id="audio-ambient"
            ref={el => (audioRefs.current.ambient = el)} 
            src="/audio/deep-space.mp3" 
            loop 
            preload="auto"
            onLoadedData={(e) => { if(e.currentTarget) e.currentTarget.volume = 0.3; }}
          />
          <audio 
            id="audio-scan"
            ref={el => (audioRefs.current.scan = el)} 
            src="/audio/scanner-beep.mp3"
            preload="auto"
            onLoadedData={(e) => { if(e.currentTarget) e.currentTarget.volume = 0.8; }}
          />
          <audio 
            id="audio-proximity"
            ref={el => (audioRefs.current.proximity = el)} 
            src="/audio/proximity-hum.mp3"
            loop 
            preload="auto"
            onLoadedData={(e) => { if(e.currentTarget) e.currentTarget.volume = 0; }}
          />
          <audio 
            id="audio-click"
            ref={el => (audioRefs.current.click = el)} 
            src="/audio/ui-click.mp3" 
            preload="auto"
            onLoadedData={(e) => { if(e.currentTarget) e.currentTarget.volume = 0.5; }}
          />
          <audio 
            id="audio-throttle"
            ref={el => (audioRefs.current.throttle = el)} 
            src="/audio/thruster-rumble.mp3"
            loop 
            preload="auto"
            onLoadedData={(e) => { if(e.currentTarget) e.currentTarget.volume = 0; }}
          />
           <audio
            id="audio-collision-alarm"
            ref={(el) => (audioRefs.current.collisionAlarm = el)}
            src="/audio/collision-alarm.mp3"
            loop
            preload="auto"
          />
        </>
      )}
      <GameHeader 
        isSoundMuted={isSoundMuted} 
        onToggleSound={onToggleSound} 
        onToggleTerminal={handleToggleTerminal}
      />
      <KesslerGuardApp 
        audioRefs={audioRefs} 
        isSoundMuted={isSoundMuted}
        updateProximityVolume={updateProximityVolume}
        updateThrottleSound={updateThrottleSound}
        playClickSound={playClickSound}
        isTerminalOpen={isTerminalOpen}
      />
       <LearningModal isOpen={isLearningModalOpen} onClose={handleStartMission} />
    </main>
  );
}
