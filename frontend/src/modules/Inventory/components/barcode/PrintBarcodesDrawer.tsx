import { useState, useMemo } from 'react'
import {
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
} from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface PrintBarcodesDrawerProps {
  isOpen: boolean
  onClose: () => void
  totalCount?: number
}

const TEMPLATE_OPTIONS = [
  'Standard Label (40x25mm)',
  'Label with Company Details',
  'Garment Label Sticker',
  'Jewelry Label Sticker',
  'Detailed Product Label',
  'Price Tag Label',
]

const PAPER_SIZES = [
  'A4 (210 × 297 mm)',
  'A3 (297 × 420 mm)',
  'Letter (8.5 × 11 in)',
  'Roll 100mm (Thermal)',
]

export default function PrintBarcodesDrawer({
  isOpen,
  onClose,
  totalCount = 250,
}: PrintBarcodesDrawerProps) {
  // Print Configuration State
  const [template, setTemplate] = useState('Standard Label (40x25mm)')
  const [paperSize, setPaperSize] = useState('A4 (210 × 297 mm)')
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Portrait')
  const [labelsPerRow, setLabelsPerRow] = useState<number>(3)
  const [marginTop, setMarginTop] = useState<number>(10)
  const [marginBottom, setMarginBottom] = useState<number>(10)
  const [marginLeft, setMarginLeft] = useState<number>(12)
  const [marginRight, setMarginRight] = useState<number>(12)

  // Preview Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 5

  // Dummy preview labels for current page
  const previewLabels = useMemo(() => {
    const rows = orientation === 'Portrait' ? 4 : 3
    const count = labelsPerRow * rows
    const startNum = (currentPage - 1) * count + 20
    return Array.from({ length: count }, (_, i) => ({
      code: `PROD-${String(startNum + i).padStart(4, '0')}`,
      price: `$${(24.99 + (i % 5) * 5).toFixed(2)}`,
    }))
  }, [orientation, labelsPerRow, currentPage])

  // Download PDF handler
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: orientation === 'Portrait' ? 'p' : 'l',
        unit: 'mm',
        format: 'a4',
      })

      doc.setFontSize(16)
      doc.text('Print Barcodes - Barcode Production Module', 14, 20)
      doc.setFontSize(10)
      doc.text(`Template: ${template} | Orientation: ${orientation} | Labels per Row: ${labelsPerRow}`, 14, 28)
      doc.text(`Total Labels: ${totalCount} Units | Estimated Pages: ${totalPages} A4 Sheets`, 14, 35)

      // Simple grid representation in PDF
      let y = 48
      previewLabels.forEach((item, i) => {
        const x = 14 + (i % labelsPerRow) * 60
        doc.rect(x, y, 52, 25)
        doc.setFontSize(8)
        doc.text(item.code, x + 6, y + 6)
        doc.text('||||||||||||||||||||||||||||', x + 6, y + 14)
        doc.text(item.price, x + 6, y + 21)
        if ((i + 1) % labelsPerRow === 0) {
          y += 30
        }
      })

      doc.save(`barcodes-${template.replace(/\s+/g, '-').toLowerCase()}.pdf`)
      toast.success(`Downloaded Barcodes PDF (${totalPages} pages, ${totalCount} labels)`)
    } catch {
      toast.error('Failed to generate PDF')
    }
  }

  // Print Barcodes handler
  const handlePrint = () => {
    toast.success(`Sent ${totalCount} labels to print spooler (${paperSize})`)
    window.print()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      raw
      size="productDetail"
      className="w-full sm:w-[540px] md:w-[580px] lg:w-[620px] max-w-[650px]"
    >
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-5 pb-3 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
              Print Barcodes
            </h2>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Barcode Production &amp; Utility Module
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1 -mr-1 -mt-0.5 cursor-pointer rounded-lg hover:bg-slate-100"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* SECTION: PRINT CONFIGURATION */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              PRINT CONFIGURATION
            </p>

            {/* Barcode Template */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Barcode Template
              </label>
              <div className="relative">
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition shadow-2xs pr-9"
                >
                  {TEMPLATE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Paper Size & Orientation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
              {/* Paper Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paper Size
                </label>
                <div className="relative">
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition shadow-2xs pr-9"
                  >
                    {PAPER_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Orientation
                </label>
                <div className="flex h-10 items-center rounded-lg bg-slate-100 p-1 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setOrientation('Portrait')}
                    className={`flex-1 h-8 rounded-md text-xs font-semibold transition cursor-pointer ${
                      orientation === 'Portrait'
                        ? 'bg-white text-[#155DFC] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('Landscape')}
                    className={`flex-1 h-8 rounded-md text-xs font-semibold transition cursor-pointer ${
                      orientation === 'Landscape'
                        ? 'bg-white text-[#155DFC] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            </div>

            {/* Labels per Row & Margins */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              {/* Labels per Row */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Labels per Row
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={labelsPerRow}
                  onChange={(e) =>
                    setLabelsPerRow(Math.max(1, Math.min(6, Number(e.target.value))))
                  }
                  className="w-full h-10 px-3.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
                />
              </div>

              {/* Margins */}
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Margins (mm)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'T', val: marginTop, set: setMarginTop },
                    { label: 'B', val: marginBottom, set: setMarginBottom },
                    { label: 'L', val: marginLeft, set: setMarginLeft },
                    { label: 'R', val: marginRight, set: setMarginRight },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center h-10 px-2 rounded-lg border border-slate-200 bg-white shadow-2xs"
                    >
                      <span className="text-[11px] font-bold text-slate-400 mr-1.5">
                        {m.label}
                      </span>
                      <input
                        type="number"
                        value={m.val}
                        onChange={(e) => m.set(Number(e.target.value))}
                        className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: PRINT PREVIEW */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              PRINT PREVIEW
            </p>

            {/* Canvas Container */}
            <div className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-5 flex flex-col items-center justify-center">
              {/* White A4 Sheet simulation */}
              <div
                className={`bg-white shadow-md rounded border border-slate-200/60 p-3.5 transition-all duration-300 ${
                  orientation === 'Portrait'
                    ? 'w-[280px] sm:w-[310px] h-[350px]'
                    : 'w-[350px] sm:w-[380px] h-[250px]'
                }`}
              >
                <div
                  className="grid gap-2 h-full"
                  style={{
                    gridTemplateColumns: `repeat(${labelsPerRow}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${orientation === 'Portrait' ? 4 : 3}, minmax(0, 1fr))`,
                  }}
                >
                  {previewLabels.map((lbl, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200/70 rounded p-1.5 flex flex-col items-center justify-between bg-white text-center shadow-2xs"
                    >
                      <span className="text-[8px] font-mono font-medium text-slate-600 leading-none">
                        {lbl.code}
                      </span>

                      {/* Barcode graphic lines */}
                      <div className="flex items-end justify-center gap-[1px] h-5 py-0.5 w-full overflow-hidden">
                        <span className="w-[1.5px] h-full bg-slate-900" />
                        <span className="w-[1px] h-full bg-slate-900" />
                        <span className="w-[2.5px] h-full bg-slate-900" />
                        <span className="w-[1px] h-full bg-slate-900" />
                        <span className="w-[2px] h-full bg-slate-900" />
                        <span className="w-[1px] h-full bg-slate-900" />
                        <span className="w-[3px] h-full bg-slate-900" />
                        <span className="w-[1px] h-full bg-slate-900" />
                        <span className="w-[1.5px] h-full bg-slate-900" />
                        <span className="w-[2px] h-full bg-slate-900" />
                        <span className="w-[1px] h-full bg-slate-900" />
                        <span className="w-[2.5px] h-full bg-slate-900" />
                      </div>

                      <span className="text-[8px] font-bold text-slate-800 font-mono leading-none">
                        {lbl.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Stepper */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Metrics Box */}
            <div className="mt-4 rounded-xl border border-blue-100 bg-[#F0F7FF] px-4 py-3 grid grid-cols-3 divide-x divide-blue-200/60">
              <div className="px-2 text-center first:pl-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  TOTAL LABELS
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#0F2A66]">
                  {totalCount} Units
                </p>
              </div>
              <div className="px-2 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  EST. PAGES
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#0F2A66]">
                  {totalPages} A4 Sheets
                </p>
              </div>
              <div className="px-2 text-center last:pr-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  PRINT SPEED
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#0F2A66]">
                  ~ 45 Seconds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#155DFC] hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <Download size={14} className="text-[#155DFC]" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#155DFC] hover:bg-blue-600 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Barcodes</span>
          </button>
        </div>
      </div>
    </Drawer>
  )
}
