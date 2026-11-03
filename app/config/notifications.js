/* =====================================================================
 * GTA VI COUNTDOWN — NOTIFICATIONS CONFIGURATION
 * =====================================================================
 * All countdown alerts and milestone notifications.
 *
 *  key               → Unique ID stored in browser localStorage
 *                      (so users only get each alert once)
 *  label             → Notification title shown on screen
 *  desc              → Notification message body
 *  daysBeforeLaunch  → How many days before launch to trigger (0 = launch day)
 *  hoursBeforeLaunch → Additional hours before launch to trigger
 *  immediate         → If true, fires immediately upon opening or enabling
 *  targetDate        → Optional explicit ISO date string for exact triggers
 *  badge             → Short category badge shown in UI
 *  icon              → Emoji or icon descriptor
 *
 * Add, remove, or modify entries freely. They are checked every 60 seconds.
 * ===================================================================== */

export const DEFAULT_MILESTONES = [
  // Immediate breaking announcement: Confirmed Pre-Load Date
  {
    key: 'preload-confirmed-now',
    label: '🚨 OFFICIAL: Pre-load Date Confirmed!',
    desc: 'Rockstar officially locked in GTA VI pre-load for November 10 at 00:00 local time! 9 days to download before launch. 🎮📦',
    immediate: true,
    badge: 'BREAKING NEWS',
    icon: '🚨',
  },
  {
    key: '30d',
    label: '30 Days Left',
    desc: 'Only 30 days until GTA VI launches. Vice City is calling! 🌴',
    daysBeforeLaunch: 30,
    hoursBeforeLaunch: 0,
    badge: '30 DAYS',
    icon: '📅',
  },
  {
    key: '14d',
    label: '2 Weeks Left',
    desc: 'Just 14 days until GTA VI! The countdown is getting real. 🔥',
    daysBeforeLaunch: 14,
    hoursBeforeLaunch: 0,
    badge: '2 WEEKS',
    icon: '⏳',
  },
  // Storage preparation alert (3 days before pre-load = 12 days before launch)
  {
    key: 'preload-prep-3d',
    label: '💾 3 Days Until Pre-Load: Clear Storage!',
    desc: 'Time to clear your SSD! GTA VI pre-load begins in 3 days on November 10 (00:00 local time). Get your storage ready! 🚀',
    daysBeforeLaunch: 12,
    hoursBeforeLaunch: 0,
    badge: 'STORAGE CHECK',
    icon: '💾',
  },
  // 24 hours before pre-load begins (10 days before launch = Nov 9)
  {
    key: 'preload-24h',
    label: '⏰ 24 Hours Until Pre-Load!',
    desc: 'Pre-load unlocks tomorrow, November 10 at 00:00 local time! Put your console in rest mode and ready your downloads. ⚡',
    daysBeforeLaunch: 10,
    hoursBeforeLaunch: 0,
    badge: 'PRE-LOAD SOON',
    icon: '⏰',
  },
  // Pre-load officially opens (Nov 10, 00:00 local time = 9 days before launch)
  {
    key: 'preload-live',
    label: '🎮 PRE-LOAD IS LIVE NOW!',
    desc: 'GTA VI pre-load is officially unlocked! Turn on your PS5 or Xbox Series X|S, begin downloading, and be ready for launch day! 🌴🔥',
    daysBeforeLaunch: 9,
    hoursBeforeLaunch: 0,
    badge: 'PRE-LOAD LIVE',
    icon: '🎮',
  },
  {
    key: '7d',
    label: '1 Week Left!',
    desc: 'Only 7 days until GTA VI drops! If you haven\'t pre-loaded yet, do it now! 🎮',
    daysBeforeLaunch: 7,
    hoursBeforeLaunch: 0,
    badge: '1 WEEK',
    icon: '🔥',
  },
  // Final weekend before launch
  {
    key: '5d',
    label: '🌴 5 Days Left — Final Weekend!',
    desc: 'The last weekend before Vice City opens! Pre-loads verified, snacks acquired. We are almost there! 🌅',
    daysBeforeLaunch: 5,
    hoursBeforeLaunch: 0,
    badge: '5 DAYS',
    icon: '🌴',
  },
  {
    key: '3d',
    label: '3 Days Left!',
    desc: 'GTA VI arrives in less than 3 days! Leonida is right around the corner. ⚡',
    daysBeforeLaunch: 3,
    hoursBeforeLaunch: 0,
    badge: '3 DAYS',
    icon: '⚡',
  },
  {
    key: '1d',
    label: 'Tomorrow is Launch Day!',
    desc: 'GTA VI launches TOMORROW! Lucia & Jason are waiting. Welcome to Vice City! 🌅',
    daysBeforeLaunch: 1,
    hoursBeforeLaunch: 0,
    badge: 'TOMORROW',
    icon: '🌅',
  },
  // 12 hours before global launch
  {
    key: 'launch-12h',
    label: '⏳ 12 Hours Until GTA VI!',
    desc: 'Half a day until the biggest gaming event in history. Rest up, tonight is the night! 🌆',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 12,
    badge: '12 HOURS',
    icon: '⏳',
  },
  // 6 hours before launch
  {
    key: 'launch-6h',
    label: '🔥 6 Hours to Vice City!',
    desc: 'Single digit hours! Pre-load decrypted and ready. Final checks before Leonida unlocks! 🌴',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 6,
    badge: '6 HOURS',
    icon: '🔥',
  },
  {
    key: 'launch-1h',
    label: '🚨 ONE HOUR LEFT!!',
    desc: 'GET YOUR SNACKS READY, CONTROLLERS CHARGED, AND ENTER THE NEW ERA! ⏰🎮',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 1,
    badge: 'FINAL HOUR',
    icon: '⏰',
  },
  {
    key: 'launch',
    label: '🎉 GTA VI IS OFFICIALLY RELEASED!!',
    desc: 'THE WAIT IS FINALLY OVER! WELCOME TO VICE CITY & LEONIDA! 🌴✨',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 0,
    badge: 'LAUNCH DAY',
    icon: '🎉',
  },
];

// Helper to convert days/hours or targets into milliseconds before release
export function milestoneToMs(milestone, releaseDate) {
  if (milestone.immediate) {
    return Infinity;
  }
  if (milestone.targetDate && releaseDate) {
    const target = new Date(milestone.targetDate).getTime();
    return Math.max(0, releaseDate.getTime() - target);
  }
  const days = Number(milestone.daysBeforeLaunch || 0);
  const hours = Number(milestone.hoursBeforeLaunch || 0);
  return (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000);
}

// Helper to compute display date for a milestone
export function getMilestoneDisplayDate(milestone, releaseDate) {
  if (milestone.immediate) {
    return 'Active Now';
  }
  if (milestone.targetDate) {
    return new Date(milestone.targetDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const ms = milestoneToMs(milestone, releaseDate);
  const targetDate = new Date(releaseDate.getTime() - ms);
  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: milestone.hoursBeforeLaunch > 0 ? '2-digit' : undefined,
    minute: milestone.hoursBeforeLaunch > 0 ? '2-digit' : undefined,
  });
}
