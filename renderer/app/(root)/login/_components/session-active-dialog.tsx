import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ActiveSessionInfo {
  ip?: string
  deviceName?: string
  userAgent?: string
  createdAt?: string
}

interface SessionActiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  activeSession?: ActiveSessionInfo
}

function formatDate(iso?: string) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function SessionActiveDialog({
  open,
  onOpenChange,
  onConfirm,
  activeSession,
}: SessionActiveDialogProps) {
  const createdAt = formatDate(activeSession?.createdAt)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>Sesión activa detectada</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Ya existe una sesión activa en tu cuenta. Si continúas, se cerrará en ese dispositivo.
              </p>
              {activeSession && (
                <ul className="text-xs text-muted-foreground space-y-1 rounded-md border p-2">
                  {activeSession.deviceName && (
                    <li><span className="font-medium">Dispositivo:</span> {activeSession.deviceName}</li>
                  )}
                  {activeSession.ip && (
                    <li><span className="font-medium">IP:</span> {activeSession.ip}</li>
                  )}
                  {createdAt && (
                    <li><span className="font-medium">Inicio:</span> {createdAt}</li>
                  )}
                </ul>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Cerrar esa sesión e ingresar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
