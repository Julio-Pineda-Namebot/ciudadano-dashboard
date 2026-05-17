export {}

declare global {
  interface Window {
    electron?: {
      getDeviceName: () => string
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}
