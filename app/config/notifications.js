/* =====================================================================
 * GTA VI COUNTDOWN — NOTIFICATIONS CONFIGURATION
 * =====================================================================
 * Edit this array directly in your IDE to customize all countdown alerts.
 *
 *  key               → Unique ID stored in browser localStorage
 *                      (so users only get each alert once)
 *  label             → Notification title shown on screen
 *  desc              → Notification message body
 *  daysBeforeLaunch  → How many days before launch to trigger (0 = launch day)
 *  hoursBeforeLaunch → Additional hours before launch to trigger
 *  icon              → Emoji or icon descriptor
 *
 * Add, remove, or modify entries freely. They are checked every 60 seconds.
 * ===================================================================== */

export const DEFAULT_MILESTONES = [
  {
    key: '30d',
    label: '30 Days Left',
    desc: 'Only 30 days until GTA VI launches. Vice City is calling! 🌴',
    daysBeforeLaunch: 30,
    hoursBeforeLaunch: 0,
    icon: '📅',
  },
  {
    key: '14d',
    label: '2 Weeks Left',
    desc: 'Just 14 days until GTA VI! The countdown is getting real. 🔥',
    daysBeforeLaunch: 14,
    hoursBeforeLaunch: 0,
    icon: '⏳',
  },
  {
    key: '7d',
    label: '1 Week Left',
    desc: 'One week until GTA VI drops! Start clearing your schedule. 🎮',
    daysBeforeLaunch: 7,
    hoursBeforeLaunch: 0,
    icon: '🔥',
  },
  {
    key: 'preload',
    label: 'Pre-load Available',
    desc: 'You can now pre-load GTA VI! Get your console ON and START DOWNLOADING. 🎮',
    daysBeforeLaunch: 7,
    hoursBeforeLaunch: 0,
    icon: '🔥',
  },
  {
    key: '3d',
    label: '3 Days Left',
    desc: 'GTA VI arrives in just 3 days! Almost time for Leonida. ⚡',
    daysBeforeLaunch: 3,
    hoursBeforeLaunch: 0,
    icon: '⚡',
  },
  {
    key: '1d',
    label: 'Tomorrow!',
    desc: 'GTA VI launches TOMORROW! Get ready for Cracking Lucia! 🌅',
    daysBeforeLaunch: 1,
    hoursBeforeLaunch: 0,
    icon: '🌅',
  },
  {
    key: 'launch-1h',
    label: 'ONE HOUR LEFT!!',
    desc: 'GET YOURS SNACKS READY AND MAKE SURE NOT TO DIE ⏰',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 1,
    icon: '⏰',
  },
  {
    key: 'launch',
    label: 'IT HAS FINALLY HAPPENED OMG!',
    desc: 'GTA VI IS HERE, WE HAVE OFFICIALLY ENTERED A NEw ERA! 🎉',
    daysBeforeLaunch: 0,
    hoursBeforeLaunch: 0,
    icon: '🎉',
  },
];

// Helper to convert days/hours into milliseconds before release
export function milestoneToMs(milestone) {
  const days = Number(milestone.daysBeforeLaunch || 0);
  const hours = Number(milestone.hoursBeforeLaunch || 0);
  return (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000);
}
