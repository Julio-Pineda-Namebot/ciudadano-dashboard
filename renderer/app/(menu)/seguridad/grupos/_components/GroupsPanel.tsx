'use client'

import { useEffect, useState } from 'react'
<<<<<<< Updated upstream
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
=======
import { toast } from 'sonner'
import { z } from 'zod'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
>>>>>>> Stashed changes
import { GroupsTable } from './GroupsTable'
import { GroupFormModal } from './GroupFormModal'
import { GroupDeleteDialog } from './GroupDeleteDialog'
import { getGroups, createGroup, updateGroup, deleteGroup } from '../actions'
import type { Group, GroupFormData } from '../_types/group'

<<<<<<< Updated upstream
export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([])
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  async function refresh() {
=======
const filterSchema = z.object({
  range: z.object({ from: z.string(), to: z.string() }),
})

type FilterValues = z.infer<typeof filterSchema>

export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(groups, 'createdAt')

  async function refresh() {
    setLoading(true)
>>>>>>> Stashed changes
    try {
      const data = await getGroups()
      setGroups(data)
    } catch {
      toast.error('No se pudieron cargar los grupos')
<<<<<<< Updated upstream
=======
    } finally {
      setLoading(false)
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
      <div>
        <h1 className="text-xl font-semibold">Grupos</h1>
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

      <GroupsTable
        groups={filteredData}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onCreate={openCreate}
      />
>>>>>>> Stashed changes

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
