import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import SpeedInsightsClient from "@/components/analytics/SpeedInsightsClient";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-BVGSD1HX88";
const META_PIXEL_ID = "929570206272479";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        {children}
        <VercelAnalytics />
        <SpeedInsightsClient />
      </body>
    </html>
  );
}
