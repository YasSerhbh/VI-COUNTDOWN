# GTA VI Countdown — Project Reference

## Overview
A premium, single-page GTA VI countdown website built with Next.js 16. The site counts down to the GTA VI release date of **November 19, 2026** with multiple countdown formats, a Vice City-inspired design, offline PWA support, and full responsiveness.

## Release Info
- **Game**: Grand Theft Auto VI (GTA VI)
- **Release Date**: November 19, 2026
- **Target Timestamp**: `2026-11-19T00:00:00` (midnight, user's local timezone)

## Tech Stack
- **Framework**: Next.js 16.4.2 (App Router)
- **React**: 19.3.0
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/turbopack`)
- **Architecture**: Single-page, client-heavy (countdown logic runs client-side)
- **PWA**: Service Worker + Web App Manifest for offline support & installability

## Architecture Decisions
- **Single page**: Everything lives in `app/page.js` and client components
- **No database**: Pure client-side countdown logic, no server API routes needed
- **Server Component (layout.js)**: Handles metadata, fonts, and HTML shell
- **Client Component (CountdownApp)**: All interactive countdown logic, animations, timers
- **Static export friendly**: Can be deployed anywhere (Vercel, Netlify, static hosting)

## Design System — "Vice City Neon"

### Color Palette
| Token             | Value       | Usage                          |
|-------------------|-------------|--------------------------------|
| `--vi-black`      | `#0A0A0C`   | Deep background                |
| `--vi-dark`       | `#121218`   | Card backgrounds               |
| `--vi-surface`    | `#1A1A24`   | Elevated surfaces              |
| `--vi-pink`       | `#FF2D78`   | Primary accent (GTA pink)      |
| `--vi-pink-glow`  | `#FF2D7840` | Pink glow/shadow               |
| `--vi-orange`     | `#FF8A00`   | Secondary accent               |
| `--vi-teal`       | `#00D4AA`   | Tertiary accent                |
| `--vi-gold`       | `#FFD700`   | Highlight/premium feel         |
| `--vi-blue`       | `#0EA5E9`   | Info/link color                |
| `--vi-text`       | `#F0F0F5`   | Primary text                   |
| `--vi-text-muted` | `#8888A0`   | Muted/secondary text           |

### Typography
- **Headings**: Outfit (Google Fonts) — bold, modern, geometric
- **Body/Mono**: Geist / Geist Mono (already configured)
- **Countdown Numbers**: Custom styling with Outfit, extra bold, large sizes

### Gradients
- **Primary gradient**: `linear-gradient(135deg, #FF2D78, #FF8A00)`
- **Neon gradient**: `linear-gradient(135deg, #FF2D78, #FF8A00, #00D4AA)`
- **Dark overlay**: `linear-gradient(to bottom, rgba(10,10,12,0.7), rgba(10,10,12,0.95))`

### Effects
- Glassmorphism cards with `backdrop-filter: blur(20px)`
- Neon glow text shadows
- Particle/shimmer animations
- Smooth 60fps countdown transitions

## Page Sections (Top to Bottom)
1. **Hero / Background**: Full-viewport Vice City background image with dark gradient overlay
2. **Logo / Title**: "GTA VI" with neon glow effect + "COUNTDOWN" subtitle
3. **Primary Countdown**: Large days/hours/minutes/seconds flip-style countdown
4. **Countdown Variants**: Tabs/cards showing countdown in alternative formats:
   - Total weeks remaining
   - Total days remaining
   - Total hours remaining
   - Total minutes remaining
   - Total seconds remaining (live ticking)
5. **Progress Bar**: Visual percentage of time elapsed since announcement
6. **Release Info Card**: Date, platforms, key details
7. **Footer**: Credits, PWA install prompt

## File Structure
```
app/
  layout.js          — Root layout (Server Component), metadata, fonts
  page.js            — Server Component shell, imports CountdownApp
  globals.css        — Full design system, animations, responsive styles
  manifest.js        — PWA manifest configuration
  components/
    CountdownApp.js   — Main client component orchestrating everything
    CountdownTimer.js — Primary countdown display with flip animation
    CountdownStats.js — Alternative countdown formats (weeks, hours, etc.)
    ProgressBar.js    — Time elapsed progress visualization
    ParticleEffect.js — Background particle/shimmer animation
    InstallPrompt.js  — PWA install button
public/
  bg-desktop.jpg     — Vice City desktop background (16:9)
  bg-mobile.jpg      — Vice City mobile background (9:16)
  sw.js              — Service worker for offline caching
  icons/             — PWA icons (192x192, 512x512)
```

## PWA Configuration
- **Manifest**: `app/manifest.js` — name, icons, theme colors, display mode
- **Service Worker**: `public/sw.js` — caches static assets for offline use
- **Install Prompt**: Captures `beforeinstallprompt` event for custom install button
- **Offline**: Full countdown functionality works offline after first visit

## Countdown Logic
- Uses `setInterval(fn, 1000)` for 1-second tick updates
- All calculations derived from: `targetDate - Date.now()`
- Memoized unit conversions to avoid unnecessary re-renders
- Handles edge case: countdown reaches zero → shows "AVAILABLE NOW" celebration

## Responsive Breakpoints
- **Mobile**: < 640px — stacked layout, mobile BG, smaller type
- **Tablet**: 640px - 1024px — 2-column countdown stats
- **Desktop**: > 1024px — full layout, desktop BG, all effects enabled

## SEO
- Title: "GTA VI Countdown — Days Until Grand Theft Auto 6 Release"
- Description: "Live countdown to GTA VI release on November 19, 2026. Track days, hours, minutes, and seconds until Grand Theft Auto 6 launches."
- Open Graph tags for social sharing
- Semantic HTML structure
