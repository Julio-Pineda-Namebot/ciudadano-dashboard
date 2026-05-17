import * as React from 'react';
import type { FieldMetadata } from '@/components/common/form/types';

// ============================================
// HEADER
// ============================================

/**
 * Configuración del encabezado del componente Importador.
 * Similar al toolbar del Form: slots izquierda/derecha para acciones extra.
 */
export interface ImportadorHeaderConfig {
  /** Título principal del encabezado */
  titulo: string;
  /** Subtítulo o descripción opcional */
  subtitulo?: string;
  /** Ícono a mostrar junto al título */
  icono?: React.ReactNode;
  /** Elementos extra alineados a la izquierda */
  izquierda?: React.ReactNode[];
  /** Elementos extra alineados a la derecha */
  derecha?: React.ReactNode[];
}

// ============================================
// CAMPOS DINÁMICOS
// ============================================

/**
 * Configuración de un campo opcional del Importador.
 * Compatible con todos los tipos soportados por FormField (text, email, number,
 * textarea, select, multiselect, checkbox, switch, date, radio, time, datetime,
 * daterange, combobox, async-select).
 */
export type ImportadorCampoConfig = FieldMetadata & { name: string };

// ============================================
// DROP ZONE
// ============================================

/**
 * Configuración del área de carga drag & drop.
 */
export interface ImportadorDropZoneConfig {
  /**
   * Tipos MIME aceptados con sus extensiones.
   * @example { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }
   */
  accept: Record<string, string[]>;
  /** Tamaño máximo en bytes (default: 10MB) */
  maxSize?: number;
  /** Permite múltiples archivos (default: false) */
  multiple?: boolean;
  /** Texto principal del área de arrastre */
  textoArrastrar?: string;
  /** Subtexto con restricciones (tipos, tamaño) */
  textoSubtexto?: string;
}

// ============================================
// BOTÓN PLANILLA
// ============================================

/** Planilla descargable: botón simple */
export type PlanillaConfigSimple = {
  tipo: 'simple';
  label?: string;
  labelMobile?: string;
  icono?: React.ReactNode;
  disabled?: boolean;
  onDescargar: () => Promise<void> | void;
};

/** Planilla descargable: split button con múltiples opciones */
export type PlanillaConfigDropdown = {
  tipo: 'dropdown';
  label?: string;
  labelMobile?: string;
  icono?: React.ReactNode;
  disabled?: boolean;
  opciones: { label: string; onClick: () => void }[];
};

export type PlanillaConfig = PlanillaConfigSimple | PlanillaConfigDropdown;

// ============================================
// PAYLOAD
// ============================================

/**
 * Datos enviados al callback `onProcesar`.
 */
export interface ImportadorPayload {
  /** Archivos validados listos para enviar */
  archivos: File[];
  /** Valores de los campos opcionales (incluye cualquier tipo soportado por FormField) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  campos: Record<string, any>;
}

// ============================================
// PROPS PRINCIPAL
// ============================================

/**
 * Props del componente Importador.
 *
 * @example
 * <Importador
 *   header={{ titulo: "Importar Empleados", icono: <Users /> }}
 *   campos={[{ name: "tipo", label: "Tipo", type: "combobox", items: tipos }]}
 *   dropZone={{ accept: { "application/vnd.ms-excel": [".xlsx"] }, maxSize: 5_000_000 }}
 *   planilla={{ tipo: "simple", label: "Descargar Plantilla", onDescargar: () => {} }}
 *   mostrarCancelar
 *   onCancelar={() => router.back()}
 *   onProcesar={async ({ archivos, campos }) => { await importar(archivos[0], campos); }}
 * />
 */
export interface ImportadorProps {
  /** Configuración del encabezado */
  header: ImportadorHeaderConfig;
  /** Campos opcionales de configuración (todos los tipos soportados por FormField) */
  campos?: ImportadorCampoConfig[];
  /** Valores iniciales para los campos */
  defaultValues?: Record<string, unknown>;
  /** Mostrar botón CANCELAR (izquierda de la barra) */
  mostrarCancelar?: boolean;
  /** Texto del botón cancelar */
  labelCancelar?: string;
  /** Callback al cancelar */
  onCancelar?: () => void;
  /** Configuración del botón PLANILLA (centro de la barra) */
  planilla?: PlanillaConfig;
  /** Texto del botón PROCESAR */
  labelProcesar?: string;
  /**
   * Callback al procesar.
   * Se llama solo cuando hay archivos válidos seleccionados.
   */
  onProcesar: (payload: ImportadorPayload) => Promise<void> | void;
  /** Configuración del área drag & drop */
  dropZone: ImportadorDropZoneConfig;
  /** Estado de loading externo (muestra overlay) */
  isLoading?: boolean;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

// ============================================
// TIPOS INTERNOS (sub-componentes)
// ============================================

/**
 * Archivo en la lista de seleccionados con estado de validación.
 */
export interface ArchivoSeleccionado {
  file: File;
  /** ID único para la lista React */
  id: string;
  /** Mensaje de error si la validación falló */
  error?: string;
}

/** Props del sub-componente ImportadorDropZone */
export interface ImportadorDropZoneProps {
  config: ImportadorDropZoneConfig;
  archivos: ArchivoSeleccionado[];
  onArchivosChange: (archivos: ArchivoSeleccionado[]) => void;
  disabled?: boolean;
}
