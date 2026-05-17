"use client";

import * as React from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ImportadorDropZoneProps, ArchivoSeleccionado } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getErrorMessage(code: string, maxSize?: number): string {
  switch (code) {
    case "file-invalid-type":
      return "Tipo de archivo no permitido";
    case "file-too-large":
      return maxSize
        ? `El archivo supera el tamaño máximo permitido (${formatBytes(maxSize)})`
        : "El archivo supera el tamaño máximo permitido";
    case "too-many-files":
      return "Solo se permite un archivo a la vez";
    default:
      return "Archivo inválido";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ImportadorDropZone({
  config,
  archivos,
  onArchivosChange,
  disabled = false,
}: ImportadorDropZoneProps) {
  const {
    accept,
    maxSize = 10 * 1024 * 1024,
    multiple = false,
    textoArrastrar,
    textoSubtexto,
  } = config;

  // Extensiones legibles para mensajes de error y hint
  const extensiones = Object.values(accept).flat().join(", ");

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const nuevosArchivos: ArchivoSeleccionado[] = [];

      // Archivos aceptados
      const filesToAdd = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
      filesToAdd.forEach((file) => {
        nuevosArchivos.push({
          file,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        });
      });

      // Archivos rechazados — mostrar toast con mensaje claro
      const rechazadosToAdd = multiple
        ? rejectedFiles
        : rejectedFiles.slice(0, 1 - filesToAdd.length);
      rechazadosToAdd.forEach(({ file, errors }) => {
        const errorCode = (errors[0]?.code as string) ?? "";

        if (errorCode === "file-invalid-type") {
          toast.error("Tipo de archivo no permitido", {
            description: `"${file.name}" no es un formato aceptado. Formatos válidos: ${extensiones}`,
          });
        }

        nuevosArchivos.push({
          file,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          error: getErrorMessage(errorCode, maxSize),
        });
      });

      if (multiple) {
        onArchivosChange([...archivos, ...nuevosArchivos]);
      } else {
        onArchivosChange(nuevosArchivos.slice(0, 1));
      }
    },
    [archivos, multiple, maxSize, extensiones, onArchivosChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    multiple,
    disabled,
    onDrop,
  });

  const handleRemove = (id: string) => {
    onArchivosChange(archivos.filter((a) => a.id !== id));
  };

  const archivosValidos = archivos.filter((a) => !a.error);
  const archivosConError = archivos.filter((a) => a.error);

  return (
    <div className="flex flex-col gap-3">
      {/* Drop Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 min-h-50 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none p-6",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
          disabled && "pointer-events-none opacity-50",
          archivosValidos.length > 0 &&
            !isDragActive &&
            "border-primary/30 bg-primary/3",
        )}
      >
        <input {...getInputProps()} />

        {/* Ícono */}
        <div
          className={cn(
            "flex items-center justify-center size-16 rounded-2xl transition-all duration-200",
            isDragActive
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isDragActive ? (
            <CloudUpload className="size-8 animate-bounce" />
          ) : archivosValidos.length > 0 ? (
            <CheckCircle2 className="size-8 text-primary" />
          ) : (
            <Upload className="size-8" />
          )}
        </div>

        {/* Texto */}
        <div className="flex flex-col items-center gap-1 text-center">
          {isDragActive ? (
            <p className="text-sm font-semibold text-primary">
              Suelta el archivo aquí
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">
                {textoArrastrar ?? "Arrastra y suelta tu archivo aquí"}
              </p>
              <p className="text-xs text-muted-foreground">
                o{" "}
                <span className="text-primary font-medium underline underline-offset-2">
                  haz clic para seleccionar
                </span>
              </p>
            </>
          )}

          {/* Hint de restricciones */}
          {!isDragActive && (
            <p className="text-xs text-muted-foreground mt-1">
              {textoSubtexto ?? `${extensiones} · Máx. ${formatBytes(maxSize)}`}
            </p>
          )}
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {archivos.length > 0 && (
        <div className="flex flex-col gap-2">
          {archivos.map((archivo) => (
            <div
              key={archivo.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
                archivo.error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-primary/20 bg-primary/5",
              )}
            >
              {/* Ícono de estado */}
              {archivo.error ? (
                <AlertCircle className="size-5 text-destructive shrink-0" />
              ) : (
                <FileText className="size-5 text-primary shrink-0" />
              )}

              {/* Info del archivo */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-medium break-all text-foreground">
                  {archivo.file.name}
                </span>
                {archivo.error ? (
                  <span className="text-xs text-destructive">
                    {archivo.error}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(archivo.file.size)}
                  </span>
                )}
              </div>

              {/* Botón eliminar */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "size-7 shrink-0 rounded-full",
                  archivo.error
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(archivo.id);
                }}
                disabled={disabled}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}

          {/* Resumen de errores globales */}
          {archivosConError.length > 0 && archivosValidos.length === 0 && (
            <p className="text-xs text-destructive flex items-center gap-1.5 px-1">
              <AlertCircle className="size-3.5 shrink-0" />
              Ningún archivo pasó la validación. Selecciona un archivo válido
              para continuar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
