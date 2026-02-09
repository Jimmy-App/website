"use client";

import type { ReactNode } from "react";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

type CookieSettingsButtonProps = {
  className?: string;
  children: ReactNode;
};

const CookieSettingsButton = ({
  className,
  children,
}: CookieSettingsButtonProps) => {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      {children}
    </button>
  );
};

export default CookieSettingsButton;
