'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CountdownTimer from './CountdownTimer';
import CountdownStats from './CountdownStats';
import ProgressBar from './ProgressBar';
import ParticleEffect from './ParticleEffect';
import InstallPrompt from './InstallPrompt';
import NotificationManager from './NotificationManager';

// GTA VI release: November 19, 2026
const RELEASE_DATE = new Date('2026-11-19T00:00:00');
// Pre-load date: November 12, 2026 (approx 1 week before launch)
const PRELOAD_DATE = new Date('2026-11-12T00:00:00');
// Announcement date (trailer 1): December 5, 2023
const ANNOUNCE_DATE = new Date('2023-12-05T00:00:00');

const FORMAT_MODES = [
  { key: 'all', label: 'All Units' },
  { key: 'days', label: 'Days' },
  { key: 'weeks', label: 'Weeks' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

function calcCountdownWithNow(targetDate, now) {
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isReached: true,
    };
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isReached: false,
  };
}

function calcProgressWithNow(now) {
  const totalSpan = RELEASE_DATE.getTime() - ANNOUNCE_DATE.getTime();
  const elapsed = now - ANNOUNCE_DATE.getTime();
  return Math.min(Math.max((elapsed / totalSpan) * 100, 0), 100);
}

function calcAllStats(totalMs) {
  if (totalMs <= 0) return { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    weeks: Math.floor(totalMs / (1000 * 60 * 60 * 24 * 7)),
    days: Math.floor(totalMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor(totalMs / (1000 * 60 * 60)),
    minutes: Math.floor(totalMs / (1000 * 60)),
    seconds: Math.floor(totalMs / 1000),
  };
}

const STATIC_TIME = {
  total: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isReached: false,
};

const STATIC_STATS = {
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function CountdownApp() {
  const [mounted, setMounted] = useState(false);
  const [activeTarget, setActiveTarget] = useState('release');
  const [formatMode, setFormatMode] = useState('all');

  const [releaseTime, setReleaseTime] = useState(STATIC_TIME);
  const [preloadTime, setPreloadTime] = useState(STATIC_TIME);
  const [progress, setProgress] = useState(0);

  const [releaseStats, setReleaseStats] = useState(STATIC_STATS);
  const [preloadStats, setPreloadStats] = useState(STATIC_STATS);

  const prevReleaseRef = useRef(STATIC_TIME);
  const prevPreloadRef = useRef(STATIC_TIME);

  const tick = useCallback(() => {
    const now = Date.now();
    const rt = calcCountdownWithNow(RELEASE_DATE, now);
    const pt = calcCountdownWithNow(PRELOAD_DATE, now);
    setReleaseTime(rt);
    setPreloadTime(pt);
    setProgress(calcProgressWithNow(now));
    setReleaseStats(calcAllStats(rt.total));
    setPreloadStats(calcAllStats(pt.total));
    prevReleaseRef.current = rt;
    prevPreloadRef.current = pt;
  }, []);

  useEffect(() => {
    setMounted(true);
    tick(); // Compute immediately on mount
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  // Clean Service Worker registration (prevents stale dev caching)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .catch(() => { /* Silent fallback */ });
      } else {
        // In local development, unregister old workers so hot reloading and background images aren't blocked
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      }
    }
  }, []);

  const scrollToDetails = () => {
    const belowEl = document.getElementById('details-section');
    if (belowEl) {
      belowEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isMainTargetRelease = activeTarget === 'release';
  const mainTime = isMainTargetRelease ? releaseTime : preloadTime;
  const mainStats = isMainTargetRelease ? releaseStats : preloadStats;
  const mainPrevTime = isMainTargetRelease ? prevReleaseRef.current : prevPreloadRef.current;

  return (
    <>
      {/* High-priority background with warm Vice City sunset gradient fallback */}
      <div className="bg-scene" aria-hidden="true">
        <img
          src="/bg-desktop.jpg"
          alt=""
          className="bg-scene__img"
          fetchPriority="high"
          decoding="async"
        />
        <div className="bg-scene__overlay" />
        <div className="bg-scene__noise" />
      </div>

      {/* Ambient Particle Canvas */}
      <ParticleEffect />

      {/* Main layout */}
      <main className="content-wrapper">
        {/* ========================================================= */}
        {/* ===== ABOVE THE FOLD (Fits 100dvh strictly) ===== */}
        {/* ========================================================= */}
        <section className="above-fold" aria-label="Main Countdown Section">
          {/* Hero */}
          <header className="hero" id="hero">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              {mainTime.isReached ? 'AVAILABLE NOW' : 'OFFICIAL COUNTDOWN'}
            </div>

            {/* Official Transparent VI.png Logo */}
            <div className="hero__logo-wrapper">
              <img
                src="/VI.png"
                alt="Grand Theft Auto VI Logo"
                className="hero__logo-img"
                width={220}
                height={220}
                fetchPriority="high"
                draggable={false}
              />
            </div>
          </header>

          {/* Target Tabs: Launch vs Pre-load */}
          <div className="target-tabs" role="tablist" aria-label="Select Countdown Target">
            <button
              role="tab"
              aria-selected={activeTarget === 'release'}
              className={`target-tab ${activeTarget === 'release' ? 'target-tab--active' : ''}`}
              onClick={() => setActiveTarget('release')}
              id="tab-release"
            >
              <span className="target-tab__text">Launch</span>
              <span className="target-tab__date">Nov 19, 2026</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTarget === 'preload'}
              className={`target-tab ${activeTarget === 'preload' ? 'target-tab--active' : ''}`}
              onClick={() => setActiveTarget('preload')}
              id="tab-preload"
            >
              <span className="target-tab__text">Pre-Load</span>
              <span className="target-tab__date">Nov 12, 2026</span>
            </button>
          </div>

          {/* Format Selector: All Units, Days, Weeks, Hours, Minutes, Seconds */}
          <nav className="mode-tabs" aria-label="Countdown Display Format">
            <span className="mode-tabs__title">Display:</span>
            <div className="mode-tabs__list">
              {FORMAT_MODES.map((m) => (
                <button
                  key={m.key}
                  className={`mode-tab ${formatMode === m.key ? 'mode-tab--active' : ''}`}
                  onClick={() => setFormatMode(m.key)}
                  aria-pressed={formatMode === m.key}
                  id={`mode-tab-${m.key}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Countdown Display */}
          <div className="main-timer-stage" suppressHydrationWarning>
            {mainTime.isReached ? (
              <div className="celebration glass-card" id="celebration">
                <h1 className="celebration__title">WELCOME TO LEONIDA</h1>
                <p className="celebration__subtitle">
                  {isMainTargetRelease
                    ? 'Grand Theft Auto VI is officially released! Welcome to Vice City.'
                    : 'Pre-load is live now! Begin downloading your game.'}
                </p>
              </div>
            ) : (
              <CountdownTimer
                mode={formatMode}
                time={mainTime}
                stats={mainStats}
                prevTime={mainPrevTime}
                variant={isMainTargetRelease ? 'pink' : 'teal'}
                title={
                  isMainTargetRelease
                    ? 'Target: Official Global Launch'
                    : 'Target: Estimated Pre-Load Window'
                }
                targetDateLabel={
                  isMainTargetRelease ? 'November 19, 2026' : 'November 12, 2026'
                }
                isMounted={mounted}
              />
            )}
          </div>

          {/* Scroll Indicator */}
          <button
            className="scroll-indicator"
            onClick={scrollToDetails}
            aria-label="Scroll down for details and secondary countdown"
          >
            <span className="scroll-indicator__text">
              {isMainTargetRelease
                ? 'Scroll for Pre-Load Clock & Details'
                : 'Scroll for Launch Clock & Details'}
            </span>
            <span className="scroll-indicator__arrow">&darr;</span>
          </button>
        </section>

        {/* ========================================================= */}
        {/* ===== BELOW THE FOLD (Revealed on Scroll) ===== */}
        {/* ========================================================= */}
        <section className="below-fold" id="details-section">
          {/* Secondary Countdown: The Other Target */}
          <div className="secondary-countdown-section">
            <div className="section-header">
              <span className="section-header__badge">
                {isMainTargetRelease ? 'PRE-LOAD COUNTDOWN' : 'LAUNCH COUNTDOWN'}
              </span>
              <h2 className="section-header__title">
                {isMainTargetRelease
                  ? 'Pre-Load Clock (November 12, 2026)'
                  : 'Official Launch Clock (November 19, 2026)'}
              </h2>
              <p className="section-header__sub">
                {isMainTargetRelease
                  ? 'Pre-load unlocks 1 week before release so you are ready to jump straight into Leonida.'
                  : 'November 19, 2026 — Vice City awaits.'}
              </p>
            </div>

            <CountdownTimer
              mode="all"
              time={isMainTargetRelease ? preloadTime : releaseTime}
              stats={isMainTargetRelease ? preloadStats : releaseStats}
              prevTime={isMainTargetRelease ? prevPreloadRef.current : prevReleaseRef.current}
              variant={isMainTargetRelease ? 'teal' : 'pink'}
              title={
                isMainTargetRelease
                  ? 'Pre-Load Date: November 12, 2026'
                  : 'Official Launch: November 19, 2026'
              }
              isMounted={mounted}
            />
          </div>

          {/* Time Breakdown Stats */}
          <CountdownStats
            stats={isMainTargetRelease ? releaseStats : preloadStats}
            title={
              isMainTargetRelease
                ? 'Total Time Remaining Until Launch'
                : 'Total Time Remaining Until Pre-Load'
            }
            subtitle="Accurate real-time total breakdown across units"
          />

          {/* Journey Progress Bar */}
          <ProgressBar progress={progress} />

          {/* Notification Manager */}
          <NotificationManager releaseDate={RELEASE_DATE} />

          {/* Mission Intel Cards */}
          <section className="release-info glass-card" id="release-info">
            <h3 className="release-info__heading">Mission Intel</h3>
            <div className="release-info__inner">
              <div className="release-info__item">
                <span className="release-info__label">Release Date</span>
                <span className="release-info__value">November 19, 2026</span>
              </div>
              <div className="release-info__item">
                <span className="release-info__label">Pre-Load Est.</span>
                <span className="release-info__value">November 12, 2026</span>
              </div>
              <div className="release-info__item">
                <span className="release-info__label">Platforms</span>
                <span className="release-info__value">PS5 &amp; Xbox Series X|S</span>
              </div>
              <div className="release-info__item">
                <span className="release-info__label">Location</span>
                <span className="release-info__value">Vice City, State of Leonida</span>
              </div>
              <div className="release-info__item">
                <span className="release-info__label">Protagonists</span>
                <span className="release-info__value">Lucia &amp; Jason</span>
              </div>
              <div className="release-info__item">
                <span className="release-info__label">Developer</span>
                <span className="release-info__value">Rockstar Games</span>
              </div>
            </div>
          </section>

          {/* Install PWA Prompt */}
          <InstallPrompt />

          {/* Footer */}
          <footer className="footer" id="footer">
            <p className="footer__text">
              Crafted for the GTA Community
              <br />
              Offline capable PWA &bull; Updates dynamically in real-time
              <br />
              <span className="footer__disclaimer">
                Fan-made tribute. Not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive.
              </span>
            </p>
          </footer>
        </section>
      </main>
    </>
  );
}
