'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const sync = () => setPlaying(!audio.paused);
    const startFromIntro = () => {
      audio.play().then(() => setPlaying(true)).catch(() => undefined);
    };

    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    window.addEventListener('sixtynine:start-music', startFromIntro);

    return () => {
      audio.removeEventListener('play', sync);
      audio.removeEventListener('pause', sync);
      window.removeEventListener('sixtynine:start-music', startFromIntro);
    };
  }, []);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return <>
    <audio ref={audioRef} src="/music.mp3" loop preload="auto" aria-hidden="true" />
    <button className="music-toggle" type="button" onClick={toggleMusic} aria-label={playing ? 'Turn music off' : 'Turn music on'} title={playing ? 'Turn music off' : 'Turn music on'}>
      {playing ? <Volume2 /> : <VolumeX />}
      <span>{playing ? 'Music on' : 'Music off'}</span>
    </button>
  </>;
}
