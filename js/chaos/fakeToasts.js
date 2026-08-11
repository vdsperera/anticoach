import { isChaosActive } from '../config.js';

export function init() {
  const container = document.getElementById('toast-container');
  const messages = [
    "⚠ Your coach has left the session",
    "🏆 Achievement unlocked: Nothing",
    "📬 Someone else completed your goals for you",
    "💬 New message from your future self: don't bother",
    "📉 Your progress has been donated to charity",
    "🎙 Session recording failed. Good.",
    "⏰ Reminder: you haven't grown today",
    "🔔 Your potential called. It's not coming back.",
    "📋 Task completed: Procrastination",
    "🚪 Your comfort zone has expanded to fill the room",
    "🗑 Daily affirmation deleted",
    "🔄 Syncing failures across all devices..."
  ];

  function showToast() {
    if (!isChaosActive('fakeToasts')) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = messages[Math.floor(Math.random() * messages.length)];
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function scheduleNext() {
    const delay = (Math.random() * 15000) + 15000;
    setTimeout(() => {
      showToast();
      scheduleNext();
    }, delay);
  }

  setTimeout(showToast, 5000);
  scheduleNext();
}
