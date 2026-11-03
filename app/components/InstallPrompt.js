'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const timer = setTimeout(() => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    }, 0);

    function handleBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <div className="install-prompt">
      {deferredPrompt ? (
        <button className="install-btn" onClick={handleInstall} id="install-btn">
          Install App &bull; Offline Mode
        </button>
      ) : (
        <button className="install-btn install-btn--disabled" disabled id="install-btn-disabled">
          Installable Web App &bull; Offline Ready
        </button>
      )}
    </div>
  );
}
