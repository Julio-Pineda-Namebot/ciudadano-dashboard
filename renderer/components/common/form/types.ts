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
  // Muestra el botón "X" para limpiar la selección. Por defecto no se muestra
  // (en filtros con opción "Todas"/vacía, la X es redundante).
  clearable?: boolean
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: 'switch'
}

export interface DateRangePickerFieldConfig extends BaseFieldConfig {
  type: 'date-range-picker'
  numberOfMonths?: number
  align?: 'start' | 'center' | 'end'
}

export interface DatePickerFieldConfig extends BaseFieldConfig {
  type: 'date-picker'
  align?: 'start' | 'center' | 'end'
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select'
  options: ComboboxOption[]
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text'
  inputType?: 'text' | 'email' | 'url' | 'tel' | 'number' | 'password'
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea'
  rows?: number
  maxLength?: number
  maxHeight?: string
}

export interface ImageUploadFieldConfig extends BaseFieldConfig {
  type: 'image-upload'
  maxSize?: number
  accept?: Record<string, string[]>
  previewUrl?: string
  textoArrastrar?: string
  textoSubtexto?: string
}

export type FieldMetadata =
  | ComboboxFieldConfig
  | SwitchFieldConfig
  | DateRangePickerFieldConfig
  | DatePickerFieldConfig
  | SelectFieldConfig
  | TextFieldConfig
  | TextareaFieldConfig
  | ImageUploadFieldConfig

export type FieldConfig = FieldMetadata | string | ReactElement
