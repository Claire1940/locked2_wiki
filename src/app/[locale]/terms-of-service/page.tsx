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
  const path = '/terms-of-service'
  const title = 'Terms of Service - LOCKED 2 Wiki'
  const description =
    'Read the Terms of Service for LOCKED 2 Wiki, including acceptable use, content rights, disclaimers, and contact details.'
  const image = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    keywords: [
      'LOCKED 2 Wiki terms',
      'LOCKED 2 terms of service',
      'Roblox wiki legal terms',
      'user agreement',
      'website terms',
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

export default async function TermsOfService() {
  const t = await getTranslations('common')

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-lg mb-2">Rules for using LOCKED 2 Wiki</p>
          <p className="text-slate-400 text-sm">Last Updated: April 20, 2026</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing LOCKED 2 Wiki, you agree to these Terms of Service. If you do not agree, please stop using
              this website.
            </p>

            <h2>2. Service Description</h2>
            <p>
              LOCKED 2 Wiki is an unofficial fan-made resource site covering guides, codes, and reference content for
              the Roblox game LOCKED:2.
            </p>

            <h2>3. Acceptable Use</h2>
            <ul>
              <li>Use the site only for lawful purposes.</li>
              <li>Do not attempt to disrupt, reverse engineer, or abuse the service.</li>
              <li>Do not use automated scraping in ways that harm performance or availability.</li>
              <li>Do not impersonate the site, game developer, or official platform entities.</li>
            </ul>

            <h2>4. Content Accuracy</h2>
            <p>
              We aim for accurate and current information, but game updates can make content outdated quickly. All
              content is provided "as is" without warranties.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              Original LOCKED 2 Wiki content belongs to this site unless stated otherwise. Game assets, trademarks, and
              platform marks belong to their respective owners, including Roblox and the LOCKED:2 creators.
            </p>

            <h2>6. External Links</h2>
            <p>
              We link to official resources such as Roblox, Discord, and YouTube. We do not control third-party sites
              and are not responsible for their content or policies.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent allowed by law, LOCKED 2 Wiki is not liable for indirect or consequential damages
              arising from site use, unavailable pages, or reliance on outdated game information.
            </p>

            <h2>8. Service Changes</h2>
            <p>
              We may modify, pause, or discontinue parts of the website at any time without prior notice.
            </p>

            <h2>9. Policy Changes</h2>
            <p>
              We may update these terms as the project evolves. Continued use after updates means you accept the latest
              terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              For legal questions, contact:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@locked2.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                legal@locked2.wiki
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
