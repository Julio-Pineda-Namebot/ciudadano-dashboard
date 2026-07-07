'use client'

import { useEffect, useState } from 'react'
import { UserXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { AdminsTable } from '@/app/(menu)/security/web-staff/_components/AdminsTable'
import { AdminFormModal } from '@/app/(menu)/security/web-staff/_components/AdminFormModal'
import { AdminDeleteDialog } from '@/app/(menu)/security/web-staff/_components/AdminDeleteDialog'
import { AdminRestoreDialog } from '@/app/(menu)/security/web-staff/_components/AdminRestoreDialog'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, restoreAdmin } from '@/app/(menu)/security/web-staff/actions'
import { adminFilterSchema } from '@/app/(menu)/security/web-staff/_types/types'
import type {
  Admin,
  AdminFilterValues,
  CreateAdminFormData,
  UpdateAdminFormData,
} from '@/app/(menu)/security/web-staff/_types/types'

type View = 'active' | 'inactive'

export function AdminsPanel() {
  const [view, setView] = useState<View>('active')

  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Admin | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(admins, 'createdAt')

  const [inactive, setInactive] = useState<Admin[]>([])
  const [inactiveLoading, setInactiveLoading] = useState(false)
  const [restoreTarget, setRestoreTarget] = useState<Admin | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const data = await getAdmins('active')
      setAdmins(data)
    } catch {
      toast.error('No se pudo cargar el personal web')
    } finally {
      setLoading(false)
    }
  }

  async function refreshInactive() {
    setInactiveLoading(true)
    try {
      const data = await getAdmins('inactive')
      setInactive(data)
    } catch {
      toast.error('No se pudieron cargar los usuarios inactivos')
    } finally {
      setInactiveLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function openInactive() {
    setView('inactive')
    refreshInactive()
  }

  function openCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(item: Admin) {
    setEditTarget(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleCreate(data: CreateAdminFormData) {
    try {
      const created = await createAdmin(data)
      setAdmins((prev) => [...prev, created])
      toast.success('Usuario creado correctamente')
      closeForm()
    } catch {
      toast.error('No se pudo crear el usuario')
    }
  }

  async function handleUpdate(id: string, data: UpdateAdminFormData) {
    try {
      const updated = await updateAdmin(id, data)
      setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      toast.success('Usuario actualizado correctamente')
      closeForm()
    } catch {
      toast.error('No se pudo actualizar el usuario')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdmin(id)
      setAdmins((prev) => prev.filter((a) => a.id !== id))
      toast.success('Usuario desactivado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo desactivar el usuario')
    } finally {
      setDeleteTarget(null)
    }
  }

  async function handleRestore(id: string) {
    try {
      const restored = await restoreAdmin(id)
      setInactive((prev) => prev.filter((a) => a.id !== id))
      setAdmins((prev) => [...prev, restored])
      toast.success('Usuario reactivado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo reactivar el usuario')
    } finally {
      setRestoreTarget(null)
    }
  }

  return (
    <div className="p-6 space-y-4">
      {view === 'active' ? (
        <>
          <Filter<AdminFilterValues>
            schema={adminFilterSchema}
            defaultValues={{ range: dateRange }}
            body={['range']}
            config={{
              fields: {
                range: { type: 'date-range-picker', label: 'Rango de fechas' },
              },
            }}
            onSubmit={(values) => onApply(values.range as DateRangeValue)}
          />

          <AdminsTable
            admins={filteredData}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onCreate={openCreate}
            toolbarActions={
              <Button variant="outline" onClick={openInactive}>
                <UserXIcon />
                Inactivos
              </Button>
            }
          />
        </>
      ) : (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button type="button" onClick={() => setView('active')}>
                    Usuarios
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Inactivos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <AdminsTable
            admins={inactive}
            loading={inactiveLoading}
            variant="inactive"
            onRestore={setRestoreTarget}
          />
        </>
      )}

      <AdminFormModal
        open={formOpen}
        admin={editTarget}
        onClose={closeForm}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <AdminDeleteDialog
        admin={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <AdminRestoreDialog
        admin={restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
      />
    </div>
  )
}
