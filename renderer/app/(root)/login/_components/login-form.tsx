'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { login } from '@/app/auth'
import type { LoginState } from '@/app/auth-types'
import { cn } from "@/lib/utils"
import { FieldGroup } from "@/components/ui/field"
import { LoginFormHeader } from "./login-form-header"
import { LoginFormFields } from "./login-form-fields"
import { SessionActiveDialog } from "./session-active-dialog"

interface LoginFormProps extends React.ComponentProps<"div"> {
  sessionRevokedMessage?: string
}

export function LoginForm({ className, sessionRevokedMessage, ...props }: LoginFormProps) {
  const lastFormDataRef = useRef<FormData | null>(null)
  const wrappedLogin = async (prev: LoginState, formData: FormData): Promise<LoginState> => {
    lastFormDataRef.current = formData
    return login(prev, formData)
  }
  const [state, action, pending] = useActionState<LoginState, FormData>(wrappedLogin, null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prevState, setPrevState] = useState(state)
  const [deviceName, setDeviceName] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const name = typeof window !== 'undefined' && window.electron?.getDeviceName
      ? window.electron.getDeviceName()
      : (typeof navigator !== 'undefined' ? `Web (${navigator.userAgent.slice(0, 60)})` : 'Unknown')
    setDeviceName(name)
  }, [])

  if (state !== prevState) {
    setPrevState(state)
    if (state && 'sessionActive' in state) {
      setDialogOpen(true)
    }
  }

  const handleForceLogin = () => {
    const previous = lastFormDataRef.current
    if (!previous) return
    const formData = new FormData()
    for (const [key, value] of previous.entries()) {
      formData.append(key, value)
    }
    formData.set('forceLogin', 'true')
    startTransition(() => {
      action(formData)
    })
  }

  const activeSession = state && 'sessionActive' in state ? state.activeSession : undefined

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {sessionRevokedMessage && (
        <p className="text-sm text-destructive text-center rounded-md bg-destructive/10 p-3">
          {sessionRevokedMessage}
        </p>
      )}

      <form ref={formRef} action={action}>
        <input type="hidden" name="deviceName" value={deviceName} />
        <FieldGroup>
          <LoginFormHeader />

          {state && 'error' in state && (
            <p className="text-sm text-destructive text-center">{state.error}</p>
          )}

          <LoginFormFields pending={pending} />
        </FieldGroup>
      </form>

      <SessionActiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleForceLogin}
        activeSession={activeSession}
      />
    </div>
  )
}
