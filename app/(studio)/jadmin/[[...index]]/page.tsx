"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export default function StudioPage() {
  const hasStudioConfig = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  );

  if (!hasStudioConfig) {
    return (
      <section>
        <h1>Sanity Studio</h1>
        <p>
          Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in
          .env.local to load the studio.
        </p>
      </section>
    );
  }

  return <NextStudio config={config} />;
}
