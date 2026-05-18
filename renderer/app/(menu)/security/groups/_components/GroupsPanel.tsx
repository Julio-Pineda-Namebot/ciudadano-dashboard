'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Filter } from '@/components/common/form/filter'
import { useDateRangeFilter, type DateRangeValue } from '@/lib/date-range'
import { GroupsTable } from '@/app/(menu)/security/groups/_components/GroupsTable'
import { GroupFormModal } from '@/app/(menu)/security/groups/_components/GroupFormModal'
import { GroupDeleteDialog } from '@/app/(menu)/security/groups/_components/GroupDeleteDialog'
import { getGroups, createGroup, updateGroup, deleteGroup } from '@/app/(menu)/security/groups/actions'
import { groupFilterSchema } from '@/app/(menu)/security/groups/_types/types'
import type { Group, GroupFormData, GroupFilterValues } from '@/app/(menu)/security/groups/_types/types'

export function GroupsPanel() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const { dateRange, onApply, filteredData } = useDateRangeFilter(groups, 'createdAt')

  async function refresh() {
    setLoading(true)
    try {
      const data = await getGroups()
      setGroups(data)
    } catch {
      toast.error('No se pudieron cargar los grupos')
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

  function openEdit(item: Group) {
    setEditTarget(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSubmit(data: GroupFormData) {
    try {
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
    } catch {
      toast.error(editTarget ? 'No se pudo actualizar el grupo' : 'No se pudo crear el grupo')
    }
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
      <Filter<GroupFilterValues>
        schema={groupFilterSchema}
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
