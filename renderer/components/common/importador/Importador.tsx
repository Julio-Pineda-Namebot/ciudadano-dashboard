"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import FormField from "@/components/common/form/FormField";
import BackButton from "@/components/common/button/BackButton";
import ImportadorDropZone from "./ImportadorDropZone";
import type {
  ImportadorProps,
  ArchivoSeleccionado,
  PlanillaConfig,
} from "./types";

const TAG = "[Importador]";

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────
const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cn("animate-spin", className)} />
);

// ─────────────────────────────────────────────────────────────────────────────
// Botón Planilla (simple o dropdown)
// ─────────────────────────────────────────────────────────────────────────────
function BotónPlanilla({
  config,
  disabled,
}: {
  config: PlanillaConfig;
  disabled: boolean;
}) {
  const [isDescargando, setIsDescargando] = React.useState(false);
  const isMobile = useIsMobile();
  const label = isMobile ? (config.labelMobile ?? config.label ?? "Plantilla") : (config.label ?? "Plantilla");
  const icono = config.icono ?? <Download className="size-4" />;

  const handleClick = async () => {
    if (config.tipo !== "simple") return;
    setIsDescargando(true);
    try {
      await config.onDescargar();
    } finally {
      setIsDescargando(false);
    }
  };

  if (config.tipo === "simple") {
    return (
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={handleClick}
        disabled={disabled || isDescargando}
      >
        {isDescargando ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Descargando...
          </>
        ) : (
          <>
            {icono}
            {label}
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={disabled}
        >
          {icono}
          {label}
          <ChevronDown className="size-3.5 ml-1 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {config.opciones.map((opcion, idx) => (
          <DropdownMenuItem key={idx} onClick={opcion.onClick}>
            {opcion.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────────────────────────────────────
export default function Importador({
  header,
  campos = [],
  defaultValues = {},
  mostrarCancelar = false,
  labelCancelar = "Cancelar",
  onCancelar,
  planilla,
  labelProcesar = "Procesar",
  onProcesar,
  dropZone,
  isLoading = false,
  className,
}: ImportadorProps) {
  const [archivos, setArchivos] = React.useState<ArchivoSeleccionado[]>([]);
  const [isProcesando, setIsProcesando] = React.useState(false);

  const loading = isProcesando || isLoading;

  const archivosValidos = archivos.filter((a) => !a.error);
  const canProcesar = archivosValidos.length > 0 && !loading;

  const [camposSchema] = React.useState(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    campos.forEach((c) => {
      shape[c.name] = z.unknown().optional();
    });
    return z.object(shape);
  });

  const form = useForm({
    resolver: zodResolver(camposSchema),
    defaultValues,
  });

  const onSubmit = async (camposValores: Record<string, unknown>) => {
    if (!canProcesar) return;
    setIsProcesando(true);
    try {
      await onProcesar({
        archivos: archivosValidos.map((a) => a.file),
        campos: camposValores,
      });
    } catch (error) {
      logger.error(`${TAG} Error al procesar:`, error);
    } finally {
      setIsProcesando(false);
    }
  };

  return (
    <div className={cn("relative w-full h-full min-w-0", className)}>
      {/* ── Overlay de loading ─────────────────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-10 text-primary" />
            <p className="text-sm font-medium">
              Procesando, espere un momento…
            </p>
          </div>
        </div>
      )}

      {/* ── Tarjeta principal ──────────────────────────────────────────── */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="rounded-xl border shadow-sm bg-card overflow-hidden"
      >
        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-muted/30 border-b">
          {header.izquierda && header.izquierda.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {header.izquierda.map((el, i) => (
                <React.Fragment key={i}>{el}</React.Fragment>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {header.icono && (
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                {header.icono}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h2 className="text-base font-semibold text-foreground leading-tight truncate">
                {header.titulo}
              </h2>
              {header.subtitulo && (
                <p className="text-xs text-muted-foreground truncate">
                  {header.subtitulo}
                </p>
              )}
            </div>
          </div>

          {header.derecha && header.derecha.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {header.derecha.map((el, i) => (
                <React.Fragment key={i}>{el}</React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* ── CAMPOS ───────────────────────────────────────────────────── */}
        {campos.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-3 items-end px-4 py-3 bg-muted/20 border-b">
            {campos.map((campo) => (
              <FormField
                key={campo.name}
                fieldConfig={{ ...campo, disabled: campo.disabled || loading }}
                schema={camposSchema}
                control={form.control}
                errors={form.formState.errors}
              />
            ))}
          </div>
        )}

        {/* ── BARRA DE BOTONES ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-gray-50 border-b">
          <div className="flex-1 flex justify-start">
            {mostrarCancelar && onCancelar && (
              <BackButton
                onClick={onCancelar}
                label={labelCancelar}
                disabled={loading}
                withSidebarOffset={false}
              />
            )}
          </div>

          <div className="flex-1 flex justify-center">
            {planilla && <BotónPlanilla config={planilla} disabled={loading || (planilla.disabled ?? false)} />}
          </div>

          <div className="flex-1 flex justify-end">
            {/* type="submit" — dispara form.handleSubmit → onSubmit */}
            <Button
              type="submit"
              disabled={!canProcesar}
              className="gap-2 min-w-27.5"
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  Procesando…
                </>
              ) : (
                labelProcesar
              )}
            </Button>
          </div>
        </div>

        {/* ── DROP ZONE ────────────────────────────────────────────────── */}
        <div className="p-5">
          <ImportadorDropZone
            config={dropZone}
            archivos={archivos}
            onArchivosChange={setArchivos}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}

Importador.displayName = "Importador";
