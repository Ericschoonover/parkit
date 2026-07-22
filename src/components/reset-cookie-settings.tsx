"use client";

import { Button } from "@/components/ui/button";

export function ResetCookieSettings() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("parkit_cookie_consent");
        window.location.reload();
      }}
      className="hover:text-foreground transition-colors text-left"
    >
      Cookie Settings
    </button>
  );
}
