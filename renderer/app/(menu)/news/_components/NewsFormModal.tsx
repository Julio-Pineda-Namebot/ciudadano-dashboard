'use client'

import * as React from 'react'
import type { UseFormReturn, FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useModuleTheme, MODULE_BUTTON_CLASS } from '@/components/common/module-theme'
import { Form } from '@/components/common/form/Form'
import FormField from '@/components/common/form/FormField'
import { cn } from '@/lib/utils'
import {
  EMPTY_NEWS_FORM,
  newsCreateSchema,
  newsUpdateSchema,
} from '@/app/(menu)/news/_types/types'
import type {
  NewsFormData,
  NewsFormModalProps,
  NewsFormValues,
} from '@/app/(menu)/news/_types/types'

const TABS: { value: string; label: string; fields: (keyof NewsFormValues)[] }[] = [
  { value: 'info', label: 'Información', fields: ['title', 'date', 'tag'] },
  { value: 'content', label: 'Contenido', fields: ['summary', 'content'] },
  { value: 'image', label: 'Imagen', fields: ['image'] },
]

function parseDateOnly(value: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function formatDateOnly(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function tabHasErrors(
  fields: (keyof NewsFormValues)[],
  errors: FieldErrors<NewsFormValues>
): boolean {
  return fields.some((f) => errors[f] !== undefined)
}

export function NewsFormModal({ open, news, onClose, onSubmit }: NewsFormModalProps) {
  const theme = useModuleTheme()
  const btnClass = theme?.color ? MODULE_BUTTON_CLASS[theme.color] : ''
  const isEdit = news !== null

  const defaultValues: NewsFormValues = isEdit
    ? {
        title: news.title,
        summary: news.summary,
        content: news.content,
        image: undefined,
        date: parseDateOnly(news.date),
        tag: news.tag,
      }
    : EMPTY_NEWS_FORM

  const handleSubmit = async (values: NewsFormValues) => {
    if (!values.date) return
    const payload: NewsFormData = {
      title: values.title,
      summary: values.summary,
      content: values.content,
      date: formatDateOnly(values.date),
      tag: values.tag,
      image: values.image,
    }
    await onSubmit(payload)
  }

  const schema = isEdit ? newsUpdateSchema : newsCreateSchema

  const fieldConfigs: Record<keyof NewsFormValues, React.ComponentProps<typeof FormField>['fieldConfig']> = {
    title: { name: 'title', type: 'text', label: 'Título', placeholder: 'Título de la noticia' },
    date: { name: 'date', type: 'date-picker', label: 'Fecha', placeholder: 'Selecciona una fecha' },
    tag: { name: 'tag', type: 'text', label: 'Etiqueta', placeholder: 'ej. seguridad, clima' },
    summary: {
      name: 'summary',
      type: 'textarea',
      label: 'Resumen',
      placeholder: 'Breve resumen visible en la lista...',
      rows: 2,
      maxLength: 250,
      maxHeight: 'max-h-32',
    },
    content: {
      name: 'content',
      type: 'textarea',
      label: 'Contenido completo',
      placeholder: 'Texto completo de la noticia...',
      rows: 6,
      maxLength: 5000,
      maxHeight: 'max-h-64',
    },
    image: {
      name: 'image',
      type: 'image-upload',
      label: 'Imagen',
      previewUrl: isEdit ? news.image : undefined,
      textoSubtexto: 'PNG, JPG o WebP · Máx. 5 MB',
    },
  }

  const [tab, setTab] = React.useState(TABS[0].value)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-lg p-0"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{isEdit ? 'Editar noticia' : 'Nueva noticia'}</DialogTitle>
        </DialogHeader>

        <Form<NewsFormValues>
          key={news?.id ?? 'new'}
          schema={schema}
          defaultValues={defaultValues}
          formId="news-form"
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
                  'Crear noticia'
                )}
              </Button>
            </DialogFooter>
          )}
        >
          {(form: UseFormReturn<NewsFormValues>) => (
            <NewsFormTabs
              form={form}
              schema={schema}
              fieldConfigs={fieldConfigs}
              tab={tab}
              onTabChange={setTab}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface NewsFormTabsProps {
  form: UseFormReturn<NewsFormValues>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
  fieldConfigs: Record<
    keyof NewsFormValues,
    React.ComponentProps<typeof FormField>['fieldConfig']
  >
  tab: string
  onTabChange: (value: string) => void
}

function NewsFormTabs({
  form,
  schema,
  fieldConfigs,
  tab,
  onTabChange,
}: NewsFormTabsProps) {
  const errors = form.formState.errors
  const { submitCount } = form.formState

  React.useEffect(() => {
    if (submitCount === 0) return
    const firstWithErrors = TABS.find((t) => tabHasErrors(t.fields, errors))
    if (firstWithErrors && firstWithErrors.value !== tab) {
      onTabChange(firstWithErrors.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  return (
    <Tabs value={tab} onValueChange={onTabChange} className="px-6 py-2">
      <TabsList className="w-full">
        {TABS.map((t) => {
          const hasErr = tabHasErrors(t.fields, errors)
          return (
            <TabsTrigger key={t.value} value={t.value}>
              <span className="flex items-center gap-1.5">
                {t.label}
                {hasErr && (
                  <span className="size-1.5 rounded-full bg-destructive" />
                )}
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {TABS.map((t) => (
        <TabsContent key={t.value} value={t.value} className="mt-2 flex flex-col gap-4">
          {t.fields.map((name) => (
            <FormField
              key={name}
              fieldConfig={fieldConfigs[name]}
              schema={schema.shape?.[name]}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              errors={errors}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
