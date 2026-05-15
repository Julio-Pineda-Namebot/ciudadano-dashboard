import type { ReactElement, ReactNode } from 'react'

export interface ComboboxOption {
  value: string | number
  label: ReactNode
}

interface BaseFieldConfig {
  name?: string
  label?: ReactNode
  description?: ReactNode
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  options?: ComboboxOption[]
}

export interface ComboboxFieldConfig extends BaseFieldConfig {
  type: 'combobox'
  options: ComboboxOption[]
  emptyText?: ReactNode
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: 'switch'
}

export interface DateRangePickerFieldConfig extends BaseFieldConfig {
  type: 'date-range-picker'
  numberOfMonths?: number
  align?: 'start' | 'center' | 'end'
}

export type FieldMetadata =
  | ComboboxFieldConfig
  | SwitchFieldConfig
  | DateRangePickerFieldConfig

export type FieldConfig = FieldMetadata | string | ReactElement
