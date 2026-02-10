"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";

type DeferredVimeoEmbedProps = {
  videoId: string;
  title: string;
};

export default function DeferredVimeoEmbed({
  videoId,
  title,
}: DeferredVimeoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoSrc = useMemo(
    () =>
      `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1&playsinline=1`,
    [videoId],
  );

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-[#e7edf5] bg-black">
      {isLoaded ? (
        <iframe
          src={videoSrc}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title={title}
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`Play video: ${title}`}
        >
          <span className="sr-only">Load video player</span>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/20" />
          <div className="pointer-events-none inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white text-[#5b47ff] shadow-[0_10px_20px_-14px_rgba(91,71,255,0.45)] transition-transform duration-200 group-hover:scale-105">
            <Play size={16} fill="currentColor" className="translate-x-[1px]" />
          </div>
        </button>
      )}
    </div>
  );
}
