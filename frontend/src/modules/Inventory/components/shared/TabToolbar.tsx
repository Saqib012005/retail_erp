import { Search } from 'lucide-react'
import { useState } from 'react'

type TabToolbarProps = {
  title: string
  count?: number | string
  searchPlaceholder?: string
  onSearch?: (q: string) => void
  filters?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Per-tab header row used by Product Setup tabs:
 * "Products / 15 records   [Search...] [Filters]  [actions...]"
 */
export default function TabToolbar({
  title,
  count,
  searchPlaceholder = 'Search...',
  onSearch,
  filters,
  actions,
}: TabToolbarProps) {
  const [q, setQ] = useState('')

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h2>
          {count !== undefined && (
            <span className="text-xs text-slate-400">{count} records</span>
          )}
        </div>
        <div className="relative">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              onSearch?.(e.target.value)
            }}
            placeholder={searchPlaceholder}
            className="h-8 w-44 sm:w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
          />
        </div>
        {filters}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Secondary button (Export / Import / Filters / Print Labels). */
export function GhostButton({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

/** Primary blue action button (+ New Product / + Generate Barcode). */
export function PrimaryButton({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 items-center gap-1.5 rounded-lg bg-[#155DFC] px-3 sm:px-3.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7]"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
