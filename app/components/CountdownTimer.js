'use client';

import { memo, useRef, useEffect } from 'react';

function CountdownUnit({ value, label, prevValue, isSmall = false }) {
  const spanRef = useRef(null);
  const formattedVal = typeof value === 'number' && value < 100
    ? String(value).padStart(2, '0')
    : Number(value).toLocaleString('en-US');

  useEffect(() => {
    if (prevValue !== undefined && prevValue !== value && spanRef.current) {
      const el = spanRef.current;
      el.classList.remove('countdown-unit__value--animate');
      void el.offsetWidth; // Force reflow
      el.classList.add('countdown-unit__value--animate');
    }
  }, [value, prevValue]);

  return (
    <div className={`countdown-unit ${isSmall ? 'countdown-unit--small' : ''}`}>
      <div className="countdown-unit__box">
        <span className="countdown-unit__value" ref={spanRef}>
          {formattedVal}
        </span>
      </div>
      <span className="countdown-unit__label">{label}</span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <div className="countdown-separator" aria-hidden="true">
      <span className="countdown-separator__colon">:</span>
    </div>
  );
}

const CountdownTimer = memo(function CountdownTimer({
  mode = 'all',
  time,
  stats,
  prevTime,
  variant = 'pink', // 'pink' | 'teal'
  title,
  targetDateLabel,
}) {
  if (!time) return null;

  // Render Single Big Focus Mode
  const isFocusMode = mode !== 'all';

  return (
    <div className={`countdown-container countdown-container--${variant}`}>
      {title && (
        <div className="countdown-container__header">
          <span className="countdown-container__title">{title}</span>
          {targetDateLabel && (
            <span className="countdown-container__date">{targetDateLabel}</span>
          )}
        </div>
      )}

      {isFocusMode ? (
        <div className="countdown-focus glass-card">
          {/* Big Featured Value */}
          <div className="countdown-focus__main">
            <div className="countdown-focus__value-wrapper">
              <span className="countdown-focus__value">
                {stats && stats[mode] !== undefined
                  ? Number(stats[mode]).toLocaleString('en-US')
                  : '0'}
              </span>
              <span className="countdown-focus__label">
                {mode.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Standard 4-Unit Grid (Days : Hours : Minutes : Seconds) with clean independent separators */
        <div className="countdown-grid-wrapper glass-card">
          <div className="countdown-grid">
            <CountdownUnit
              value={time.days}
              label="Days"
              prevValue={prevTime?.days}
            />

            <CountdownSeparator />

            <CountdownUnit
              value={time.hours}
              label="Hours"
              prevValue={prevTime?.hours}
            />

            <CountdownSeparator />

            <CountdownUnit
              value={time.minutes}
              label="Minutes"
              prevValue={prevTime?.minutes}
            />

            <CountdownSeparator />

            <CountdownUnit
              value={time.seconds}
              label="Seconds"
              prevValue={prevTime?.seconds}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default CountdownTimer;
