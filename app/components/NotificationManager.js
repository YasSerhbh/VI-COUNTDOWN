'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_MILESTONES, milestoneToMs } from '../config/notifications';

const STORAGE_SETTINGS = 'gta6-notif-settings';
const STORAGE_FIRED = 'gta6-notif-fired';

function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    return raw ? JSON.parse(raw) : { enabled: false };
  } catch {
    return { enabled: false };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
  } catch { /* silent */ }
}

function getFiredMilestones() {
  try {
    const raw = localStorage.getItem(STORAGE_FIRED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addFiredMilestone(key) {
  const fired = getFiredMilestones();
  if (!fired.includes(key)) {
    fired.push(key);
    try {
      localStorage.setItem(STORAGE_FIRED, JSON.stringify(fired));
    } catch { /* silent */ }
  }
}

/**
 * Robust cross-device notification dispatcher.
 * Prioritizes ServiceWorkerRegistration.showNotification (required on Android & iOS PWA)
 * with graceful fallback to new Notification() constructor (desktop browsers).
 */
async function sendNotification(title, options = {}) {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const notificationOptions = {
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    ...options,
  };

  // 1. Try Service Worker showNotification with 800ms race fallback
  if ('serviceWorker' in navigator) {
    try {
      const swReadyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SW timeout')), 800)
      );
      const reg = await Promise.race([swReadyPromise, timeoutPromise]);
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return true;
      }
    } catch {
      // Fall through to window Notification constructor
    }
  }

  // 2. Direct Notification constructor fallback (standard desktop browsers)
  try {
    const notif = new Notification(title, notificationOptions);
    if (!options.requireInteraction) {
      setTimeout(() => notif.close(), 7000);
    }
    return true;
  } catch {
    return false;
  }
}

export default function NotificationManager({ releaseDate }) {
  const [permission, setPermission] = useState('default');
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [testStatus, setTestStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'blocked' | 'error'

  // Initialize client-side state
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      const settings = getSettings();
      setEnabled(settings.enabled && Notification.permission === 'granted');

      // Expose console helper for testing from DevTools on any device
      window.__testGtaNotification = (customText) => {
        return sendNotification('GTA VI Alert Test 🌴', {
          body: customText || 'This is a test notification from GTA VI Countdown! Notifications are working properly.',
          tag: `gta6-manual-test-${Date.now()}`,
        });
      };
    }
  }, []);

  // Background milestone checker — checks against app/config/notifications.js
  useEffect(() => {
    if (!enabled || !mounted) return;

    const checkMilestones = async () => {
      const now = Date.now();
      const remaining = releaseDate.getTime() - now;
      const fired = getFiredMilestones();

      for (const m of DEFAULT_MILESTONES) {
        if (fired.includes(m.key)) continue;

        const targetMs = milestoneToMs(m);
        if (remaining <= targetMs) {
          addFiredMilestone(m.key);
          await sendNotification(m.label, {
            body: m.desc,
            tag: `gta6-${m.key}`,
            requireInteraction: m.key === 'launch',
          });
        }
      }
    };

    checkMilestones();
    const intervalId = setInterval(checkMilestones, 60000);
    return () => clearInterval(intervalId);
  }, [enabled, mounted, releaseDate]);

  // Toggle notifications (User-facing action)
  const handleToggle = useCallback(async () => {
    if (!('Notification' in window)) return;

    if (!enabled) {
      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          setEnabled(true);
          saveSettings({ enabled: true });
          await sendNotification('Launch Alerts Activated 🌴', {
            body: "You'll be notified as release milestones approach and when GTA VI launches!",
            tag: 'gta6-activated',
          });
        }
      } else if (Notification.permission === 'granted') {
        setEnabled(true);
        saveSettings({ enabled: true });
      }
    } else {
      setEnabled(false);
      saveSettings({ enabled: false });
    }
  }, [enabled]);

  // Dedicated test notification trigger
  const handleTestAlert = useCallback(async () => {
    if (!('Notification' in window)) return;

    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        setEnabled(true);
        saveSettings({ enabled: true });
      }
    }

    if (perm !== 'granted') {
      setTestStatus('blocked');
      setTimeout(() => setTestStatus('idle'), 3500);
      return;
    }

    setTestStatus('sending');
    const success = await sendNotification('GTA VI Alert Test 🌴', {
      body: 'Notifications are live! You will be alerted when pre-load opens and when GTA VI officially launches.',
      tag: `gta6-test-${Date.now()}`,
    });

    if (success) {
      setTestStatus('sent');
      setTimeout(() => setTestStatus('idle'), 3000);
    } else {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3500);
    }
  }, []);

  if (!mounted) return null;

  const isSupported = 'Notification' in window;
  const isDenied = permission === 'denied';

  return (
    <section className="notif-section" id="notifications-section">
      {/* Section Header */}
      <div className="section-header">
        <span
          className="section-header__badge"
          style={{
            color: 'var(--vi-orange)',
            background: 'rgba(255,138,0,0.1)',
            borderColor: 'rgba(255,138,0,0.3)',
          }}
        >
          NOTIFICATIONS
        </span>
        <h2 className="section-header__title">Launch Alerts</h2>
        <p className="section-header__sub">
          Never miss a countdown milestone. Get notified automatically on the road to Vice City.
        </p>
      </div>

      {/* Public Alert Card */}
      <div className="notif-card glass-card">
        <div className="notif-card__enable-row">
          <div className="notif-card__enable-info">
            <div className={`notif-card__enable-icon-wrap ${enabled ? 'notif-card__enable-icon-wrap--active' : ''}`}>
              <svg
                className="notif-card__enable-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <div className="notif-card__title-row">
                <span className="notif-card__enable-title">
                  {!isSupported
                    ? 'Notifications Not Supported'
                    : isDenied
                    ? 'Notifications Blocked'
                    : enabled
                    ? 'Launch Alerts Active'
                    : 'Enable Launch Alerts'}
                </span>
                {enabled && <span className="notif-card__badge-active">● Active</span>}
              </div>
              <span className="notif-card__enable-desc">
                {!isSupported
                  ? 'Your browser does not support web notifications.'
                  : isDenied
                  ? 'Notifications are blocked in your browser settings. Unblock in site settings to enable.'
                  : enabled
                  ? "You'll receive push alerts at key countdown milestones and the instant GTA VI launches."
                  : 'Get notified when major countdown milestones hit and when Vice City officially opens.'}
              </span>
            </div>
          </div>

          <div className="notif-card__actions">
            {isSupported && !isDenied && (
              <button
                type="button"
                className={`notif-test-btn ${
                  testStatus === 'sent'
                    ? 'notif-test-btn--success'
                    : testStatus === 'blocked' || testStatus === 'error'
                    ? 'notif-test-btn--warn'
                    : ''
                }`}
                onClick={handleTestAlert}
                id="notification-test-btn"
                title="Send a live test notification to verify your device settings"
                disabled={testStatus === 'sending'}
              >
                {testStatus === 'sending' ? (
                  <span>Sending...</span>
                ) : testStatus === 'sent' ? (
                  <span>✓ Alert Sent!</span>
                ) : testStatus === 'blocked' ? (
                  <span>⚠️ Blocked</span>
                ) : testStatus === 'error' ? (
                  <span>⚠️ Failed</span>
                ) : (
                  <>
                    <span aria-hidden="true">⚡</span>
                    <span>Test Alert</span>
                  </>
                )}
              </button>
            )}

            <button
              className={`notif-toggle ${enabled ? 'notif-toggle--on' : ''}`}
              onClick={handleToggle}
              disabled={!isSupported || isDenied}
              id="notification-toggle-btn"
              aria-label={enabled ? 'Disable launch alerts' : 'Enable launch alerts'}
            >
              <span className="notif-toggle__track">
                <span className="notif-toggle__thumb" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

