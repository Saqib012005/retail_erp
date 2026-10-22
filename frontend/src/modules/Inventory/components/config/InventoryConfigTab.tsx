import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { InventoryConfigCard } from '@/types/inventorySetup'
import { Scan, Gauge, RotateCcw, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InventoryConfigTab() {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-config'],
    queryFn: inventorySetupService.getInventoryConfig,
  })

  const [localCards, setLocalCards] = useState<InventoryConfigCard[]>([])
  const [initialized, setInitialized] = useState(false)

  // Sync initial query cards
  if (!initialized && cards.length > 0) {
    setLocalCards(cards)
    setInitialized(true)
  }

  // Handle toggle
  const handleToggle = (cardId: string, itemId: string) => {
    setLocalCards((prev) =>
      prev.map((c) =>
        c.id !== cardId
          ? c
          : {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId ? { ...it, enabled: !it.enabled } : it
              ),
            }
      )
    )
  }

  // Handle Reset Defaults
  const handleResetDefaults = () => {
    setLocalCards(cards)
    toast.success('Configuration reset to default policies')
  }

  // Handle Save
  const handleSave = () => {
    toast.success('Inventory configuration saved successfully')
  }

  const trackingCard = (localCards.length ? localCards : cards).find(
    (c) => c.id === 'tracking-policies' || c.id === 'card-general'
  )
  const valuationCard = (localCards.length ? localCards : cards).find(
    (c) => c.id === 'valuation-policy' || c.id === 'card-valuation'
  )

  return (
    <div className="w-full pb-8">
      {/* Top Header Row matching Figma screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
            Inventory Configuration
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Configure tracking, valuation, and approval policies
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RotateCcw size={13} className="text-slate-500" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            <Check size={14} className="stroke-[2.5]" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-white border border-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-white border border-slate-200" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          {/* Card 1: Tracking Policies */}
          {trackingCard && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
              {/* Card Header */}
              <div className="flex items-center gap-2.5 mb-5 pb-1">
                <Scan size={18} className="text-[#155DFC]" />
                <h2 className="text-[15px] font-bold text-[#0F2A66]">
                  {trackingCard.title}
                </h2>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {trackingCard.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 first:pt-1 last:pb-1"
                  >
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-[#0F2A66] leading-tight">
                        {item.label}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 text-xs text-slate-400 font-normal leading-normal">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.enabled}
                      onClick={() => handleToggle(trackingCard.id, item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.enabled ? 'bg-[#155DFC]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-[3px] ${
                          item.enabled
                            ? 'translate-x-[19px]'
                            : 'translate-x-[3px]'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 2: Valuation Policy */}
          {valuationCard && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
              {/* Card Header */}
              <div className="flex items-center gap-2.5 mb-5 pb-1">
                <Gauge size={18} className="text-[#9333EA]" />
                <h2 className="text-[15px] font-bold text-[#0F2A66]">
                  {valuationCard.title}
                </h2>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {valuationCard.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 first:pt-1 last:pb-1"
                  >
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-[#0F2A66] leading-tight">
                        {item.label}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 text-xs text-slate-400 font-normal leading-normal">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.enabled}
                      onClick={() => handleToggle(valuationCard.id, item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.enabled ? 'bg-[#155DFC]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-[3px] ${
                          item.enabled
                            ? 'translate-x-[19px]'
                            : 'translate-x-[3px]'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
