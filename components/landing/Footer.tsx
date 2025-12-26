import Image from 'next/image';

type FooterContent = {
  brandLabel?: string;
  copyrightText?: string;
};

type FooterProps = {
  content?: FooterContent | null;
};

const Footer = ({ content }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const resolvedBrandLabel = content?.brandLabel || 'Jimmy';
  const resolvedCopyright =
    content?.copyrightText || '© {year} Just Jimmy LLC. Built for independence.';
  const copyrightText = resolvedCopyright
    .replace('{year}', currentYear.toString())
    .replace('{{year}}', currentYear.toString());

  return (
    <footer className="py-12 border-t border-gray-100 mt-auto bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2 select-none">
          <Image
            src="/assets/logo/logo.svg"
            alt={`${resolvedBrandLabel} Logo`}
            width={64}
            height={64}
            className="w-8 h-8 object-contain"
          />
          {resolvedBrandLabel}
        </div>
        <div className="text-gray-400 text-sm">{copyrightText}</div>
      </div>
    </footer>
  );
};

export default Footer;
