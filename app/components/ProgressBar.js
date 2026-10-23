'use client';

import { memo } from 'react';

const ProgressBar = memo(function ProgressBar({ progress }) {
  return (
    <section className="progress-section glass-card" id="progress-bar">
      <div className="progress-section__inner">
        <div className="progress-section__header">
          <span className="progress-section__label">Journey to Launch</span>
          <span className="progress-section__percent">
            {progress.toFixed(2)}%
          </span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          >
            <div className="progress-bar__glow" />
          </div>
        </div>
        <div className="progress-section__dates">
          <span>Dec 5, 2023 — Announcement</span>
          <span>Nov 19, 2026 — Launch</span>
        </div>
      </div>
    </section>
  );
});

export default ProgressBar;
