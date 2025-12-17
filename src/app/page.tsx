
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

  const playAudio = useCallback((audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.muted = isSoundMuted;
      if (!isSoundMuted) {
        audio.play().catch(e => console.error(`Audio play failed for ${audio.id}:`, e));
      }
    }
  }, [isSoundMuted]);

  const handleStartMission = useCallback(() => {
    // This is called when the learning modal is closed.
    // We will start the ambient and proximity sounds here, but they will obey the mute state.
    const ambientAudio = audioRefs.current.ambient;
    const proximityAudio = audioRefs.current.proximity;
    const throttleAudio = audioRefs.current.throttle;
    
    if (ambientAudio) {
      ambientAudio.muted = isSoundMuted;
      if (ambientAudio.paused) ambientAudio.play().catch(e => {}); 
    }
    if (proximityAudio) {
      proximityAudio.muted = isSoundMuted;
      if (proximityAudio.paused) proximityAudio.play().catch(e => {});
    }
    if (throttleAudio) {
        throttleAudio.muted = isSoundMuted;
        if (throttleAudio.paused) throttleAudio.play().catch(e => {});
    }
    setIsLearningModalOpen(false);
  }, [isSoundMuted]);

  // Effect to handle audio playback when isSoundMuted changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        const wasMuted = audio.muted;
        audio.muted = isSoundMuted;
        
        // If unmuting, and the audio is a looping one that should be playing, start it.
        if (wasMuted && !isSoundMuted && audio.loop && !isLearningModalOpen && audio.paused) {
            audio.play().catch(e => console.error(`Audio play failed for ${audio.id}:`, e));
        } else if (!wasMuted && isSoundMuted) {
            // If it's a looping sound, we pause it when muted.
            if(audio.loop) {
                audio.pause();
            }
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
        if (!throttleAudio.paused) {
            throttleAudio.pause();
        }
        return;
    }

    if (throttleAudio.paused) {
        throttleAudio.play().catch(e => {});
    }
    const volume = Math.max(0, Math.min(1, thrust)) * 0.7; // Max volume 70%
    throttleAudio.volume = volume;
  }, [isSoundMuted]);


  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-body text-foreground">
      {isClient && (
        <>
          <audio 
            id="audio-ambient"
            ref={el => (audioRefs.current.ambient = el)} 
            src="https://cdn.pixabay.com/download/audio/2022/10/14/audio_39a88ce387.mp3" 
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.ambient) audioRefs.current.ambient.volume = 0.3; }}
          />
          <audio 
            id="audio-scan"
            ref={el => (audioRefs.current.scan = el)} 
            src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_e7b5603123.mp3" 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.scan) audioRefs.current.scan.volume = 0.8; }}
          />
          <audio 
            id="audio-proximity"
            ref={el => (audioRefs.current.proximity = el)} 
            src="https://cdn.pixabay.com/download/audio/2023/09/25/audio_18082f3a28.mp3" 
            loop 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.proximity) audioRefs.current.proximity.volume = 0; }}
          />
          <audio 
            id="audio-click"
            ref={el => (audioRefs.current.click = el)} 
            src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_2b28b0a317.mp3" 
            preload="auto"
            onLoadedData={() => { if(audioRefs.current.click) audioRefs.current.click.volume = 0.5; }}
          />
          <audio 
            id="audio-throttle"
            ref={el => (audioRefs.current.throttle = el)} 
            src="https://cdn.pixabay.com/download/audio/2024/03/26/audio_4a840b1535.mp3" 
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
