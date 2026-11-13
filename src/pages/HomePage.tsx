import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Sparkles,
  Stars,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { buttonStyles } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ChartFrame } from '../components/common/ChartFrame'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'

const reportTopics = [
  {
    eyebrow: '01 / Self',
    title: 'Personality',
    description: 'Notice the patterns and perspectives that shape how you move through the world.',
  },
  {
    eyebrow: '02 / Direction',
    title: 'Career',
    description: 'Explore themes around motivation, strengths, and the way you approach work.',
  },
  {
    eyebrow: '03 / Connection',
    title: 'Relationships',
    description: 'Reflect on communication, emotional needs, and how you build connection.',
  },
  {
    eyebrow: '04 / Cycles',
    title: 'Timing',
    description: 'Understand the frameworks astrologers use to talk about cycles and periods.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Share the essentials',
    description: 'Enter the birth details needed for a chart. You choose the astrology system.',
  },
  {
    number: '02',
    title: 'Calculate with context',
    description: 'A deterministic calculation comes first; its settings and limitations stay visible.',
  },
  {
    number: '03',
    title: 'Explore your patterns',
    description: 'Interpretations connect back to chart placements, in language you can question.',
  },
]

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  description: string
  eyebrow: string
  light?: boolean
  title: string
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-champagne' : 'text-[#765522]'}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-4 font-display text-3xl leading-tight sm:text-4xl ${light ? 'text-ivory' : 'text-midnight'}`}>
        {title}
      </h2>
      <p className={`mt-4 text-base leading-7 ${light ? 'text-ivory/70' : 'text-ink/75'}`}>
        {description}
      </p>
    </div>
  )
}

