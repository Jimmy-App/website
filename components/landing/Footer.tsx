import Image from 'next/image';

export type FooterContent = {
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
    content?.copyrightText || '© {year} Just Jimmy LLC. Built for freedom.';
  const copyrightText = resolvedCopyright
    .replace('{year}', currentYear.toString())
    .replace('{{year}}', currentYear.toString());

  return (
    <footer className="py-12 border-t border-gray-100 mt-auto bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="mb-4 select-none">
          <Image
            src="/assets/logo/logo-full.svg"
            alt={`${resolvedBrandLabel} Logo`}
            width={180}
            height={72}
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="text-base text-gray-400">{copyrightText}</div>
      </div>
    </footer>
  );
};

export default Footer;
