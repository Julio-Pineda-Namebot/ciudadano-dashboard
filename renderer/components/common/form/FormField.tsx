'use client'

import * as React from 'react'
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form'
import type { z } from 'zod'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker, DateRangePicker } from '@/components/common/date-picker'
import ImportadorDropZone from '@/components/common/importador/ImportadorDropZone'
import type { ArchivoSeleccionado } from '@/components/common/importador/types'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  dateRangeToDateRangeValue,
  dateRangeValueToDateRange,
  EMPTY_DATE_RANGE,
} from '@/lib/date-range'

import type {
  ComboboxFieldConfig,
  ComboboxOption,
  DatePickerFieldConfig,
  DateRangePickerFieldConfig,
  FieldMetadata,
  ImageUploadFieldConfig,
  SelectFieldConfig,
  SwitchFieldConfig,
  TextFieldConfig,
  TextareaFieldConfig,
} from './types'

interface FormFieldProps {
  fieldConfig: FieldMetadata & { name: string }
  schema?: z.ZodTypeAny
  control: Control<FieldValues>
  errors: FieldErrors
}

export default function FormField({ fieldConfig, control, errors }: FormFieldProps) {
  const { name, label, description, className, width } = fieldConfig
  const fieldError = errors[name]
  const errorMessage =
    typeof fieldError?.message === 'string' ? fieldError.message : undefined

  return (
    <div
      className={cn('flex flex-col gap-1.5', width, className)}
      data-slot="form-field"
      data-invalid={!!fieldError || undefined}
    >
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FieldControl fieldConfig={fieldConfig} field={field} id={name} invalid={!!fieldError} />
        )}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  )
}

interface FieldControlProps {
  fieldConfig: FieldMetadata & { name: string }
  field: ControllerRenderProps<FieldValues, string>
  id: string
  invalid: boolean
}

function FieldControl({ fieldConfig, field, id, invalid }: FieldControlProps) {
  switch (fieldConfig.type) {
    case 'combobox':
      return <ComboboxControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'switch':
      return <SwitchControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'date-range-picker':
      return <DateRangeControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'date-picker':
      return <DatePickerControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'select':
      return <SelectControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'text':
      return <TextControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'textarea':
      return <TextareaControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
    case 'image-upload':
      return <ImageUploadControl fieldConfig={fieldConfig} field={field} id={id} invalid={invalid} />
  }
}

interface ControlProps<TConfig> {
  fieldConfig: TConfig & { name: string }
  field: ControllerRenderProps<FieldValues, string>
  id: string
  invalid: boolean
}

