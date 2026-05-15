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
import { DateRangePicker } from '@/components/common/date-picker'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  dateRangeToDateRangeValue,
  dateRangeValueToDateRange,
  EMPTY_DATE_RANGE,
} from '@/lib/date-range'

import type {
  ComboboxFieldConfig,
  ComboboxOption,
  DateRangePickerFieldConfig,
  FieldMetadata,
  SwitchFieldConfig,
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
  const { options, placeholder, emptyText, disabled } = fieldConfig
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
        showClear
        onBlur={field.onBlur}
        disabled={disabled}
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
