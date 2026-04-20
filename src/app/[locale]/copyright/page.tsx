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
  const path = '/copyright'
  const title = 'Copyright Notice - LOCKED 2 Wiki'
  const description =
    'Copyright and intellectual property notice for LOCKED 2 Wiki, including fair-use guidance and takedown contact details.'
  const image = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    keywords: [
      'LOCKED 2 Wiki copyright',
      'LOCKED 2 DMCA',
      'Roblox wiki copyright notice',
      'fair use',
      'intellectual property',
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

export default async function Copyright() {
  const t = await getTranslations('common')

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Copyright Notice</h1>
          <p className="text-slate-300 text-lg mb-2">Intellectual property terms for LOCKED 2 Wiki</p>
          <p className="text-slate-400 text-sm">Last Updated: April 20, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Ownership of Site Content</h2>
            <p>
              Unless otherwise noted, original text and site structure on LOCKED 2 Wiki are owned by LOCKED 2 Wiki.
            </p>

            <h2>2. Game Assets and Trademarks</h2>
            <p>
              LOCKED 2 Wiki is unofficial and not affiliated with Roblox Corporation or MOMENTXM. Game names, logos,
              media, and related trademarks belong to their respective owners.
            </p>

            <h2>3. Fair Use</h2>
            <p>
              We reference game-related materials for commentary, education, and guide purposes. If you believe specific
              usage is inappropriate, contact us and we will review it promptly.
            </p>

            <h2>4. User Contributions</h2>
            <p>
              By submitting suggestions or content, you confirm you have the right to share it and grant LOCKED 2 Wiki
              a non-exclusive right to display and adapt it for site use.
            </p>

            <h2>5. Takedown Requests</h2>
            <p>
              For copyright concerns, include the original work, disputed URL, proof of ownership, and contact details
              so we can process your request quickly.
            </p>

            <h2>6. Contact</h2>
            <p>
              <strong>General:</strong>{' '}
              <a href="mailto:copyright@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                copyright@locked2.wiki
              </a>
              <br />
              <strong>DMCA:</strong>{' '}
              <a href="mailto:dmca@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                dmca@locked2.wiki
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
