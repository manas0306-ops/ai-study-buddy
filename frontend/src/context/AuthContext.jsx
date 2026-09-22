import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    username: 'learner',
    full_name: 'Alex Johnson',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=studybuddy',
    xp: 1240,
    level: 4,
    streak_days: 7,
    preferred_language: 'English',
    preferred_difficulty: 'Intermediate'
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if first time user
    const onboarded = localStorage.getItem('study_buddy_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }

    // Fetch initial user dashboard stats
    api.getDashboard()
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.log('Dashboard init fallback to default user state:', err));
  }, []);

  // Web Audio API tone generator (zero external assets needed)
  const playSound = (type = 'success') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'level_up') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const addXP = (amount) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.max(1, 1 + Math.floor(Math.sqrt(newXP / 250)));
      if (newLevel > prev.level) {
        playSound('level_up');
      } else {
        playSound('success');
      }
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const completeOnboarding = (preferences) => {
    setUser(prev => ({ ...prev, ...preferences }));
    localStorage.setItem('study_buddy_onboarded', 'true');
    setShowOnboarding(false);
    playSound('level_up');
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      addXP,
      soundEnabled,
      setSoundEnabled,
      playSound,
      showOnboarding,
      setShowOnboarding,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
