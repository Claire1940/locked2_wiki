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
  const path = '/privacy-policy'
  const title = 'Privacy Policy - LOCKED 2 Wiki'
  const description =
    'Read the LOCKED 2 Wiki Privacy Policy to understand how we use analytics, cookies, and limited technical data to run and improve the site.'
  const image = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    keywords: [
      'LOCKED 2 Wiki privacy policy',
      'LOCKED 2 privacy',
      'Roblox wiki privacy',
      'cookie policy',
      'analytics policy',
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

export default async function PrivacyPolicy() {
  const t = await getTranslations('common')

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg mb-2">How LOCKED 2 Wiki collects and uses limited data</p>
          <p className="text-slate-400 text-sm">Last Updated: April 20, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Overview</h2>
            <p>
              LOCKED 2 Wiki is an unofficial fan-made resource site for the Roblox game LOCKED:2. We collect the
              minimum information needed to operate, secure, and improve the website.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Technical data:</strong> IP address, browser type, operating system, and page load details.
              </li>
              <li>
                <strong>Usage data:</strong> page views, session duration, click behavior, and referral sources.
              </li>
              <li>
                <strong>Local preferences:</strong> language/theme settings saved in your browser.
              </li>
            </ul>

            <h2>3. Why We Use This Data</h2>
            <ul>
              <li>Maintain website availability and security</li>
              <li>Understand which guides are most useful</li>
              <li>Improve navigation, speed, and content quality</li>
            </ul>

            <h2>4. Cookies and Analytics</h2>
            <p>
              We may use cookies and analytics tools such as Google Analytics and Microsoft Clarity to understand
              aggregate behavior and improve user experience. These tools are used for site optimization and not for
              selling personal data.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              Our pages may link to Roblox, Discord, YouTube, and other third-party websites. Their privacy policies
              apply when you leave our site.
            </p>

            <h2>6. Children&apos;s Privacy</h2>
            <p>
              We do not knowingly collect personal data from children under 13. If you believe a child submitted
              personal information, contact us and we will remove it when legally required.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              Aggregated analytics data is retained only as long as needed for trend analysis, site performance, and
              abuse prevention.
            </p>

            <h2>8. International Access</h2>
            <p>
              The website may be hosted in regions different from your location. By using the site, you understand
              that technical data may be processed in those regions.
            </p>

            <h2>9. Policy Updates</h2>
            <p>
              We may update this policy to reflect legal or product changes. The date at the top of this page indicates
              the latest revision.
            </p>

            <h2>10. Contact</h2>
            <p>
              For privacy questions, contact:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                privacy@locked2.wiki
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
