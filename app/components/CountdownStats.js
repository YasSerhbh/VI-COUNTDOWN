'use client';

import { memo } from 'react';

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('en-US');
}

const STAT_ITEMS = [
  { key: 'weeks', label: 'Weeks', colorClass: 'stat-item__value--pink' },
  { key: 'days', label: 'Days', colorClass: 'stat-item__value--orange' },
  { key: 'hours', label: 'Hours', colorClass: 'stat-item__value--teal' },
  { key: 'minutes', label: 'Minutes', colorClass: 'stat-item__value--gold' },
  { key: 'seconds', label: 'Seconds', colorClass: 'stat-item__value--blue' },
];

const CountdownStats = memo(function CountdownStats({
  stats,
  title = 'Total Time Remaining In',
  subtitle,
}) {
  if (!stats) return null;

  return (
    <section className="countdown-stats glass-card" id="countdown-stats">
      <div className="countdown-stats__header">
        <h2 className="countdown-stats__title">{title}</h2>
        {subtitle && <p className="countdown-stats__subtitle">{subtitle}</p>}
      </div>
      <div className="countdown-stats__grid">
        {STAT_ITEMS.map((item) => (
          <div className="stat-item" key={item.key}>
            <div className={`stat-item__value ${item.colorClass}`}>
              {formatNumber(stats[item.key])}
            </div>
            <div className="stat-item__label">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default CountdownStats;
