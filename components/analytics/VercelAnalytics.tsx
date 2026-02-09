"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

const VercelAnalytics = () => {
  const pathname = usePathname();
  const isJadminPage = pathname?.startsWith("/jadmin");

  if (isJadminPage) {
    return null;
  }

  return <Analytics />;
};

export default VercelAnalytics;
