
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { OrbitalSyncApp } from '@/components/game/orbital-sync-app';
import { GameHeader } from '@/components/ui/game-header';
import { PlaceHolderAudio } from '@/lib/placeholder-audio';
import type { AudioPlaceholder } from '@/lib/placeholder-audio';

export default function Home() {
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
    ambient: null,
    scan: null,
    proximity: null,
    click: null,
    throttle: null,
  });

  // This effect runs ONLY once on the client-side after the component mounts to create the audio objects.
  useEffect(() => {
    // Guard against running on the server
    if (typeof window === 'undefined') return;

    // A function to handle the first user interaction to enable audio
    const playInitialSounds = () => {
      if (!isSoundMuted) {
        const ambient = audioRefs.current.ambient;
        const proximity = audioRefs.current.proximity;
        const throttle = audioRefs.current.throttle;

        if (ambient && ambient.paused) {
          ambient.play().catch(e => console.error("Ambient play failed:", e));
        }
        if (proximity && proximity.paused) {
          proximity.play().catch(e => console.error("Proximity play failed:", e));
        }
        if (throttle && throttle.paused) {
          throttle.play().catch(e => console.error("Throttle play failed:", e));
        }
      }
      // Remove the event listener after the first interaction
      window.removeEventListener('click', playInitialSounds);
      window.removeEventListener('keydown', playInitialSounds);
    };

    // Initialize all audio elements safely.
    if (!audioRefs.current.ambient) {
      const ambientData = PlaceHolderAudio.find(a => a.id === 'space-ambient');
      if (ambientData?.audioUrl) {
        try {
          const audio = new Audio(ambientData.audioUrl);
          audio.loop = true;
          audio.volume = 0.3;
          audio.preload = 'auto';
          audioRefs.current.ambient = audio;
        } catch (e) {
          console.error("Failed to create ambient audio:", e);
        }
      }
    }
    
    if (!audioRefs.current.scan) {
      const scanData = PlaceHolderAudio.find(a => a.id === 'scan-effect');
      if(scanData?.audioUrl) {
        try {
          const audio = new Audio(scanData.audioUrl);
          audio.volume = 0.8;
          audio.preload = 'auto';
          audioRefs.current.scan = audio;
        } catch(e) {
          console.error("Failed to create scan audio:", e);
        }
      }
    }
    
    if (!audioRefs.current.proximity) {
      const proximityData = PlaceHolderAudio.find(a => a.id === 'proximity-hum');
      if (proximityData?.audioUrl) {
         try {
          const audio = new Audio(proximityData.audioUrl);
          audio.loop = true;
          audio.volume = 0; // Start silent
          audio.preload = 'auto';
          audioRefs.current.proximity = audio;
        } catch(e) {
          console.error("Failed to create proximity audio:", e);
        }
      }
    }
    
    if (!audioRefs.current.click) {
      const clickData = PlaceHolderAudio.find(a => a.id === 'ui-click');
      if (clickData?.audioUrl) {
        try {
          const audio = new Audio(clickData.audioUrl);
          audio.volume = 0.5;
          audio.preload = 'auto';
          audioRefs.current.click = audio;
        } catch (e) {
          console.error("Failed to create click audio:", e);
        }
      }
    }

    if (!audioRefs.current.throttle) {
      const throttleData = PlaceHolderAudio.find(a => a.id === 'ship-throttle');
      if (throttleData?.audioUrl) {
        try {
          const audio = new Audio(throttleData.audioUrl);
          audio.loop = true;
          audio.volume = 0; // Start silent
          audio.preload = 'auto';
          audioRefs.current.throttle = audio;
        } catch (e) {
          console.error("Failed to create throttle audio:", e);
        }
      }
    }
    
    window.addEventListener('click', playInitialSounds);
    window.addEventListener('keydown', playInitialSounds);

    // Cleanup function to stop all sounds and remove listeners when component unmounts
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = ''; 
        }
      });
      window.removeEventListener('click', playInitialSounds);
      window.removeEventListener('keydown', playInitialSounds);
    };
  // The empty dependency array is CRITICAL here. It ensures this effect runs only ONCE.
  }, []); 

  // This effect handles muting/unmuting.
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = isSoundMuted;
      }
    });
  }, [isSoundMuted]);

  const onToggleSound = useCallback(() => {
    setIsSoundMuted(prevMuted => {
        const isNowMuted = !prevMuted;
        const ambient = audioRefs.current.ambient;
        if(ambient) {
            if (isNowMuted) {
                if (!ambient.paused) ambient.pause();
            } else {
                if (ambient.paused) {
                    ambient.play().catch(e => {});
                }
            }
        }
        return isNowMuted;
    });
  }, []);

  const playClickSound = useCallback(() => {
    const clickAudio = audioRefs.current.click;
    if (!isSoundMuted && clickAudio) {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(e => {});
    }
  }, [isSoundMuted]);

  // Function to be passed down to control proximity sound
  const updateProximityVolume = (distance: number | null) => {
    const proximityAudio = audioRefs.current.proximity;
    if (!proximityAudio || isSoundMuted) {
      if (proximityAudio && proximityAudio.volume > 0) proximityAudio.volume = 0;
      return;
    }

    if (distance === null || distance > 30) {
        if (proximityAudio.volume > 0) proximityAudio.volume = 0;
    } else {
        const volume = Math.max(0, 1 - (distance / 30));
        proximityAudio.volume = volume;
    }
  };

  const updateThrottleSound = useCallback((thrust: number) => {
    const throttleAudio = audioRefs.current.throttle;
    if (!throttleAudio || isSoundMuted) {
        if (throttleAudio && throttleAudio.volume > 0) throttleAudio.volume = 0;
        return;
    }
    const volume = Math.max(0, Math.min(1, thrust)) * 0.7; // Max volume 70%
    throttleAudio.volume = volume;
  }, [isSoundMuted]);


  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-body text-foreground">
      <GameHeader isSoundMuted={isSoundMuted} onToggleSound={onToggleSound} />
      <OrbitalSyncApp 
        audioRefs={audioRefs} 
        isSoundMuted={isSoundMuted}
        updateProximityVolume={updateProximityVolume}
        updateThrottleSound={updateThrottleSound}
        playClickSound={playClickSound}
      />
    </main>
  );
}
