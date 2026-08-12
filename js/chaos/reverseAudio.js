import { isChaosActive } from '../config.js';

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let isStarted = false;
let isMuted = false;
let audioBuffers = null; // { forward: AudioBuffer, reversed: AudioBuffer }

const SONG_URLS = [
  './audio/bad_boys.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73562.mp3'
];

async function loadSongBuffers(ctx) {
  for (const url of SONG_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      const forwardBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Create reversed clone (reverses full song + vocals!)
      const reversedBuffer = ctx.createBuffer(
        forwardBuffer.numberOfChannels,
        forwardBuffer.length,
        forwardBuffer.sampleRate
      );

      for (let ch = 0; ch < forwardBuffer.numberOfChannels; ch++) {
        const fData = forwardBuffer.getChannelData(ch);
        const rData = reversedBuffer.getChannelData(ch);
        rData.set(fData);
        rData.reverse();
      }

      console.log('[ANTICOACH] Loaded song track with reversed vocals successfully!');
      return { forward: forwardBuffer, reversed: reversedBuffer };
    } catch (err) {
      console.warn(`[ANTICOACH] Could not load song from ${url}:`, err);
    }
  }

  // Fallback to Web Audio synthesized Bad Boys theme
  return createSynthFallbackBuffers(ctx);
}

function createSynthFallbackBuffers(ctx) {
  const sampleRate = ctx.sampleRate;
  const bpm = 132;
  const eighthTime = (60 / bpm) / 2;
  const totalEighths = 32;
  const duration = totalEighths * eighthTime;
  const length = Math.floor(sampleRate * duration);

  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const G4 = 392.00, A4 = 440.00, Bb4 = 466.16, F4 = 349.23, D4 = 293.66, C5 = 523.25;
  const G3 = 196.00, F3 = 174.61, Eb3 = 155.56, D3 = 146.83;

  const melody = [
    G4, G4, A4, Bb4, G4, 0, G4, Bb4,
    F4, F4, G4, A4, F4, 0, F4, A4,
    G4, G4, A4, Bb4, G4, 0, Bb4, C5,
    F4, G4, A4, F4, G4, G4, 0, 0
  ];

  const bass = [
    G3, 0, G3, D3, G3, 0, G3, D3,
    F3, 0, F3, Eb3, F3, 0, F3, D3,
    G3, 0, G3, D3, G3, 0, G3, D3,
    F3, 0, F3, A4, G3, 0, G3, 0
  ];

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const step = Math.floor(t / eighthTime) % totalEighths;
    const stepPhase = (t % eighthTime) / eighthTime;

    const mFreq = melody[step];
    const bFreq = bass[step];

    const isOffbeat = (step % 2 === 1);
    const skankEnv = isOffbeat ? Math.exp(-stepPhase * 8) : 0;
    const valSkank = (Math.sin(2 * Math.PI * G4 * t) + Math.sin(2 * Math.PI * Bb4 * t)) * 0.2 * skankEnv;

    let valMelody = 0;
    if (mFreq > 0) {
      const mEnv = Math.exp(-stepPhase * 3.5);
      valMelody = (Math.sin(2 * Math.PI * mFreq * t) * 0.6 + ((t * mFreq % 1) - 0.5) * 0.4) * mEnv;
    }

    let valBass = 0;
    if (bFreq > 0) {
      const bEnv = Math.exp(-stepPhase * 2.5);
      valBass = (Math.sin(2 * Math.PI * bFreq * t) * 0.7 + Math.sin(4 * Math.PI * bFreq * t) * 0.3) * bEnv;
    }

    const isRimshot = (step % 4 === 2);
    const rimEnv = isRimshot ? Math.exp(-stepPhase * 18) : 0;
    const valPerc = (Math.random() * 2 - 1) * rimEnv * 0.2;

    const mix = (valMelody * 0.45 + valBass * 0.45 + valSkank * 0.3 + valPerc) * 0.3;
    left[i] = mix;
    right[i] = mix;
  }

  const reversedBuffer = ctx.createBuffer(2, length, sampleRate);
  const rLeft = reversedBuffer.getChannelData(0);
  const rRight = reversedBuffer.getChannelData(1);
  rLeft.set(left);
  rRight.set(right);
  rLeft.reverse();
  rRight.reverse();

  return { forward: buffer, reversed: reversedBuffer };
}

async function startBGM() {
  if (isStarted) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(isMuted ? 0 : 0.25, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);

    audioBuffers = await loadSongBuffers(audioCtx);
    playLoop();
    isStarted = true;

    setInterval(() => {
      if (!isStarted || !audioCtx) return;
      playLoop();
    }, 12000);
  } catch (e) {
    console.warn('[ANTICOACH] Reverse BGM Web Audio error:', e);
  }
}

function playLoop() {
  if (!audioCtx || !audioBuffers) return;
  if (sourceNode) {
    try { sourceNode.stop(); } catch (e) {}
  }

  const active = isChaosActive('reverseAudio');
  const activeBuffer = active ? audioBuffers.reversed : audioBuffers.forward;

  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = activeBuffer;
  sourceNode.loop = true;
  sourceNode.connect(gainNode);
  sourceNode.start(0);

  updateBtnLabel();
}

function updateBtnLabel() {
  const btn = document.getElementById('bgm-toggle');
  if (!btn) return;
  const active = isChaosActive('reverseAudio');
  if (isMuted) {
    btn.textContent = '🔇 BGM: Muted';
  } else {
    btn.textContent = active ? '🎵 Reversed "Bad Boys" Song' : '🎵 "Bad Boys" Song (Fixed)';
  }
}

export function init() {
  const btn = document.getElementById('bgm-toggle');

  const triggerAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startBGM();
  };

  ['click', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, triggerAudio, { once: true });
  });

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerAudio();
      isMuted = !isMuted;
      if (gainNode) {
        gainNode.gain.setValueAtTime(isMuted ? 0 : 0.25, audioCtx.currentTime);
      }
      updateBtnLabel();
    });
  }

  updateBtnLabel();
}