function ComboboxControl({
  fieldConfig,
  field,
  id,
  invalid,
}: ControlProps<ComboboxFieldConfig>) {
  const { options, placeholder, emptyText, disabled, clearable } = fieldConfig
  const selected =
    field.value != null
      ? options.find((opt) => opt.value === field.value) ?? null
      : null

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(item) => {
        const next = item as ComboboxOption | null
        field.onChange(next ? next.value : null)
      }}
      itemToStringLabel={(item) => String((item as ComboboxOption).label)}
      itemToStringValue={(item) => String((item as ComboboxOption).value)}
      isItemEqualToValue={(a, b) =>
        (a as ComboboxOption | null)?.value === (b as ComboboxOption | null)?.value
      }
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        showClear={clearable}
        onBlur={field.onBlur}
        disabled={disabled}
        className="h-10"
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText ?? 'Sin resultados'}</ComboboxEmpty>
        <ComboboxList>
          {options.map((opt) => (
            <ComboboxItem key={String(opt.value)} value={opt}>
              {opt.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function SwitchControl({
  fieldConfig,
  field,
  id,
  invalid,
}: ControlProps<SwitchFieldConfig>) {
  return (
    <Switch
      id={id}
      checked={!!field.value}
      onCheckedChange={field.onChange}
      onBlur={field.onBlur}
      disabled={fieldConfig.disabled}
      aria-invalid={invalid || undefined}
    />
  )
}

function DateRangeControl({
  fieldConfig,
  field,
}: ControlProps<DateRangePickerFieldConfig>) {
  const value = dateRangeValueToDateRange(field.value ?? EMPTY_DATE_RANGE)
  return (
    <DateRangePicker
      value={value}
      onChange={(range) => field.onChange(dateRangeToDateRangeValue(range))}
      numberOfMonths={fieldConfig.numberOfMonths}
      align={fieldConfig.align}
      disabled={fieldConfig.disabled}
      placeholder={fieldConfig.placeholder}
    />
  )
}

function DatePickerControl({
  fieldConfig,
  field,
}: ControlProps<DatePickerFieldConfig>) {
  const value = field.value instanceof Date ? field.value : undefined
  return (
    <DatePicker
      value={value}
      onChange={(date) => field.onChange(date)}
      align={fieldConfig.align}
      disabled={fieldConfig.disabled}
      placeholder={fieldConfig.placeholder}
      className="w-full"
    />
  )
}

function SelectControl({
  fieldConfig,
  field,
  id,
  invalid,
}: ControlProps<SelectFieldConfig>) {
  return (
    <Select
      value={field.value ?? ''}
      onValueChange={(v) => field.onChange(v)}
      disabled={fieldConfig.disabled}
    >
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid || undefined} onBlur={field.onBlur}>
        <SelectValue placeholder={fieldConfig.placeholder ?? 'Seleccionar...'} />
      </SelectTrigger>
      <SelectContent>
        {fieldConfig.options.map(({ value, label }) => (
          <SelectItem key={String(value)} value={String(value)}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function TextControl({
  fieldConfig,
  field,
  id,
  invalid,
}: ControlProps<TextFieldConfig>) {
  return (
    <Input
      id={id}
      type={fieldConfig.inputType ?? 'text'}
      value={field.value ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      placeholder={fieldConfig.placeholder}
      disabled={fieldConfig.disabled}
      aria-invalid={invalid || undefined}
    />
  )
}

function TextareaControl({
  fieldConfig,
  field,
  id,
  invalid,
}: ControlProps<TextareaFieldConfig>) {
  const value = (field.value ?? '') as string
  const { maxLength, maxHeight } = fieldConfig
  const atLimit = maxLength !== undefined && value.length >= maxLength

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        id={id}
        rows={fieldConfig.rows ?? 3}
        value={value}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        placeholder={fieldConfig.placeholder}
        disabled={fieldConfig.disabled}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        className={cn('overflow-auto', maxHeight)}
      />
      {maxLength !== undefined && (
        <p
          className={cn(
            'self-end text-xs tabular-nums',
            atLimit ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

const DEFAULT_IMAGE_ACCEPT: Record<string, string[]> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
}

function ImageUploadControl({
  fieldConfig,
  field,
}: ControlProps<ImageUploadFieldConfig>) {
  const value = field.value as File | undefined
  const [archivos, setArchivos] = React.useState<ArchivoSeleccionado[]>(() =>
    value
      ? [{ file: value, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }]
      : []
  )

  React.useEffect(() => {
    if (!value && archivos.length > 0) {
      setArchivos([])
    }
  }, [value, archivos.length])

  const handleChange = (next: ArchivoSeleccionado[]) => {
    setArchivos(next)
    const validFile = next.find((a) => !a.error)?.file
    field.onChange(validFile ?? undefined)
  }

  const accept = fieldConfig.accept ?? DEFAULT_IMAGE_ACCEPT
  const maxSize = fieldConfig.maxSize ?? 5 * 1024 * 1024

  return (
    <div className="flex flex-col gap-2">
      {fieldConfig.previewUrl && archivos.length === 0 && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fieldConfig.previewUrl}
            alt="Imagen actual"
            className="size-16 rounded object-cover"
          />
          <p className="text-xs text-muted-foreground">
            Imagen actual. Sube una nueva para reemplazarla.
          </p>
        </div>
      )}
      <ImportadorDropZone
        config={{
          accept,
          maxSize,
          multiple: false,
          textoArrastrar:
            fieldConfig.textoArrastrar ?? 'Arrastra una imagen aquí',
          textoSubtexto: fieldConfig.textoSubtexto,
        }}
        archivos={archivos}
        onArchivosChange={handleChange}
        disabled={fieldConfig.disabled}
      />
    </div>
  )
}
