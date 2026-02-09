import Image from "next/image";

type SiteFooterContent = {
  brandLabel?: string;
  copyrightText?: string;
};

type SiteFooterProps = {
  content?: SiteFooterContent | null;
};

const SiteFooter = ({ content }: SiteFooterProps) => {
  const currentYear = new Date().getFullYear();
  const resolvedBrandLabel = content?.brandLabel || "Jimmy";
  const resolvedCopyright =
    content?.copyrightText || "© {year} Just Jimmy LLC. Built for freedom.";
  const copyrightText = resolvedCopyright
    .replace("{year}", currentYear.toString())
    .replace("{{year}}", currentYear.toString());

  return (
    <footer className="border-t border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mb-3 select-none">
          <Image
            src="/assets/logo/logo-full.svg"
            alt={`${resolvedBrandLabel} Logo`}
            width={180}
            height={72}
            className="mx-auto h-10 w-auto object-contain"
          />
        </div>
        <p className="mt-1 text-sm text-gray-400">{copyrightText}</p>
      </div>
    </footer>
  );
};

export type { SiteFooterContent };
export default SiteFooter;
