import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-gray-100 mt-auto bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2 select-none">
          <Image
            src="/assets/logo/logo.svg"
            alt="Jimmy Logo"
            width={64}
            height={64}
            className="w-8 h-8 object-contain"
          />
          Jimmy
        </div>
        <div className="text-gray-400 text-sm">© {currentYear} Just Jimmy LLC. Built for independence.</div>
      </div>
    </footer>
  );
};

export default Footer;
