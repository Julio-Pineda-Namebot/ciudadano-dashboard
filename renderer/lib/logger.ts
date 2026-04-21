const isDev = process.env.NODE_ENV !== 'production'

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (isDev) console.log(`[LOG] ${message}`, ...args)
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn(`[WARN] ${message}`, ...args)
  },
}
