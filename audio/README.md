# Audio Assets

Place any MP3 audio file named `bad_boys.mp3` inside this `audio/` directory.

When `bad_boys.mp3` is present, `js/chaos/reverseAudio.js` will automatically fetch the track, decode all audio channels (including vocals and lyrics), and **reverse the entire audio track in real-time** for the chaos feature!

If no MP3 file is present, `reverseAudio.js` automatically falls back to its built-in Web Audio synthesized "Bad Boys" reggae theme generator.
