'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gta6_preload_nov10_toast_dismissed';

export default function PreloadNotificationToast({
  onSwitchToPreload,
  onEnableAlerts,
  notificationsEnabled,
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check dismissal and trigger entrance with slight async delay
    const timer = setTimeout(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
          setDismissed(true);
          return;
        }
      } catch {
        /* silent */
      }
      setVisible(true);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* silent */
    }
    setTimeout(() => setDismissed(true), 350);
  };

  const handleSwitchTarget = () => {
    if (onSwitchToPreload) {
      onSwitchToPreload();
    }
    // Also smooth scroll down to main countdown timer stage
    const timerStage =
      document.getElementById('tab-preload') || document.querySelector('.main-timer-stage');
    if (timerStage) {
      timerStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Expose function on window so user or button can re-open it anytime
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__showPreloadAnnouncement = () => {
        setDismissed(false);
        setVisible(true);
      };
    }
  }, []);

  if (dismissed && !visible) return null;

  return (
    <div
      className={`preload-toast ${visible ? 'preload-toast--visible' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="preload-toast__backdrop" onClick={handleDismiss} />
      <div className="preload-toast__card glass-card">
        {/* Glow ambient background accent */}
        <div className="preload-toast__glow" aria-hidden="true" />

        {/* Top bar with badge and close */}
        <div className="preload-toast__header">
          <div className="preload-toast__badge">
            <span className="preload-toast__beacon" />
            <span className="preload-toast__badge-text">OFFICIAL CONFIRMATION</span>
          </div>

          <button
            type="button"
            className="preload-toast__close"
            onClick={handleDismiss}
            aria-label="Close announcement"
            title="Dismiss notification"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="preload-toast__content">
          <div className="preload-toast__icon-col">
            <div className="preload-toast__icon-wrap">
              <span className="preload-toast__icon" role="img" aria-label="Alert">
                🚨
              </span>
            </div>
          </div>

          <div className="preload-toast__text-col">
            <h3 className="preload-toast__title">Pre-Load Date Officially Confirmed!</h3>
            <p className="preload-toast__date-callout">
              📅 <strong>November 10, 2026 at 00:00</strong> (Local Time)
            </p>
            <p className="preload-toast__desc">
              GTA VI pre-load is officially locked in for midnight on November 10 — giving players 9
              full days to download ahead of the November 19 launch. All countdowns and alerts have
              been updated!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="preload-toast__actions">
          <button
            type="button"
            className="preload-toast__btn preload-toast__btn--primary"
            onClick={handleSwitchTarget}
          >
            <span>⏱️ View Pre-Load Clock</span>
          </button>

          {!notificationsEnabled && onEnableAlerts && (
            <button
              type="button"
              className="preload-toast__btn preload-toast__btn--secondary"
              onClick={onEnableAlerts}
            >
              <span>🔔 Enable Launch Alerts</span>
            </button>
          )}

          <button
            type="button"
            className="preload-toast__btn preload-toast__btn--ghost"
            onClick={handleDismiss}
          >
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
}
