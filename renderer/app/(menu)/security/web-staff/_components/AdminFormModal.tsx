'use client'

import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
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
import FormField from '@/components/common/form/FormField'
import { cn } from '@/lib/utils'
import {
  buildAdminSchema,
  EMPTY_ADMIN_FORM,
} from '@/app/(menu)/security/web-staff/_types/types'
import type {
  AdminFormModalProps,
  AdminFormValues,
  CreateAdminFormData,
  UpdateAdminFormData,
} from '@/app/(menu)/security/web-staff/_types/types'
import { getGroups } from '@/app/(menu)/security/groups/actions'
import type { Group } from '@/app/(menu)/security/groups/_types/types'

export function AdminFormModal({ open, admin, onClose, onCreate, onUpdate }: AdminFormModalProps) {
  const isEdit = admin !== null
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    if (!open) return
    getGroups()
      .then(setGroups)
      .catch(() => setGroups([]))
  }, [open])

  const schema = buildAdminSchema(isEdit)
  const groupOptions = groups.map((g) => ({ value: g.id, label: g.name }))

  const defaultValues: AdminFormValues = isEdit
    ? {
        username: admin.username,
        password: '',
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        groupId: admin.group?.id ?? '',
      }
    : EMPTY_ADMIN_FORM

  const handleSubmit = async (values: AdminFormValues) => {
    if (isEdit && admin) {
      const payload: UpdateAdminFormData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        groupId: values.groupId,
      }
      if (values.password && values.password.trim()) payload.password = values.password
      await onUpdate(admin.id, payload)
    } else {
      const payload: CreateAdminFormData = {
        username: (values.username ?? '').trim(),
        password: values.password ?? '',
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        groupId: values.groupId,
      }
      await onCreate(payload)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-xl p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
        </DialogHeader>

        <Form<AdminFormValues>
          key={admin?.id ?? 'new'}
          schema={schema}
          defaultValues={defaultValues}
          formId="admin-form"
          hideSubmit
          className="gap-0"
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
                  'Crear usuario'
                )}
              </Button>
            </DialogFooter>
          )}
        >
          {(form: UseFormReturn<AdminFormValues>) => (
            <div className="px-6 py-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  fieldConfig={{
                    name: 'username',
                    type: 'text',
                    label: 'Usuario',
                    placeholder: 'jperez',
                    disabled: isEdit,
                  }}
                  schema={schema.shape.username}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  errors={form.formState.errors}
                />
                <FormField
                  fieldConfig={{
                    name: 'password',
                    type: 'text',
                    inputType: 'password',
                    label: isEdit ? (
                      <>
                        Contraseña{' '}
                        <span className="text-muted-foreground">
                          (dejar en blanco para no cambiar)
                        </span>
                      </>
                    ) : (
                      'Contraseña'
                    ),
                    placeholder: isEdit ? '••••••••' : 'Mínimo 8 caracteres',
                  }}
                  schema={schema.shape.password}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  errors={form.formState.errors}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  fieldConfig={{
                    name: 'firstName',
                    type: 'text',
                    label: 'Nombres',
                    placeholder: 'Juan',
                  }}
                  schema={schema.shape.firstName}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  errors={form.formState.errors}
                />
                <FormField
                  fieldConfig={{
                    name: 'lastName',
                    type: 'text',
                    label: 'Apellidos',
                    placeholder: 'Pérez',
                  }}
                  schema={schema.shape.lastName}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  errors={form.formState.errors}
                />
              </div>

              <FormField
                fieldConfig={{
                  name: 'email',
                  type: 'text',
                  inputType: 'email',
                  label: 'Correo',
                  placeholder: 'jperez@correo.com',
                }}
                schema={schema.shape.email}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={form.control as any}
                errors={form.formState.errors}
              />

              <FormField
                fieldConfig={{
                  name: 'groupId',
                  type: 'select',
                  label: 'Grupo',
                  placeholder: 'Selecciona un grupo',
                  options: groupOptions,
                }}
                schema={schema.shape.groupId}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={form.control as any}
                errors={form.formState.errors}
              />
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
