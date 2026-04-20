import type { Metadata } from 'next'
import { getLatestArticles } from '@/lib/getLatestArticles'
import type { Language } from '@/lib/content'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Locale } from '@/i18n/routing'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const HOME_VIDEO_ID = 'k33SIX213ZA'
const HOME_VIDEO_TITLE = 'Release | LOCKED 2'

const HOME_SEO = {
  title: 'LOCKED 2 Wiki - Codes, Builds, Weapons & Guides',
  description:
    'LOCKED 2 Wiki tracks active codes, controls, tier lists, builds, dribbling guides, and update logs for Roblox LOCKED:2 players.',
  keywords:
    'LOCKED 2, LOCKED:2, Roblox, codes, builds, weapons, traits, flow, dribbling',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locked2.wiki'
  const homePath = '/'
  const localizedUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`
  const heroImage = `${siteUrl}/images/hero.webp`

  return {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    keywords: HOME_SEO.keywords.split(',').map((keyword) => keyword.trim()),
    alternates: buildLanguageAlternates(homePath, locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: localizedUrl,
      siteName: 'LOCKED 2 Wiki',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'LOCKED 2 Wiki Hero',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)

  return (
    <HomePageClient
      latestArticles={latestArticles}
      moduleLinkMap={moduleLinkMap}
      locale={locale}
      videoId={HOME_VIDEO_ID}
      videoTitle={HOME_VIDEO_TITLE}
    />
  )
}
