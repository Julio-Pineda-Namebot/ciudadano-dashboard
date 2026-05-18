'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'
import { Form } from '@/components/common/form/Form'
import { cn } from '@/lib/utils'
import { groupSchema, EMPTY_GROUP_FORM } from '@/app/(menu)/security/groups/_types/types'
import type { GroupFormModalProps, GroupFormValues } from '@/app/(menu)/security/groups/_types/types'

export function GroupFormModal({ open, group, onClose, onSubmit }: GroupFormModalProps) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
  const isEdit = group !== null

  const defaultValues: GroupFormValues = isEdit
    ? { name: group.name, description: group.description ?? '' }
    : EMPTY_GROUP_FORM

  const handleSubmit = async (values: GroupFormValues) => {
    await onSubmit({
      name: values.name,
      description: values.description ? values.description : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEdit ? 'Editar grupo' : 'Nuevo grupo'}</DialogTitle>
        </DialogHeader>

        <Form<GroupFormValues>
          key={group?.id ?? 'new'}
          schema={groupSchema}
          defaultValues={defaultValues}
          formId="group-form"
          hideSubmit
          className="gap-0"
          bodyClassName="px-6 py-2"
          body={['name', 'description']}
          fields={{
            name: {
              type: 'text',
              label: 'Nombre',
              placeholder: 'Ej. Supervisores',
            },
            description: {
              type: 'textarea',
              label: 'Descripción',
              placeholder: 'Descripción opcional',
              rows: 3,
              maxLength: 255,
            },
          }}
          onSubmit={handleSubmit}
          renderFooter={({ isSubmitting }) => (
            <DialogFooter className="px-6 pb-6 pt-2 border-t border-border flex-row! justify-between!">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className={cn(btnClass)}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    <span>Guardando...</span>
                  </>
                ) : isEdit ? (
                  'Guardar cambios'
                ) : (
                  'Crear grupo'
                )}
              </Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}
