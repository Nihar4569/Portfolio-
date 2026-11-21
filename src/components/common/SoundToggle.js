import React from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useSound } from '../../context/SoundContext';

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound();
  const Icon = soundEnabled ? FiVolume2 : FiVolumeX;

  return (
    <button className="portfolio-sound-switch" type="button" data-sound="off" onClick={toggleSound}
      aria-pressed={soundEnabled} aria-label="Sound effects" title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}>
      <Icon aria-hidden="true" />
    </button>
  );
}
