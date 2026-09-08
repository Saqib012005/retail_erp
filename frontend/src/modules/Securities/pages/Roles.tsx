import { useState, useMemo } from 'react'
import { SecuritiesCard } from '../components/SecuritiesCard'
import {
  Plus,
  Search,
  Shield,
  Users,
  KeyRound,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import toast from 'react-hot-toast'

interface RoleItem {
  id: number
  roleName: string
  roleType: string
  description: string
  userCount: number
  permissionCount: number
  status: string
  createdAt: string
  updatedAt: string
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: 1,
    roleName: 'Super Admin',
    roleType: 'SUPER ADMIN',
    description: 'Full unrestricted system access across all modules, configurations, and administrative tools.',
    userCount: 2,
    permissionCount: 48,
    status: 'ACTIVE',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-10',
  },
  {
    id: 2,
    roleName: 'Finance Manager',
    roleType: 'MANAGER',
    description: 'Manage finance ledgers, account groups, accounting years, currency, and financial reports.',
    userCount: 8,
    permissionCount: 24,
    status: 'ACTIVE',
    createdAt: '2026-08-02',
    updatedAt: '2026-08-12',
  },
  {
    id: 3,
    roleName: 'Inventory Manager',
    roleType: 'MANAGER',
    description: 'Oversee inventory stock, warehouse allocations, COGS recalculations, and goods dispatch.',
    userCount: 5,
    permissionCount: 18,
    status: 'ACTIVE',
    createdAt: '2026-08-03',
    updatedAt: '2026-08-13',
  },
  {
    id: 4,
    roleName: 'Sales Manager',
    roleType: 'MANAGER',
    description: 'Manage sales orders, customer accounts, store registers, pricing rules, and sales analytics.',
    userCount: 12,
    permissionCount: 22,
    status: 'ACTIVE',
    createdAt: '2026-08-04',
    updatedAt: '2026-08-14',
  },
  {
    id: 5,
    roleName: 'Store Manager',
    roleType: 'MANAGER',
    description: 'Manage store operations, POS counters, daily employee shifts, and business locations.',
    userCount: 6,
    permissionCount: 16,
    status: 'ACTIVE',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-15',
  },
  {
    id: 6,
    roleName: 'Employee',
    roleType: 'EMPLOYEE',
    description: 'Standard operational access to assigned branch tasks, daily data entry, and basic viewing.',
    userCount: 25,
    permissionCount: 8,
    status: 'ACTIVE',
    createdAt: '2026-08-06',
    updatedAt: '2026-08-16',
  },
]

export default function Roles() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    roleName: '',
    roleType: 'MANAGER',
    description: '',
    status: 'ACTIVE',
  })

  // Filtered roles calculation
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        search === '' ||
        role.roleName.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        typeFilter === 'ALL' ||
        role.roleType.toUpperCase() === typeFilter.toUpperCase()

      return matchesSearch && matchesType
    })
  }, [roles, search, typeFilter])

  // Summary Metrics
  const stats = useMemo(() => {
    const totalRoles = roles.length
    const totalUsers = roles.reduce((acc, r) => acc + r.userCount, 0)
    const totalPermissions = roles.reduce((acc, r) => acc + r.permissionCount, 0)
    const activeRoles = roles.filter((r) => r.status === 'ACTIVE').length
    return { totalRoles, totalUsers, totalPermissions, activeRoles }
  }, [roles])

  const handleOpenCreate = () => {
    setEditingRole(null)
    setFormData({
      roleName: '',
      roleType: 'MANAGER',
      description: '',
      status: 'ACTIVE',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (role: RoleItem) => {
    setEditingRole(role)
    setFormData({
      roleName: role.roleName,
      roleType: role.roleType,
      description: role.description,
      status: role.status,
    })
    setIsModalOpen(true)
  }

  const handleClone = (role: RoleItem) => {
    const newRole: RoleItem = {
      ...role,
      id: Date.now(),
      roleName: `${role.roleName} (Copy)`,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setRoles((prev) => [newRole, ...prev])
    toast.success(`Cloned role "${role.roleName}"`)
  }

  const handleDelete = (roleId: number, roleName: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId))
    toast.success(`Role "${roleName}" removed`)
  }

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.roleName.trim()) {
      toast.error('Role name is required')
      return
    }

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                roleName: formData.roleName.trim(),
                roleType: formData.roleType,
                description: formData.description.trim(),
                status: formData.status,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : r,
        ),
      )
      toast.success(`Role "${formData.roleName}" updated`)
    } else {
      const newRole: RoleItem = {
        id: Date.now(),
        roleName: formData.roleName.trim(),
        roleType: formData.roleType,
        description: formData.description.trim(),
        userCount: 0,
        permissionCount: 12,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setRoles((prev) => [newRole, ...prev])
      toast.success(`Role "${newRole.roleName}" created`)
    }

    setIsModalOpen(false)
  }

  return (
    <div className="page-shell">
      {/* Page Header */}
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">Security Roles</h1>
          <p className="page-subtitle">
            Manage organizational access levels, permissions, and assigned system roles
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-98"
          >
            <Plus size={16} /> Create Role
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Roles</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#043793]">
              <Shield size={14} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#043793]">{stats.totalRoles}</div>
          <div className="mt-1 text-[11px] text-slate-400">{stats.activeRoles} active in system</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assigned Users</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users size={14} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{stats.totalUsers}</div>
          <div className="mt-1 text-[11px] text-slate-400">Across all roles</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Permissions</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <KeyRound size={14} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-800">{stats.totalPermissions}</div>
          <div className="mt-1 text-[11px] text-slate-400">Module capability rules</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Security Status</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#043793]">
              <ShieldCheck size={14} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#043793]">Protected</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">RBAC enforcement on</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
        {/* Search input */}
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 border border-slate-200/80 focus-within:border-[#043793] focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search roles by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {['ALL', 'SUPER ADMIN', 'MANAGER', 'EMPLOYEE'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-[#043793] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type === 'ALL' ? 'All Roles' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Role Cards Grid */}
      {filteredRoles.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#043793]">
            <Shield size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching roles found</h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search criteria or role type filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setTypeFilter('ALL')
            }}
            className="mt-4 text-xs font-semibold text-[#043793] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRoles.map((role) => (
            <SecuritiesCard
              key={role.id}
              {...role}
              actions={{
                onEdit: () => handleOpenEdit(role),
                onClone: () => handleClone(role),
                onDelete: () => handleDelete(role.id, role.roleName),
              }}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-6 pt-6 pb-4 bg-slate-50/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#043793]">
                <Sparkles size={18} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#043793]">
                {editingRole ? 'Edit Security Role' : 'Create Security Role'}
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400 pl-10">
              Configure role permissions and access attributes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form id="role-form" onSubmit={handleSaveRole} className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Regional Auditor, Floor Supervisor"
              value={formData.roleName}
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-800 focus:border-[#043793] focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Role Type</label>
              <select
                value={formData.roleType}
                onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-[#043793] focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="SUPER ADMIN">SUPER ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="STANDARD">STANDARD</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-[#043793] focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Description</label>
            <textarea
              rows={3}
              placeholder="Outline what modules and operations this role has access to..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-[#043793] focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="h-10 cursor-pointer rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="role-form"
            className="h-10 cursor-pointer rounded-xl bg-[linear-gradient(#093055,#043793)] px-6 text-sm font-semibold text-white shadow-xs transition hover:opacity-95 active:scale-98"
          >
            {editingRole ? 'Save Changes' : 'Create Role'}
          </button>
        </div>
      </Modal>
    </div>
  )
}