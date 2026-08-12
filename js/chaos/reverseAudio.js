import { isChaosActive } from '../config.js';

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let isStarted = false;
let isMuted = false;

function createAudioBuffers(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 8;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const bpm = 124;
  const beatTime = 60 / bpm;
  const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63];
  const bassNotes = [130.81, 130.81, 164.81, 174.61];

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const beatIndex = Math.floor(t / (beatTime / 2)) % notes.length;
    const bassIndex = Math.floor(t / (beatTime * 2)) % bassNotes.length;

    const freq = notes[beatIndex];
    const bassFreq = bassNotes[bassIndex];

    const notePhase = (t % (beatTime / 2)) / (beatTime / 2);
    const env = Math.exp(-notePhase * 4);

    const valSynth = (Math.sin(2 * Math.PI * freq * t) * 0.5 + ((t * freq % 1) - 0.5) * 0.5) * env;
    const valBass = Math.sin(2 * Math.PI * bassFreq * t) * 0.6;
    const valNoise = (Math.random() * 2 - 1) * Math.exp(-((t % (beatTime / 2)) / (beatTime / 2)) * 20) * 0.15;

    const mix = (valSynth * 0.4 + valBass * 0.4 + valNoise) * 0.25;
    left[i] = mix;
    right[i] = mix;
  }

  // Create reversed clone
  const reversedBuffer = ctx.createBuffer(2, length, sampleRate);
  const rLeft = reversedBuffer.getChannelData(0);
  const rRight = reversedBuffer.getChannelData(1);
  rLeft.set(left);
  rRight.set(right);
  rLeft.reverse();
  rRight.reverse();

  return { forward: buffer, reversed: reversedBuffer };
}

let cachedBuffers = null;

function startBGM() {
  if (isStarted) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    cachedBuffers = createAudioBuffers(audioCtx);
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(isMuted ? 0 : 0.18, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);

    playLoop();
    isStarted = true;

    // Periodically re-sync loop mode when bounty status changes
    setInterval(() => {
      if (!isStarted || !audioCtx) return;
      playLoop();
    }, 8000);
  } catch (e) {
    console.warn('[ANTICOACH] Reverse BGM Web Audio error:', e);
  }
}

function playLoop() {
  if (!audioCtx || !cachedBuffers) return;
  if (sourceNode) {
    try { sourceNode.stop(); } catch (e) {}
  }

  const active = isChaosActive('reverseAudio');
  const activeBuffer = active ? cachedBuffers.reversed : cachedBuffers.forward;

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
    btn.textContent = active ? '🎵 BGM: Reverse Audio' : '🎵 BGM: Forward Audio';
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
        gainNode.gain.setValueAtTime(isMuted ? 0 : 0.18, audioCtx.currentTime);
      }
      updateBtnLabel();
    });
  }

  updateBtnLabel();
}