function HeroArtwork() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto grid aspect-square w-full max-w-[25rem] place-items-center"
    >
      <div className="absolute inset-[8%] rounded-full border border-champagne/25" />
      <div className="absolute inset-[19%] rounded-full border border-lavender/25" />
      <div className="absolute inset-[30%] rounded-full border border-white/10" />
      <div className="absolute left-[13%] top-[25%] size-2 rounded-full bg-champagne shadow-[0_0_24px_4px_rgba(197,164,109,0.45)]" />
      <div className="absolute bottom-[19%] right-[22%] size-1.5 rounded-full bg-lavender" />
      <div className="absolute right-[14%] top-[34%] size-1 rounded-full bg-ivory/70" />
      <div className="relative grid size-[42%] place-items-center rounded-full border border-champagne/35 bg-gradient-to-br from-indigo to-midnight shadow-[0_30px_90px_-40px_rgba(197,164,109,0.55)]">
        <div className="size-[66%] rounded-full border border-champagne/60 bg-[radial-gradient(circle_at_35%_30%,rgba(197,164,109,0.28),rgba(32,41,67,0.1)_60%)]" />
        <span className="absolute size-3 rounded-full bg-champagne shadow-[0_0_22px_5px_rgba(197,164,109,0.55)]" />
      </div>
      <span className="absolute bottom-[9%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-ivory/50">
        Perspective, not prediction
      </span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content">
        <section className="overflow-hidden bg-midnight text-ivory">
          <div className="mx-auto grid min-h-[36rem] max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <div className="relative z-10">
              <Badge className="mb-7" tone="dark">
                <Sparkles aria-hidden="true" size={13} />
                A calmer way to explore your chart
              </Badge>
              <h1 className="max-w-3xl font-display text-5xl leading-[1.04] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
                Your chart holds a story.{' '}
                <span className="text-champagne">Let&apos;s understand it.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-ivory/75 sm:text-lg sm:leading-8">
                Explore the patterns, possibilities and planetary influences in
                your birth chart through personalised astrology intelligence.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className={`${buttonStyles.primary} inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
                  to="/birth-details"
                >
                  Explore my birth chart
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
                <a
                  className={`${buttonStyles.secondary} inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
                  href="#how-it-works"
                >
                  Discover how it works
                  <ArrowDown aria-hidden="true" size={16} />
                </a>
              </div>
              <p className="mt-5 text-xs leading-5 text-ivory/55">
                A prototype experience. Chart calculation is not available yet.
              </p>
            </div>
            <HeroArtwork />
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto grid max-w-7xl gap-3 px-5 py-5 text-xs leading-5 text-ivory/65 sm:grid-cols-3 sm:px-8">
              <p>Vedic and Western methods, kept distinct</p>
              <p className="sm:text-center">Calculation first. Interpretation second.</p>
              <p className="sm:text-right">Clear about what is known and what is not</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            description="Astrology has more than one tradition. ASTRAVA keeps the methods separate and makes the choice yours."
            eyebrow="A choice, clearly explained"
            title="Two traditions. Different ways of reading the sky."
          />
          <div className="grid gap-4 sm:grid-cols-2" id="methodology">
            <Card className="scroll-mt-28 p-7" id="vedic">
              <div className="mb-7 flex size-11 items-center justify-center rounded-full bg-midnight text-champagne">
                <Stars aria-hidden="true" size={20} strokeWidth={1.6} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#765522]">
                Vedic astrology
              </p>
              <h3 className="mt-3 font-display text-2xl text-midnight">Sidereal zodiac</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">
                Uses a sidereal zodiac and an explicitly stated ayanamsha. Its
                chart language includes Rashi, Nakshatra, and traditional
                planetary periods.
              </p>
              <p className="mt-5 border-t border-soft-gray pt-4 text-xs leading-5 text-ink/65">
                Default setting in the brief: Lahiri ayanamsha.
              </p>
            </Card>
            <Card className="scroll-mt-28 p-7" id="western">
              <div className="mb-7 flex size-11 items-center justify-center rounded-full bg-midnight text-champagne">
                <Compass aria-hidden="true" size={20} strokeWidth={1.6} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#765522]">
                Western astrology
              </p>
              <h3 className="mt-3 font-display text-2xl text-midnight">Tropical zodiac</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">
                Uses a tropical zodiac with the house system and aspect orbs
                stated. Interpretations focus on placements, aspects, elements,
                and modalities.
              </p>
              <p className="mt-5 border-t border-soft-gray pt-4 text-xs leading-5 text-ink/65">
                House system and orbs will be explicit when calculations exist.
              </p>
            </Card>
          </div>
        </section>

        <section className="bg-[#efede6]" id="how-it-works">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <SectionHeading
              description="A clear sequence keeps the foundations trustworthy and the interpretation grounded."
              eyebrow="The approach"
              title="From birth details to a considered perspective."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <Card className="border-white/80 bg-white/75 p-7" key={step.number}>
                  <p className="font-display text-4xl text-[#8a6935]">{step.number}</p>
                  <h3 className="mt-6 font-display text-2xl text-midnight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/75">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHeading
              description="Explore thoughtful starting points—not fixed conclusions or promises."
              eyebrow="A personal report, in context"
              title="Questions worth exploring."
            />
            <div className="flex flex-col gap-2">
              <a
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-ink underline decoration-champagne underline-offset-4 hover:text-[#765522]"
                href="#sample-preview"
              >
                See a sample layout <ArrowRight aria-hidden="true" size={16} />
              </a>
              <Link
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-ink underline decoration-champagne underline-offset-4 hover:text-[#765522]"
                to="/explore"
              >
                Ask a question and return later <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportTopics.map((topic) => (
              <Card className="p-6" key={topic.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#765522]">
                  {topic.eyebrow}
                </p>
                <h3 className="mt-5 font-display text-2xl text-midnight">{topic.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/75">{topic.description}</p>
              </Card>
            ))}
          </div>
          <Link
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-ink underline decoration-champagne underline-offset-4 hover:text-[#765522]"
            to="/reports"
          >
            Browse report previews <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </section>

        <section className="bg-midnight text-ivory" id="sample-preview">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Badge className="mb-5" tone="dark">Sample layout · not a real chart</Badge>
              <SectionHeading
                description="The dashboard is designed to make chart details easier to navigate. This illustration contains no calculated placements or personal data."
                eyebrow="A glimpse of the experience"
                light
                title="A thoughtful space for chart details."
              />
              <ul className="mt-7 space-y-3 text-sm leading-6 text-ivory/75">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-champagne" />
                  Method and settings shown alongside results
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-champagne" />
                  Plain-language summaries connected to chart data
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-champagne" />
                  Accessible text alternatives for visual charts
                </li>
              </ul>
            </div>
            <ChartFrame
              description="Illustrative interface only. No planetary positions have been calculated."
              title="Chart overview"
            >
              <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="grid min-h-52 place-items-center rounded-2xl border border-white/10 bg-midnight/50 p-5">
                  <div
                    aria-hidden="true"
                    className="relative grid aspect-square w-full max-w-44 place-items-center rounded-full border border-champagne/35"
                  >
                    <span className="absolute inset-[18%] rounded-full border border-lavender/35" />
                    <span className="absolute inset-[36%] rounded-full border border-white/15" />
                    <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne" />
                  </div>
                  <p className="mt-3 text-center text-xs text-ivory/60">
                    Layout preview · no chart data
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-3">
                  {['Planetary placements', 'Chart summary', 'Interpretation'].map((item) => (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={item}>
                      <p className="text-sm font-medium text-ivory/80">{item}</p>
                      <p className="mt-1 text-xs text-ivory/50">
                        {item === 'Interpretation'
                          ? 'Fixture-backed sample preview available'
                          : 'Available in a later phase'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ChartFrame>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              description="Trust starts with being precise about the limits of a tool, not just its possibilities."
              eyebrow="Method and accuracy"
              title="The calculation is the source. Interpretation comes after."
            />
            <p className="mt-5 max-w-xl text-sm leading-6 text-ink/75">
              ASTRAVA is designed so that chart calculations remain separate
              from the language used to explain them. Settings will be visible,
              and interpretations will point back to the placements they draw
              on.               No real chart calculation is connected; current dashboards use
              clearly labelled sample fixtures.
            </p>
          </div>
          <div className="grid gap-3 self-center">
            {[
              'No silent switch between sidereal and tropical systems',
              'Birth time uncertainty is explained, never guessed',
              'Sample content is clearly distinguished from personal results',
            ].map((item) => (
              <div className="flex items-start gap-3 rounded-2xl border border-soft-gray bg-white p-4" key={item}>
                <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#e8e2d4] text-[#765522]">
                  <span className="size-1.5 rounded-full bg-[#765522]" />
                </span>
                <p className="text-sm leading-6 text-ink/80">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-soft-gray bg-[#efede6]" id="faq">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765522]">A note on the prototype</p>
              <h2 className="mt-3 font-display text-2xl text-midnight">What can I do here today?</h2>
              <p className="mt-3 text-sm leading-6 text-ink/75">
                Explore the product approach, enter birth details for a
                clearly labelled sample flow, and save questions to revisit.
                Verified chart calculations and personalized readings are not
                available yet.
              </p>
            </div>
            <div id="privacy">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765522]">Privacy by design</p>
              <h2 className="mt-3 font-display text-2xl text-midnight">Your details stay yours.</h2>
              <p className="mt-3 text-sm leading-6 text-ink/75">
                The sample flow keeps unsaved birth details in memory. If you
                opt in to an account, your browser encrypts birth details and
                saved questions before sending them to the self-hosted API.
                Keep your recovery key safe; it is needed if you forget your
                vault passphrase.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ivory px-5 py-16 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765522]">Curiosity, with context</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-midnight sm:text-4xl">
            A chart is a perspective to explore, not a script to follow.
          </h2>
          <Link
            className={`${buttonStyles.primary} mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
            to="/birth-details"
          >
            Explore my chart <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
