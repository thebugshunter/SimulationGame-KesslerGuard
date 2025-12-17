
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { OrbitalSyncApp } from '@/components/game/orbital-sync-app';
import { GameHeader } from '@/components/ui/game-header';
import { PlaceHolderAudio } from '@/lib/placeholder-audio';
import type { AudioPlaceholder } from '@/lib/placeholder-audio';

// Helper to find audio URL by ID
const getAudioUrl = (id: string) => PlaceHolderAudio.find(a => a.id === id)?.audioUrl;

export default function Home() {
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const playAudio = useCallback((audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.muted = isSoundMuted;
      if (!isSoundMuted) {
        audio.play().catch(e => console.error(`Audio play failed for ${audio.id}:`, e));
      }
    }
  }, [isSoundMuted]);

  const handleStartMission = useCallback(() => {
    // Start ambient sound, but respect the muted state.
    const ambientAudio = audioRefs.current.ambient;
    if (ambientAudio) {
      ambientAudio.muted = isSoundMuted;
      if (!isSoundMuted) {
          ambientAudio.play().catch(e => console.error('Ambient audio play failed:', e));
      }
    }
  }, [isSoundMuted]);

  // Effect to handle audio playback when isSoundMuted changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = isSoundMuted;
        if (!isSoundMuted && audio.loop) {
          playAudio(audio);
        } else if (isSoundMuted) {
          audio.pause();
        }
      }
    });
  }, [isSoundMuted, playAudio]);


  const onToggleSound = useCallback(() => {
    setIsSoundMuted(prevMuted => !prevMuted);
  }, []);

  const playClickSound = useCallback(() => {
    const clickAudio = audioRefs.current.click;
    if (clickAudio && !isSoundMuted) {
      clickAudio.currentTime = 0;
      playAudio(clickAudio);
    }
  }, [isSoundMuted, playAudio]);

  const updateProximityVolume = useCallback((distance: number | null) => {
    const proximityAudio = audioRefs.current.proximity;
    if (!proximityAudio) return;

    if (isSoundMuted || distance === null || distance > 30) {
      proximityAudio.volume = 0;
    } else {
      const volume = Math.max(0, 1 - (distance / 30));
      proximityAudio.volume = volume;
    }
  }, [isSoundMuted]);

  const updateThrottleSound = useCallback((thrust: number) => {
    const throttleAudio = audioRefs.current.throttle;
    if (!throttleAudio) return;

    if (isSoundMuted || thrust <= 0) {
        throttleAudio.volume = 0;
        return;
    }
    const volume = Math.max(0, Math.min(1, thrust)) * 0.7; // Max volume 70%
    throttleAudio.volume = volume;
  }, [isSoundMuted]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    console.error(`Audio Error: Failed to load sound for ${target.id}. URL: ${target.currentSrc}`);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-body text-foreground">
      {isClient && (
        <>
          <audio 
            id="audio-ambient"
            ref={el => (audioRefs.current.ambient = el)} 
            src={getAudioUrl('space-ambient')} 
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.ambient) audioRefs.current.ambient.volume = 0.3; }}
            onError={handleAudioError}
          />
          <audio 
            id="audio-scan"
            ref={el => (audioRefs.current.scan = el)} 
            src={getAudioUrl('scan-effect')} 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.scan) audioRefs.current.scan.volume = 0.8; }}
            onError={handleAudioError}
          />
          <audio 
            id="audio-proximity"
            ref={el => (audioRefs.current.proximity = el)} 
            src={getAudioUrl('proximity-hum')} 
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.proximity) audioRefs.current.proximity.volume = 0; }}
            onError={handleAudioError}
          />
          <audio 
            id="audio-click"
            ref={el => (audioRefs.current.click = el)} 
            src={getAudioUrl('ui-click')} 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.click) audioRefs.current.click.volume = 0.5; }}
            onError={handleAudioError}
          />
          <audio 
            id="audio-throttle"
            ref={el => (audioRefs.current.throttle = el)} 
            src={getAudioUrl('ship-throttle')} 
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.throttle) audioRefs.current.throttle.volume = 0; }}
            onError={handleAudioError}
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
        onStartMission={handleStartMission}
      />
    </main>
  );
}
