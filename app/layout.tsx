import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-BVGSD1HX88";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        {children}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
