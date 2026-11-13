import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type {
  AstrologySystem,
  PlanetaryPosition,
  ChartData,
  HousePlacement,
} from '../astrology/types'
import { vedicCalculator } from '../astrology/adapters/vedicCalculator'
import { westernCalculator } from '../astrology/adapters/westernCalculator'
import { BirthChartDiagram } from '../components/charts/BirthChartDiagram'
import { CalculationSettings } from '../components/charts/CalculationSettings'
import { ChartSummary } from '../components/charts/ChartSummary'
import { DistributionBreakdown } from '../components/charts/DistributionBreakdown'
import { KeyChartInsights } from '../components/charts/KeyChartInsights'
import { MockDataNotice } from '../components/charts/MockDataNotice'
import { PlanetaryPlacementTable } from '../components/charts/PlanetaryPlacementTable'
import { VedicChartDetails } from '../components/charts/VedicChartDetails'
import { WesternChartDetails } from '../components/charts/WesternChartDetails'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Footer } from '../components/navigation/Footer'
import { Navigation } from '../components/navigation/Navigation'

const systemOptions: Array<{ value: AstrologySystem; label: string }> = [
  { value: 'vedic', label: 'Vedic · Sidereal' },
  { value: 'western', label: 'Western · Tropical' },
]

function SystemChooser({
  invalidSystem,
}: {
  invalidSystem: boolean
}) {
  const [selectedSystem, setSelectedSystem] = useState<AstrologySystem | ''>('')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (selectedSystem) {
      navigate(`/chart?system=${selectedSystem}`)
    }
  }

  return (
    <Card as="section" aria-labelledby="system-choice-title" className="mt-8">
      {invalidSystem ? (
        <p className="mb-4 text-sm font-medium text-red-800" role="alert">
          The selected chart system is not supported. Choose Vedic or Western
          below.
        </p>
      ) : (
        <Badge>Choose a system to view its separate sample fixture</Badge>
      )}
      <h2
        className="mt-4 font-display text-2xl text-midnight"
        id="system-choice-title"
      >
        Which sample dashboard would you like to explore?
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Vedic uses a sidereal zodiac; Western uses a tropical zodiac. No system
        is selected for you.
      </p>
      <form className="mt-5" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Select one astrology system
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {systemOptions.map(({ value, label }) => (
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium ${selectedSystem === value ? 'border-[#765522] bg-champagne/10' : 'border-soft-gray bg-white'}`}
                key={value}
              >
                <input
                  checked={selectedSystem === value}
                  className="size-4 accent-[#765522]"
                  name="chart-system"
                  onChange={() => setSelectedSystem(value)}
                  required
                  type="radio"
                  value={value}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <Button className="mt-6" disabled={!selectedSystem} type="submit">
          View sample dashboard <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </form>
    </Card>
  )
}

function DashboardContent({
  chart,
  positions,
  houses,
  ascendant,
  children,
}: {
  chart: ChartData
  positions: PlanetaryPosition[]
  houses: HousePlacement[]
  ascendant: string | null
  children: ReactNode
}) {
  const { system } = chart
  return (
    <>
      <header className="mt-8">
        <Badge>{system === 'vedic' ? 'Vedic · Sidereal' : 'Western · Tropical'}</Badge>
        <h2 className="mt-4 font-display text-3xl text-midnight sm:text-4xl">
          {system === 'vedic' ? 'Vedic chart dashboard' : 'Western chart dashboard'}
        </h2>
      </header>
      <div className="mt-6">
        <MockDataNotice />
      </div>
      <div className="mt-6 grid gap-5">
        <ChartSummary
          ascendant={ascendant}
          chart={chart}
        />
        <CalculationSettings settings={chart.settings} />
        <BirthChartDiagram houses={houses} system={system} />
        <PlanetaryPlacementTable positions={positions} system={system} />
        {children}
      </div>
    </>
  )
}

function ChartDashboard({ system }: { system: AstrologySystem }) {
  if (system === 'vedic') {
    const chart = vedicCalculator.calculateChart()

    return (
      <DashboardContent
        ascendant={vedicCalculator.getAscendant(chart)}
        chart={chart}
        houses={vedicCalculator.getHousePlacements(chart)}
        positions={vedicCalculator.getPlanetaryPositions(chart)}
      >
        <VedicChartDetails chart={chart} />
      </DashboardContent>
    )
  }

  const chart = westernCalculator.calculateChart()

  return (
    <DashboardContent
      ascendant={westernCalculator.getAscendant(chart)}
      chart={chart}
      houses={westernCalculator.getHousePlacements(chart)}
      positions={westernCalculator.getPlanetaryPositions(chart)}
    >
      <DistributionBreakdown
        elements={chart.elements}
        modalities={chart.modalities}
      />
      <WesternChartDetails chart={chart} />
      <KeyChartInsights items={[]} title="Vedic-only fields" />
    </DashboardContent>
  )
}

export default function ChartPage() {
  const [searchParams] = useSearchParams()
  const requestedSystem = searchParams.get('system')
  const system: AstrologySystem | null =
    requestedSystem === 'vedic' || requestedSystem === 'western'
      ? requestedSystem
      : null
  const invalidSystem = requestedSystem !== null && system === null

  return (
    <div className="min-h-screen bg-ivory">
      <a
        className="sr-only z-50 rounded-full bg-champagne px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navigation />
      <main
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
        id="main-content"
      >
        <div className="mx-auto max-w-5xl">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-ink hover:text-[#765522]"
            to="/birth-details"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to birth details
          </Link>
          <h1 className="mt-6 font-display text-4xl leading-tight text-midnight sm:text-5xl">
            Sample chart dashboards
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/75">
            Explore one astrology system at a time. These fixture dashboards are
            educational interface examples, not personal readings.
          </p>
          {system ? (
            <ChartDashboard key={system} system={system} />
          ) : (
            <SystemChooser invalidSystem={invalidSystem} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
