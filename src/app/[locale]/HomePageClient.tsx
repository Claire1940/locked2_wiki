'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  Gamepad2,
  Hammer,
  Home,
  Package,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

function ToolGridCard({
  card,
  index,
  href,
}: {
  card: { icon: string; title: string; description: string }
  index: number
  href: string
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        scrollToSection(href.slice(1))
      }}
      className="scroll-reveal group p-6 rounded-xl border border-border
                 bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                 transition-all duration-300 cursor-pointer text-left
                 hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="w-12 h-12 rounded-lg mb-4
                      bg-[hsl(var(--nav-theme)/0.1)]
                      flex items-center justify-center
                      group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                      transition-colors">
        <DynamicIcon
          name={card.icon}
          className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
        />
      </div>
      <h3 className="font-semibold mb-2">{card.title}</h3>
      <p className="text-sm text-muted-foreground">{card.description}</p>
    </a>
  )
}

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
  videoId: string
  videoTitle: string
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
  videoId,
  videoTitle,
}: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locked2.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'LOCKED 2 Wiki',
        description:
          'LOCKED 2 Wiki for Roblox players covering codes, weapons, traits, flows, builds, and dribbling guides.',
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'LOCKED 2 Wiki Hero',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'LOCKED 2 Wiki',
        alternateName: 'LOCKED:2',
        url: siteUrl,
        description:
          'Community-driven LOCKED 2 Wiki with guides, updates, and official resource links for Roblox players.',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'LOCKED 2 Wiki Hero',
        },
        sameAs: [
          'https://www.roblox.com/games/109883052223750/LOCKED-2',
          'https://discord.com/invite/locked',
          'https://www.roblox.com/communities/17351304/MOMENTXM',
          'https://www.youtube.com/channel/UCAveQ4GrkmOzcGCMM3MtQJg',
        ],
      },
      {
        '@type': 'VideoGame',
        name: 'LOCKED:2',
        gamePlatform: ['Roblox'],
        applicationCategory: 'Game',
        genre: ['Sports', 'Soccer', 'Anime', 'Competitive'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 22,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://www.roblox.com/games/109883052223750/LOCKED-2',
        },
      },
    ],
  }

  // Accordion states for module sections
  const [traitsExpanded, setTraitsExpanded] = useState<number | null>(null)
  const [positionExpanded, setPositionExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://discord.com/invite/locked"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.roblox.com/games/109883052223750/LOCKED-2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId={videoId}
              title={videoTitle}
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ToolGridCard card={t.tools.cards[0]} index={0} href="#locked-2-codes" />
            <ToolGridCard card={t.tools.cards[1]} index={1} href="#locked-2-trello-discord" />
            <ToolGridCard card={t.tools.cards[2]} index={2} href="#locked-2-beginner-guide" />
            <ToolGridCard card={t.tools.cards[3]} index={3} href="#locked-2-controls" />
            <ToolGridCard card={t.tools.cards[4]} index={4} href="#locked-2-weapon-tier-list" />
            <ToolGridCard card={t.tools.cards[5]} index={5} href="#locked-2-traits-tier-list" />
            <ToolGridCard card={t.tools.cards[6]} index={6} href="#locked-2-best-builds" />
            <ToolGridCard card={t.tools.cards[7]} index={7} href="#locked-2-dribbling-guide" />
            <ToolGridCard card={t.tools.cards[8]} index={8} href="#locked-2-weapons-guide" />
            <ToolGridCard card={t.tools.cards[9]} index={9} href="#locked-2-traits-guide" />
            <ToolGridCard card={t.tools.cards[10]} index={10} href="#locked-2-flow-guide" />
            <ToolGridCard card={t.tools.cards[11]} index={11} href="#locked-2-position-guide" />
            <ToolGridCard card={t.tools.cards[12]} index={12} href="#locked-2-height-guide" />
            <ToolGridCard card={t.tools.cards[13]} index={13} href="#locked-2-goalkeeper-guide" />
            <ToolGridCard card={t.tools.cards[14]} index={14} href="#locked-2-tournament-mode" />
            <ToolGridCard card={t.tools.cards[15]} index={15} href="#locked-2-update-log" />
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Beginner Guide */}
      <section id="locked-2-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksBeginnerGuide']} locale={locale}>
                {t.modules.lucidBlocksBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.lucidBlocksBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.common.quickTips}</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Apotheosis Crafting */}
      <section id="locked-2-trello-discord" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksApotheosisCrafting']} locale={locale}>{t.modules.lucidBlocksApotheosisCrafting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksApotheosisCrafting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksApotheosisCrafting.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksApotheosisCrafting::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksApotheosisCrafting.milestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Tools and Weapons */}
      <section id="locked-2-beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksToolsAndWeapons']} locale={locale}>{t.modules.lucidBlocksToolsAndWeapons.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksToolsAndWeapons.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksToolsAndWeapons.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Hammer className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksToolsAndWeapons::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Storage and Inventory */}
      <section id="locked-2-controls" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksStorageAndInventory']} locale={locale}>{t.modules.lucidBlocksStorageAndInventory.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksStorageAndInventory.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksStorageAndInventory.solutions.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksStorageAndInventory::solutions::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Management Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksStorageAndInventory.managementTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Qualia and Base Building */}
      <section id="locked-2-weapon-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksQualiaAndBaseBuilding']} locale={locale}>{t.modules.lucidBlocksQualiaAndBaseBuilding.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksQualiaAndBaseBuilding.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksQualiaAndBaseBuilding::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.highlights.map((h: string, i: number) => (
              <div key={i} className="p-4 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Home className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mx-auto mb-2" />
                <p className="text-sm">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: World Regions */}
      <section id="locked-2-traits-tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksWorldRegions']} locale={locale}>{t.modules.lucidBlocksWorldRegions.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksWorldRegions.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksWorldRegions.regions.map((region: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksWorldRegions::regions::${index}`]} locale={locale}>
                      {region.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{region.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{region.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Creatures and Enemies */}
      <section id="locked-2-best-builds" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCreaturesAndEnemies']} locale={locale}>{t.modules.lucidBlocksCreaturesAndEnemies.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCreaturesAndEnemies.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksCreaturesAndEnemies.creatures.map((c: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${["Hostile Enemy","Major Threat","Elite Threat"].includes(c.role) ? "bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}>{c.role}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCreaturesAndEnemies::creatures::${index}`]} locale={locale}>
                    {c.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Mobility Gear */}
      <section id="locked-2-dribbling-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksMobilityGear']} locale={locale}>{t.modules.lucidBlocksMobilityGear.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksMobilityGear.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.lucidBlocksMobilityGear.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksMobilityGear::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksMobilityGear.unlockMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Farming and Growth */}
      <section id="locked-2-weapons-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksFarmingAndGrowth']} locale={locale}>{t.modules.lucidBlocksFarmingAndGrowth.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksFarmingAndGrowth.intro}</p>
            <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] max-w-3xl mx-auto mt-4">
              {t.modules.lucidBlocksFarmingAndGrowth.subtitle}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksFarmingAndGrowth.items.map((weapon: any, index: number) => {
              const tierTone =
                weapon.tier === 'S'
                  ? 'bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]'
                  : weapon.tier === 'A'
                    ? 'bg-[hsl(var(--nav-theme)/0.16)] border-[hsl(var(--nav-theme)/0.42)] text-[hsl(var(--nav-theme-light))]'
                    : weapon.tier === 'B'
                      ? 'bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.34)] text-[hsl(var(--nav-theme-light))]'
                      : 'bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.28)] text-muted-foreground'
              const rarityTone =
                weapon.rarity === 'Unique'
                  ? 'bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]'
                  : weapon.rarity === 'Legendary'
                    ? 'bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]'
                    : weapon.rarity === 'Epic'
                      ? 'bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]'
                      : 'bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.25)] text-muted-foreground'

              return (
                <article
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold leading-tight">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::items::${index}`]} locale={locale}>
                        {weapon.name}
                      </LinkedTitle>
                    </h3>
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${rarityTone}`}>
                      {weapon.rarity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${tierTone}`}>
                      Tier {weapon.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{weapon.summary}</p>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                      Best For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {weapon.bestFor.map((role: string, roleIndex: number) => (
                        <span
                          key={roleIndex}
                          className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.25)]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/70">
                    <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                      Playstyle
                    </p>
                    <p className="text-sm text-muted-foreground">{weapon.playstyle}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 10: Best Early Unlocks */}
      <section id="locked-2-traits-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksBestEarlyUnlocks']} locale={locale}>{t.modules.lucidBlocksBestEarlyUnlocks.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksBestEarlyUnlocks.intro}</p>
            <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] max-w-3xl mx-auto mt-4">
              {t.modules.lucidBlocksBestEarlyUnlocks.subtitle}
            </p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.lucidBlocksBestEarlyUnlocks.items.map((trait: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setTraitsExpanded(traitsExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h3 className="font-bold">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBestEarlyUnlocks::items::${index}`]} locale={locale}>
                        {trait.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{trait.summary}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${traitsExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {traitsExpanded === index && (
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trait.content.map((detail: any, detailIndex: number) => (
                        <div key={detailIndex} className="p-4 rounded-lg border border-border bg-white/[0.02]">
                          <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">{detail.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Achievement Tracker */}
      <section id="locked-2-flow-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksAchievementTracker']} locale={locale}>{t.modules.lucidBlocksAchievementTracker.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksAchievementTracker.intro}</p>
            <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] max-w-3xl mx-auto mt-4">
              {t.modules.lucidBlocksAchievementTracker.subtitle}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksAchievementTracker.items.map((flow: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      flow.type === 'Flow Variant'
                        ? 'bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]'
                        : 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.28)] text-muted-foreground'
                    }`}
                  >
                    {flow.type}
                  </span>
                  {flow.type === 'Flow Variant' ? (
                    <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  ) : (
                    <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  )}
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksAchievementTracker::items::${index}`]} locale={locale}>
                    {flow.name}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{flow.summary}</p>
                <p className="text-sm text-muted-foreground mb-4">{flow.details}</p>
                <div className="pt-3 border-t border-border/70">
                  <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                    {t.common.bestWith}
                  </p>
                  <p className="text-sm text-muted-foreground">{flow.bestWith}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Singleplayer FAQ */}
      <section id="locked-2-position-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSingleplayerAndPlatformFAQ']} locale={locale}>{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.intro}</p>
            <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] max-w-3xl mx-auto mt-4">
              {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.subtitle}
            </p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.items.map((role: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setPositionExpanded(positionExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSingleplayerAndPlatformFAQ::items::${index}`]} locale={locale}>
                        {role.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{role.summary}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${positionExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {positionExpanded === index && (
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {role.content.map((detail: any, detailIndex: number) => (
                        <div key={detailIndex} className="p-4 rounded-lg border border-border bg-white/[0.02]">
                          <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">{detail.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: LOCKED 2 Height Guide */}
      <section id="locked-2-height-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSteamDeckAndController']} locale={locale}>{t.modules.lucidBlocksSteamDeckAndController.title}</LinkedTitle></h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSteamDeckAndController.intro}</p>
          </div>

          {/* Desktop: comparison table */}
          <div className="hidden md:block scroll-reveal overflow-x-auto rounded-xl border border-border bg-white/[0.02]">
            <table className="w-full min-w-[780px] text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
                <tr>
                  <th className="p-4 text-left font-semibold">Profile</th>
                  <th className="p-4 text-left font-semibold">Height Range</th>
                  <th className="p-4 text-left font-semibold">Speed</th>
                  <th className="p-4 text-left font-semibold">Stamina</th>
                  <th className="p-4 text-left font-semibold">Shot Power</th>
                  <th className="p-4 text-left font-semibold">Hitbox</th>
                  <th className="p-4 text-left font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksSteamDeckAndController.comparison.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-border/60 last:border-b-0">
                    <td className="p-4 font-semibold text-[hsl(var(--nav-theme-light))]">{row.profile}</td>
                    <td className="p-4 text-muted-foreground">{row.heightRange}</td>
                    <td className="p-4 text-muted-foreground">{row.speed}</td>
                    <td className="p-4 text-muted-foreground">{row.stamina}</td>
                    <td className="p-4 text-muted-foreground">{row.shotPower}</td>
                    <td className="p-4 text-muted-foreground">{row.hitbox}</td>
                    <td className="p-4 text-muted-foreground">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden scroll-reveal grid grid-cols-1 gap-4">
            {t.modules.lucidBlocksSteamDeckAndController.comparison.map((row: any, index: number) => (
              <article key={index} className="p-5 border border-border rounded-xl bg-white/[0.02]">
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-3">{row.profile}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Height Range:</span> <span className="text-muted-foreground">{row.heightRange}</span></p>
                  <p><span className="font-semibold">Speed:</span> <span className="text-muted-foreground">{row.speed}</span></p>
                  <p><span className="font-semibold">Stamina:</span> <span className="text-muted-foreground">{row.stamina}</span></p>
                  <p><span className="font-semibold">Shot Power:</span> <span className="text-muted-foreground">{row.shotPower}</span></p>
                  <p><span className="font-semibold">Hitbox:</span> <span className="text-muted-foreground">{row.hitbox}</span></p>
                  <p><span className="font-semibold">Best For:</span> <span className="text-muted-foreground">{row.bestFor}</span></p>
                </div>
              </article>
            ))}
          </div>

          <div className="scroll-reveal mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {t.modules.lucidBlocksSteamDeckAndController.notes.map((note: string, index: number) => (
              <div key={index} className="p-4 rounded-xl border border-border bg-white/[0.02] flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: LOCKED 2 Goalkeeper Guide */}
      <section id="locked-2-goalkeeper-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSettingsAndAccessibility']} locale={locale}>{t.modules.lucidBlocksSettingsAndAccessibility.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSettingsAndAccessibility.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.lucidBlocksSettingsAndAccessibility.steps.map((step: any, index: number) => (
              <article key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <h3 className="font-bold leading-tight">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSettingsAndAccessibility::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.keys.map((keyLabel: string, keyIndex: number) => (
                    <span
                      key={keyIndex}
                      className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-foreground"
                    >
                      {keyLabel}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: LOCKED 2 Tournament Mode */}
      <section id="locked-2-tournament-mode" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksUpdatesAndPatchNotes']} locale={locale}>{t.modules.lucidBlocksUpdatesAndPatchNotes.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksUpdatesAndPatchNotes.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.lucidBlocksUpdatesAndPatchNotes.steps.map((step: any, index: number) => (
              <article key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Clock className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                    {t.common.step} {step.step}
                  </span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksUpdatesAndPatchNotes::steps::${index}`]} locale={locale}>
                    {step.title}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.keys.map((keyLabel: string, keyIndex: number) => (
                    <span
                      key={keyIndex}
                      className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-foreground"
                    >
                      {keyLabel}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: LOCKED 2 Update Log */}
      <section id="locked-2-update-log" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCrashFixAndTroubleshooting']} locale={locale}>{t.modules.lucidBlocksCrashFixAndTroubleshooting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCrashFixAndTroubleshooting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.timeline.map((item: any, index: number) => (
              <article key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                  <Clock className="w-3.5 h-3.5" />
                  {item.date}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCrashFixAndTroubleshooting::timeline::${index}`]} locale={locale}>
                    {item.title}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{item.summary}</p>
                <div className="space-y-2">
                  {item.highlights.map((highlight: string, highlightIndex: number) => (
                    <div key={highlightIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/locked"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCAveQ4GrkmOzcGCMM3MtQJg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/17351304/MOMENTXM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/109883052223750/LOCKED-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={locale === 'en' ? '/about' : `/${locale}/about`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === 'en' ? '/terms-of-service' : `/${locale}/terms-of-service`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === 'en' ? '/copyright' : `/${locale}/copyright`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
