"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "parkit_cookie_consent";

type CookiePreferences = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    setPreferences({ essential: true, functional: true, analytics: true });
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, functional: true, analytics: true }));
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="bg-background border rounded-lg shadow-2xl max-w-2xl mx-auto">
        {!showSettings ? (
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">Cookie Preferences</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, functional: false, analytics: false }));
                  setShowBanner(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to provide our services, remember your preferences, and improve our platform. You can customize your preferences or accept all cookies.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                Customize
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={acceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg">Cookie Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-not-allowed opacity-70">
                <input type="checkbox" checked disabled className="mt-1" />
                <div>
                  <p className="font-medium text-sm">Essential</p>
                  <p className="text-xs text-muted-foreground">Required for authentication and security. Cannot be disabled.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-sm">Functional</p>
                  <p className="text-xs text-muted-foreground">Remember your preferences, language, and settings.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-sm">Analytics</p>
                  <p className="text-xs text-muted-foreground">Help us understand how the platform is used to improve it.</p>
                </div>
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => {
                setPreferences({ essential: true, functional: false, analytics: false });
                savePreferences();
              }}>
                Reject Optional
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={savePreferences}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
