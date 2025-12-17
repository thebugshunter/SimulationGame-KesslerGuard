
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { OrbitalSyncApp } from '@/components/game/orbital-sync-app';
import { GameHeader } from '@/components/ui/game-header';
import { LearningModal } from '@/components/ui/learning-modal';


export default function Home() {
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [isClient, setIsClient] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartMission = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
        if (audio && audio.loop && audio.paused) {
            audio.play().catch(e => {}); // Attempt to play, will obey mute state
        }
    });
    setIsLearningModalOpen(false);
  }, []);

  // Effect to handle audio playback when isSoundMuted changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = isSoundMuted;
        if (!isSoundMuted && audio.loop && audio.paused && !isLearningModalOpen) {
          audio.play().catch(e => {});
        } else if (isSoundMuted && audio.loop && !audio.paused) {
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
            onLoadedData={() => { if(audioRefs.current.ambient) audioRefs.current.ambient.volume = 0.3; }}
          />
          <audio 
            id="audio-scan"
            ref={el => (audioRefs.current.scan = el)} 
            src="/audio/scanner-beep.mp3"
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.scan) audioRefs.current.scan.volume = 0.8; }}
          />
          <audio 
            id="audio-proximity"
            ref={el => (audioRefs.current.proximity = el)} 
            src="/audio/proximity-hum.mp3"
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.proximity) audioRefs.current.proximity.volume = 0; }}
          />
          <audio 
            id="audio-click"
            ref={el => (audioRefs.current.click = el)} 
            src="/audio/ui-click.mp3" 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.click) audioRefs.current.click.volume = 0.5; }}
          />
          <audio 
            id="audio-throttle"
            ref={el => (audioRefs.current.throttle = el)} 
            src="/audio/thruster-rumble.mp3"
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.throttle) audioRefs.current.throttle.volume = 0; }}
          />
        </>
      )}
      <GameHeader isSoundMuted={isSoundMuted} onToggleSound={onToggleSound} />
      <OrbitalSyncApp 
        audioRefs={audioRefs} 
        isSoundMuted={isSoundMuted}
        updateProximityVolume={updateProximityVolume}
        updateThrottleSound={updateThrottleSound}
        playClickSound={playClickSound}
      />
       <LearningModal isOpen={isLearningModalOpen} onClose={handleStartMission} />
    </main>
  );
}
