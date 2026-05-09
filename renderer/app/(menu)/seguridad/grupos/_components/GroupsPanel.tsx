'use client'

import { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { GroupsTable } from './GroupsTable'
import { GroupFormModal } from './GroupFormModal'
import { GroupDeleteDialog } from './GroupDeleteDialog'
import { getGroups, createGroup, updateGroup, deleteGroup } from '../actions'
import type { Group, GroupFormData } from '../_types/group'

export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([])
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  async function refresh() {
    try {
      const data = await getGroups()
      setGroups(data)
    } catch {
      toast.error('No se pudieron cargar los grupos')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function openCreate() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(item: Group) {
    setEditTarget(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSubmit(data: GroupFormData) {
    if (editTarget) {
      const updated = await updateGroup(editTarget.id, data)
      setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
      toast.success('Grupo actualizado correctamente')
    } else {
      const created = await createGroup(data)
      setGroups((prev) => [...prev, created])
      toast.success('Grupo creado correctamente')
    }
    closeForm()
  }

  async function handleDelete(id: string) {
    try {
      await deleteGroup(id)
      setGroups((prev) => prev.filter((g) => g.id !== id))
      toast.success('Grupo eliminado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar el grupo')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Grupos</h1>
          <p className="text-sm text-muted-foreground">{groups.length} registros</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Nuevo grupo
        </Button>
      </div>

      <GroupsTable groups={groups} onEdit={openEdit} onDelete={setDeleteTarget} />

      <GroupFormModal
        open={formOpen}
        group={editTarget}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <GroupDeleteDialog
        group={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
