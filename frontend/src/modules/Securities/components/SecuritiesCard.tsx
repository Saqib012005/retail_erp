import {
  Shield,
  Users,
  KeyRound,
  Pencil,
  Copy,
  Trash2,
} from 'lucide-react'
import { getRoleColor } from '../../../utils/RoleTheme'

export interface CardActions {
  onEdit?: () => void
  onDelete?: () => void
  onClone?: () => void
}

export interface SecurityCardProps {
  id?: number
  roleName: string
  roleType: string
  description: string
  userCount: number
  permissionCount: number
  status?: string
  createdAt?: string
  updatedAt?: string
  actions?: CardActions
}

export function SecuritiesCard({
  roleName,
  roleType,
  description,
  userCount,
  permissionCount,
  status = 'ACTIVE',
  actions,
}: SecurityCardProps) {
  const primaryColor = getRoleColor(roleName)
  const isSuperAdmin = roleName.toLowerCase().includes('super admin')
  const isActive = status?.toUpperCase() === 'ACTIVE'

  return (
    <div className="group flex min-h-[250px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Top section */}
      <div>
        {/* Header: Icon + Name + Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              <Shield size={22} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-[#043793]">
                {roleName}
              </h3>
              <span
                className="inline-block mt-0.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                {roleType}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2 min-h-[38px]">
          {description}
        </p>

        {/* Metrics Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-150 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <Users size={13} className="text-slate-400" />
            <span>{userCount} Users</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-150 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <KeyRound size={13} className="text-slate-400" />
            <span>{permissionCount} Permissions</span>
          </div>
        </div>
      </div>

      {/* Footer action buttons */}
      <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={actions?.onEdit}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 px-3 text-xs font-semibold text-[#043793] transition hover:bg-blue-100 hover:border-blue-300 active:scale-95"
            title="Edit role configuration"
          >
            <Pencil size={12} />
            Edit
          </button>

          <button
            type="button"
            onClick={actions?.onClone}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300 active:scale-95"
            title="Duplicate this role"
          >
            <Copy size={12} />
            Clone
          </button>
        </div>

        {!isSuperAdmin && (
          <button
            type="button"
            onClick={actions?.onDelete}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50/60 text-red-600 transition hover:bg-red-100 hover:border-red-300 active:scale-95"
            title="Delete role"
            aria-label="Delete role"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
