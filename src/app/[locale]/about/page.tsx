import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locked2.wiki'
  const path = '/about'
  const title = 'About LOCKED 2 Wiki'
  const description =
    'Learn about LOCKED 2 Wiki, an unofficial community-driven resource hub for Roblox LOCKED:2 guides, codes, builds, and updates.'
  const image = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    keywords: [
      'about LOCKED 2 Wiki',
      'LOCKED 2 community wiki',
      'Roblox LOCKED 2 guides',
      'fan-made game wiki',
      'LOCKED 2 resources',
    ],
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'LOCKED 2 Wiki',
      title,
      description,
      images: [
        {
          url: image,
          width: 1920,
          height: 1080,
          alt: 'LOCKED 2 Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default async function About() {
  const t = await getTranslations('common')

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About LOCKED 2 Wiki</h1>
          <p className="text-slate-300 text-lg mb-2">Community-driven resources for Roblox LOCKED:2 players</p>
          <p className="text-slate-400 text-sm">Last Updated: April 20, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>What This Site Is</h2>
            <p>
              LOCKED 2 Wiki is an unofficial fan-made knowledge base focused on helping players improve in LOCKED:2.
              We curate practical guides for codes, weapons, traits, flows, dribbling, and role-based builds.
            </p>

            <h2>Our Mission</h2>
            <ul>
              <li>Publish accurate and easy-to-follow guides for new and advanced players.</li>
              <li>Track updates and changes that affect the competitive meta.</li>
              <li>Keep key resources in one fast, searchable, multilingual site.</li>
            </ul>

            <h2>What You Can Find Here</h2>
            <ul>
              <li>Active and expired code tracking</li>
              <li>Weapon and build breakdowns by position and playstyle</li>
              <li>Dribbling and progression guides</li>
              <li>Patch-focused notes and strategy updates</li>
            </ul>

            <h2>Official Channels</h2>
            <p>
              We link to official LOCKED:2 channels whenever possible, including Roblox, Discord, Roblox Group, and
              YouTube.
            </p>

            <h2>Disclaimer</h2>
            <p>
              LOCKED 2 Wiki is not affiliated with Roblox Corporation or MOMENTXM. All game trademarks and assets
              belong to their respective owners.
            </p>

            <h2>Contact</h2>
            <p>
              <strong>General:</strong>{' '}
              <a href="mailto:contact@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                contact@locked2.wiki
              </a>
              <br />
              <strong>Support:</strong>{' '}
              <a href="mailto:support@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                support@locked2.wiki
              </a>
              <br />
              <strong>Partnerships:</strong>{' '}
              <a href="mailto:partners@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                partners@locked2.wiki
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            {'<-'} {t('backToHome')}
          </Link>
        </div>
      </section>
    </div>
  )
}
