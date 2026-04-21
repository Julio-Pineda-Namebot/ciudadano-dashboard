export {}

declare global {
  interface Window {
    electron?: {
      getDeviceName: () => string
    }
  }
}
