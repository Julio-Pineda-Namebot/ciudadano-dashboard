'use client'

import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AdminsTable } from './AdminsTable'
import { AdminFormModal } from './AdminFormModal'
import { AdminDeleteDialog } from './AdminDeleteDialog'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../actions'
import type { Admin, CreateAdminFormData, UpdateAdminFormData } from '../_types/admin'

export function AdminsPanel() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [editTarget, setEditTarget] = useState<Admin | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  async function refresh() {
    try {
      const data = await getAdmins()
      setAdmins(data)
    } catch {
      toast.error('No se pudieron cargar los administradores')
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
    toast.success('Administrador creado correctamente')
    closeForm()
  }

  async function handleUpdate(id: string, data: UpdateAdminFormData) {
    const updated = await updateAdmin(id, data)
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    toast.success('Administrador actualizado correctamente')
    closeForm()
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdmin(id)
      setAdmins((prev) => prev.filter((a) => a.id !== id))
      toast.success('Administrador eliminado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar el administrador')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Administradores</h1>
          <p className="text-sm text-muted-foreground">{admins.length} registros</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Nuevo administrador
        </Button>
      </div>

      <AdminsTable admins={admins} onEdit={openEdit} onDelete={setDeleteTarget} />

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
