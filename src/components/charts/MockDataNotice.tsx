import { Badge } from '../common/Badge'

export function MockDataNotice() {
  return (
    <aside
      aria-label="Sample data notice"
      className="rounded-2xl border border-champagne/45 bg-champagne/10 p-4 sm:flex sm:items-center sm:gap-4"
    >
      <Badge>Sample data, not your chart</Badge>
      <p className="mt-3 text-sm leading-6 text-ink/75 sm:mt-0">
        These illustrative fixture values are not calculated from your birth
        details. No personal chart has been generated.
      </p>
    </aside>
  )
}
