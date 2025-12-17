
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { OrbitalSyncApp } from '@/components/game/orbital-sync-app';
import { GameHeader } from '@/components/ui/game-header';
import { PlaceHolderAudio } from '@/lib/placeholder-audio';
import type { AudioPlaceholder } from '@/lib/placeholder-audio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Helper to find audio URL by ID
const getAudioUrl = (id: string) => PlaceHolderAudio.find(a => a.id === id)?.audioUrl;

export default function Home() {
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const playAudio = (audio: HTMLAudioElement | null) => {
    if (audio && !isSoundMuted) {
      audio.play().catch(e => console.error(`Audio play failed for ${audio.id}:`, e));
    }
  };

  const handleStartMission = () => {
    setShowStartScreen(false);
    setIsSoundMuted(false); // Unmute on start
    
    // This is the critical part: play looping audio after user interaction
    Object.values(audioRefs.current).forEach(audio => {
        if(audio?.loop && !isSoundMuted) {
            playAudio(audio);
        }
    });
  };

  const onToggleSound = useCallback(() => {
    setIsSoundMuted(prevMuted => {
      const isNowMuted = !prevMuted;
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.muted = isNowMuted;
          if (isNowMuted) {
            audio.pause();
          } else if (audio.loop) {
            playAudio(audio); // If unmuting, resume looping sounds
          }
        }
      });
      return isNowMuted;
    });
  }, []);

  const playClickSound = useCallback(() => {
    const clickAudio = audioRefs.current.click;
    if (clickAudio && !isSoundMuted) {
      clickAudio.currentTime = 0;
      playAudio(clickAudio);
    }
  }, [isSoundMuted]);

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
      />

      <Dialog open={showStartScreen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-md border-accent/50" hideCloseButton>
            <DialogHeader>
                <DialogTitle className="font-headline text-accent text-2xl">OrbitalSync Initiative</DialogTitle>
                <DialogDescription>
                    Your mission is critical. Pilot your cleanup pod, manage space debris, and prevent the Kessler Syndrome. The future of space exploration is in your hands.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={handleStartMission} className="w-full bg-accent text-background hover:bg-accent/90">Start Mission</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
