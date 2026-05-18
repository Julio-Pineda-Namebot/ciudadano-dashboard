export {}

declare global {
  interface Window {
    electron?: {
      platform: NodeJS.Platform
      getDeviceName: () => string
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}
