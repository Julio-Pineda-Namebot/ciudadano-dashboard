'use client'

import * as React from 'react'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import FormField from '@/components/common/form/FormField'
import type { FieldMetadata } from '@/components/common/form/types'

export type FormBodyEntry = string | React.ReactElement

interface FormProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any>
  onSubmit: (data: T) => void | Promise<void>
  body: FormBodyEntry[]
  fields?: Record<string, FieldMetadata>
  defaultValues?: DefaultValues<T>
  submitLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onCancel?: () => void
  hideSubmit?: boolean
  className?: string
  layout?: 'stacked' | 'grid'
  formId?: string
  children?: (form: UseFormReturn<T>) => React.ReactNode
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  body,
  fields: fieldsMetadata = {},
  defaultValues,
  submitLabel = 'Guardar',
  cancelLabel,
  onCancel,
  hideSubmit = false,
  className,
  layout = 'stacked',
  formId,
  children,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as never),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const submit: SubmitHandler<T> = async (data) => {
    await onSubmit(data)
  }

  const renderedFields = body.map((entry, index) => {
    if (React.isValidElement(entry)) {
      return (
        <React.Fragment key={index}>
          {entry}
        </React.Fragment>
      )
    }

    const fieldName = entry
    const zodField = schema.shape?.[fieldName]
    const metadata = fieldsMetadata[fieldName]

    if (!metadata) {
      console.warn(`Form: field "${fieldName}" has no metadata`)
      return null
    }
    if (!zodField) {
      console.warn(`Form: field "${fieldName}" not found in schema`)
      return null
    }

    const fieldConfig: FieldMetadata & { name: string } = {
      ...metadata,
      name: fieldName,
    }

    return (
      <FormField
        key={fieldName}
        fieldConfig={fieldConfig}
        schema={zodField as z.ZodTypeAny}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={control as any}
        errors={errors}
      />
    )
  })

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(submit)}
      className={cn('flex flex-col gap-4', className)}
      noValidate
    >
      <div
        className={cn(
          layout === 'grid'
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
            : 'flex flex-col gap-4',
        )}
      >
        {renderedFields}
      </div>

      {children?.(form)}

      {!hideSubmit && (
        <div className="flex items-center justify-end gap-2 pt-2">
          {cancelLabel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Guardando...</span>
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      )}
    </form>
  )
}

export default Form
