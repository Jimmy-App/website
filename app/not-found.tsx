import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import SiteFooter from "@/components/site/SiteFooter";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar currentLocale={defaultLocale} />
      
      <div className="flex flex-grow items-center justify-center bg-[#f5f7fb] px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] lg:gap-14">
            {/* Image Column */}
            <div className="relative mx-auto lg:mx-0">
              <div className="logo-halo absolute -inset-8 rounded-full bg-gradient-to-r from-indigo-200/60 via-sky-200/50 to-violet-200/60 blur-2xl" />
              <Image
                src="/assets/logo/logo-problem.svg"
                alt="Jimmy logo disoriented on 404 page"
                width={800}
                height={800}
                priority
                className="relative h-auto w-[min(72vw,360px)] select-none sm:w-[320px] lg:w-[360px]"
              />
            </div>

            {/* Text Column */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center rounded-full border border-[#d3e0f5] bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm">
                404 Error
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                This page got{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  disoriented.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                The link may be outdated or moved. We apologize for the confusion. 
                Let&apos;s get you back on track to your workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Back to Homepage
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                >
                  Check Pricing
                </Link>
              </div>

              <div className="mt-8 text-xs font-bold tracking-widest text-slate-400 opacity-60">
                ERROR CODE: NOT_FOUND
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </main>
  );
}
