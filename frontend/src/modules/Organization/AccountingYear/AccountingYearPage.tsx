import { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import YearListItem from './components/YearListItem'
import PeriodGrid from './components/PeriodGrid'
import AccountingYearForm from './components/AccountingYearForm'
import { AccountingYear, Period, PeriodStatus } from '@/types/accounting'
import { Plus } from 'lucide-react'

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

export default function AccountingYearPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYearId, setSelectedYearId] = useState(2)

  const [years, setYears] = useState<AccountingYear[]>([
    { id: 1, label: 'FY 2025-26', dateRange: '01 Apr 2025 — 31 Mar 2026', status: 'Active', closedPeriods: 2, totalPeriods: 12 },
    { id: 2, label: 'FY 2024-25', dateRange: '01 Apr 2024 — 31 Mar 2025', status: 'Closed', closedPeriods: 12, totalPeriods: 12 },
    { id: 3, label: 'FY 2026-27', dateRange: '01 Apr 2026 — 31 Mar 2027', status: 'Pending', closedPeriods: 0, totalPeriods: 12 },
  ])

  const selectedYear = years.find((y) => y.id === selectedYearId) || years[0]

  const getPeriodsForYear = (year: AccountingYear): Period[] => {
    const startYear = parseInt(year.dateRange.split(' ')[2]) || 2025
    return months.map((month, idx) => {
      const isNextCalendarYear = idx >= 9
      const displayYear = isNextCalendarYear ? `${startYear}-${String(startYear + 1).slice(2)}` : `${startYear}`

      let status: PeriodStatus = 'Pending'
      if (year.status === 'Closed') status = 'Closed'
      else if (year.status === 'Active' && idx < year.closedPeriods) status = 'Closed'
      else if (year.status === 'Active' && idx === year.closedPeriods) status = 'Open'

      return { month, year: displayYear, status }
    })
  }

  const handleAddYear = (data: any) => {
    const newYear: AccountingYear = {
      id: Date.now(),
      label: data.yearName || 'FY New',
      dateRange: `${data.fromDate} — ${data.toDate}`,
      status: 'Pending',
      closedPeriods: 0,
      totalPeriods: 12,
    }
    setYears((prev) => [...prev, newYear])
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-[#043793]">Accounting Year</h1>
          <p className="text-sm text-slate-500 mt-0.5">Fiscal year setup and period configuration</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#093055] to-[#043793] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} /> New Accounting Year
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div className="space-y-3">
          {years.map((year) => (
            <YearListItem
              key={year.id}
              year={year}
              isSelected={year.id === selectedYearId}
              onSelect={() => setSelectedYearId(year.id)}
            />
          ))}
        </div>

        {selectedYear && (
          <PeriodGrid
            year={selectedYear}
            periods={getPeriodsForYear(selectedYear)}
            onGenerate={() => console.log('Generate periods')}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
        <AccountingYearForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddYear}
        />
      </Modal>
    </div>
  )
}
