"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  defaultLocale,
  isSupportedLocale,
  localeBasePath,
  type SupportedLocale,
} from "@/lib/i18n";

type NotFoundCopy = {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  homeCta: string;
  pricingCta: string;
  errorCodeLabel: string;
};

const COPY_BY_LOCALE: Record<SupportedLocale, NotFoundCopy> = {
  en: {
    badge: "404 Error",
    titleBefore: "This page got",
    titleHighlight: "disoriented.",
    description:
      "The link may be outdated or moved. We apologize for the confusion. Let's get you back on track to your workspace.",
    homeCta: "Back to Homepage",
    pricingCta: "Check Pricing",
    errorCodeLabel: "ERROR CODE: NOT_FOUND",
  },
  fr: {
    badge: "Erreur 404",
    titleBefore: "Cette page est",
    titleHighlight: "désorientée.",
    description:
      "Le lien est peut-être obsolète ou déplacé. Nous nous excusons pour la confusion. Revenons à votre espace de travail.",
    homeCta: "Retour à l'accueil",
    pricingCta: "Voir les tarifs",
    errorCodeLabel: "CODE ERREUR : NOT_FOUND",
  },
  es: {
    badge: "Error 404",
    titleBefore: "Esta página está",
    titleHighlight: "desorientada.",
    description:
      "Es posible que el enlace esté desactualizado o se haya movido. Disculpa la confusión. Volvamos a tu espacio de trabajo.",
    homeCta: "Volver al inicio",
    pricingCta: "Ver precios",
    errorCodeLabel: "CÓDIGO DE ERROR: NOT_FOUND",
  },
  ua: {
    badge: "Помилка 404",
    titleBefore: "Ця сторінка",
    titleHighlight: "загубилась.",
    description:
      "Посилання могло застаріти або змінитися. Перепрошуємо за незручності. Повернімо вас до робочого простору.",
    homeCta: "На головну",
    pricingCta: "Переглянути тарифи",
    errorCodeLabel: "КОД ПОМИЛКИ: NOT_FOUND",
  },
};

function resolveLocale(pathname: string | null): SupportedLocale {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];

  if (firstSegment && isSupportedLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

export default function LocalizedNotFoundPage() {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const copy = COPY_BY_LOCALE[locale];
  const homeHref = localeBasePath(locale);
  const pricingHref = `${homeHref}/pricing`;

  return (
    <section className="flex min-h-[72vh] items-center justify-center bg-[#f5f7fb] px-4 pt-20 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] lg:gap-14">
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

          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-[#d3e0f5] bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm">
              {copy.badge}
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              {copy.titleBefore}{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                {copy.titleHighlight}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {copy.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href={homeHref}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {copy.homeCta}
              </Link>
              <Link
                href={pricingHref}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
              >
                {copy.pricingCta}
              </Link>
            </div>

            <div className="mt-8 text-xs font-bold tracking-widest text-slate-400 opacity-60">
              {copy.errorCodeLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
