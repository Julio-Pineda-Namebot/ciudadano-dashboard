'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { ChevronDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import FormField from '@/components/common/form/FormField'
import type { FieldMetadata } from '@/components/common/form/types'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'

export type FilterBodyEntry = string | React.ReactElement

function cleanFormData<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== null),
  ) as Partial<T>
}

interface FilterConfig {
  fields?: Record<string, FieldMetadata>
  submitLabel?: React.ReactNode
  submitIcon?: React.ReactNode
  cleanUndefined?: boolean
  hideSubmit?: boolean
  buttonClassName?: string
}

interface FilterProps<T extends Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any>
  onSubmit: (data: T) => void | Promise<void>
  body: FilterBodyEntry[]
  defaultValues?: Record<string, unknown>
  defaultOpen?: boolean
  config?: FilterConfig
}

export function Filter<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  body,
  defaultValues,
  defaultOpen = true,
  config = {},
}: FilterProps<T>) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    fields: fieldsMetadata = {},
    submitLabel,
    submitIcon = <Search />,
    cleanUndefined = true,
    hideSubmit = false,
    buttonClassName,
  } = config

  const theme = useModuleTheme()
  const resolvedButtonClass = buttonClassName ?? (theme?.color ? MODULE_BUTTON_CLASS[theme.color] : undefined)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema as never),
    defaultValues,
  })

  async function handleFormSubmit(data: Record<string, unknown>) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const processed = cleanUndefined ? cleanFormData(data) : data
      await onSubmit(processed as T)
      if (isMobile) setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resolvedFields = body.map((entry, index) => {
    if (React.isValidElement(entry)) {
      return (
        <div key={index} className={cn(isMobile && 'col-span-12')}>
          {entry}
        </div>
      )
    }

    const fieldName = entry
    const zodField = schema.shape?.[fieldName]
    const metadata = fieldsMetadata[fieldName]

    if (!metadata) {
      console.warn(`Filter: field "${fieldName}" has no metadata`)
      return null
    }
    if (!zodField) {
      console.warn(`Filter: field "${fieldName}" not found in schema`)
      return null
    }

    const fieldConfig: FieldMetadata & { name: string } = {
      ...metadata,
      name: fieldName,
      className: isMobile
        ? cn('col-span-12', metadata.className)
        : metadata.className,
      width: isMobile ? 'w-full' : metadata.width,
    }

    return (
      <FormField
        key={fieldName}
        fieldConfig={fieldConfig}
        schema={zodField as z.ZodTypeAny}
        control={control}
        errors={errors}
      />
    )
  })

  const grid = (
    <div
      className={cn(
        isMobile
          ? 'grid grid-cols-12 items-end gap-x-4 gap-y-2'
          : 'flex w-full flex-wrap items-end justify-center gap-x-4 gap-y-2',
      )}
    >
      {resolvedFields}
      {!isMobile && !hideSubmit && (
        <div className="flex items-end gap-2 p-1">
          <Button
            type="submit"
            size={submitLabel ? 'default' : 'icon'}
            disabled={isSubmitting}
            className={cn(!submitLabel && 'h-10 w-10', resolvedButtonClass)}
          >
            {isSubmitting ? (
              <Spinner />
            ) : (
              <>
                {submitIcon}
                {submitLabel && <span className="ml-2">{submitLabel}</span>}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="relative">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-end">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-8 rounded-full shadow-md"
                aria-label="Toggle filters"
              >
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="mt-1 w-full rounded-lg border bg-background p-2 shadow-lg">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {grid}
                {!hideSubmit && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2.5 h-9"
                  >
                    {isSubmitting ? (
                      <Spinner />
                    ) : (
                      <>
                        {submitIcon}
                        <span className="ml-2">{submitLabel ?? 'Buscar'}</span>
                      </>
                    )}
                  </Button>
                )}
              </form>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="rounded-lg border bg-card p-2 shadow-sm">
        <form onSubmit={handleSubmit(handleFormSubmit)}>{grid}</form>
      </div>
    </div>
  )
}

export default Filter
