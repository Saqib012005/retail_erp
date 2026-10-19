import type { LucideIcon } from 'lucide-react'
import {
  Package,
  GitFork,
  Star,
  Sliders,
  Scale,
  CircleDollarSign,
  Receipt,
  Users,
  ScanBarcode,
  SlidersHorizontal,
  Boxes,
} from 'lucide-react'

export interface ProductSetupTabItem {
  key: string
  label: string
  icon: LucideIcon
}

/** The in-page tabs of Product Setup, in design order. */
export const PRODUCT_SETUP_TABS = [
  { key: 'products', label: 'Products', icon: Package },
  { key: 'hierarchy', label: 'Hierarchy', icon: GitFork },
  { key: 'brands', label: 'Brands', icon: Star },
  { key: 'attributes', label: 'Attributes', icon: Sliders },
  { key: 'uom', label: 'UOM', icon: Scale },
  { key: 'pricing', label: 'Pricing', icon: CircleDollarSign },
  { key: 'tax', label: 'Tax', icon: Receipt },
  { key: 'vendors', label: 'Vendor Mapping', icon: Users },
  { key: 'barcode', label: 'Barcode', icon: ScanBarcode },
  { key: 'inv-config', label: 'Inv. Config', icon: SlidersHorizontal },
  { key: 'kitting', label: 'Kitting & Bundles', icon: Boxes },
] as const

export type ProductSetupTabKey = (typeof PRODUCT_SETUP_TABS)[number]['key']
