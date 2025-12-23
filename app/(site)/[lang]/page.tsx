import Link from "next/link";
import { notFound } from "next/navigation";

import { isSupportedLocale, localeBasePath } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  return {
    title: "Home Page",
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const basePath = localeBasePath(lang) || "/";

  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-kicker glass">New release: Insight Engine</div>
        <h1 className="hero-title">Data-Driven Decisions Powered by AI</h1>
        <p className="hero-subtitle">
          Effortlessly analyze large datasets, uncover trends, and align every
          team on the next best action.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href={`${basePath}#get-started`}>
            Try for free
          </Link>
          <Link className="btn btn-glass" href={`${basePath}#demo`}>
            Schedule a demo
          </Link>
        </div>
        <div className="hero-meta">
          <span>14-day trial</span>
          <span>No credit card</span>
          <span>Realtime insights</span>
        </div>
      </div>
      <div className="hero-media">
        <div className="hero-image glass">
          <div className="hero-image-toolbar">
            <span className="toolbar-dot" />
            <span className="toolbar-dot" />
            <span className="toolbar-dot" />
          </div>
          <div className="hero-image-placeholder">
            Platform preview coming soon
          </div>
        </div>
        <div className="hero-card glass">
          <p className="hero-card-label">Live forecasting</p>
          <p className="hero-card-value">+38% faster</p>
          <p className="hero-card-caption">on decision cycles</p>
        </div>
      </div>
    </section>
  );
}
