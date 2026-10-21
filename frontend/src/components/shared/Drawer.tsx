// components/shared/Drawer.tsx
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'  // ← add this

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'productDetail'
  className?: string
  contentClassName?: string
  raw?: boolean
}

const sizeMap = {
  sm: 'w-[400px]',
  md: 'w-[500px]',
  lg: 'w-[600px]',
  xl: 'w-[750px]',
  productDetail: 'w-full sm:w-[500px] md:w-[48vw] lg:w-[44vw] max-w-[580px] min-w-[340px]',
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'xl',
  className = '',
  contentClassName = '',
  raw = false,
}: DrawerProps) {

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = '' // restore scroll on close
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex justify-end bg-black/40 backdrop-blur-[0.5px] transition-opacity"
      onClick={onClose}
    >
      <div
        className={`relative bg-white h-screen ${sizeMap[size]} flex flex-col shadow-2xl border-l border-slate-200/80 animate-slide-in-right ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {raw ? (
          children
        ) : (
          <>
            {/* Header */}
            {title && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
                  {description && (
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 transition ml-4 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition z-10 cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            )}
            {/* Scrollable Content */}
            <div className={`overflow-y-auto flex-1 px-6 py-4 ${contentClassName}`}>
              {children}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}