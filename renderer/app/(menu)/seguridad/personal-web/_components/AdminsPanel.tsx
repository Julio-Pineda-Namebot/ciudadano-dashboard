'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { AdminsTable } from './AdminsTable'
import { AdminFormModal } from './AdminFormModal'
import { AdminDeleteDialog } from './AdminDeleteDialog'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../actions'
import type { Admin, CreateAdminFormData, UpdateAdminFormData } from '../_types/admin'

const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

type FilterValues = z.infer<typeof filterSchema>

export function AdminsPanel() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Admin | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(admins, 'createdAt')

  async function refresh() {
    setLoading(true)
    try {
      const data = await getAdmins()
      setAdmins(data)
    } catch {
      toast.error('No se pudo cargar el personal web')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

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
    const created = await createAdmin(data)
    setAdmins((prev) => [...prev, created])
    toast.success('Usuario creado correctamente')
    closeForm()
  }

  async function handleUpdate(id: string, data: UpdateAdminFormData) {
    const updated = await updateAdmin(id, data)
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    toast.success('Usuario actualizado correctamente')
    closeForm()
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdmin(id)
      setAdmins((prev) => prev.filter((a) => a.id !== id))
      toast.success('Usuario eliminado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar el usuario')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Personal web</h1>
      </div>

      <Filter<FilterValues>
        schema={filterSchema}
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
      />

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
    </div>
  )
}
