'use client';

import { memo } from 'react';

/**
 * Pure SVG & CSS Typographic GTA VI Brand Logo.
 * 100% vector-crisp on any screen, zero AI generation, zero raster boxes, zero pixelation.
 */
const GtaViLogo = memo(function GtaViLogo() {
  return (
    <div className="gta-brand" aria-label="Grand Theft Auto VI">
      {/* Top logotype: grand theft auto */}
      <div className="gta-brand__text">
        <span className="gta-brand__word">grand</span>
        <span className="gta-brand__word">theft</span>
        <span className="gta-brand__word">auto</span>
      </div>

      {/* Centerpiece: Roman numeral VI in Vice City Sunset Gradient */}
      <div className="gta-brand__numeral-wrapper" aria-hidden="true">
        <span className="gta-brand__numeral">VI</span>
        <span className="gta-brand__numeral-glow">VI</span>
      </div>
    </div>
  );
});

export default GtaViLogo;
