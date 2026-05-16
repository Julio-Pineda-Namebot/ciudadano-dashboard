import { SimpleLenisProvider } from '@/components/common/simple-lenis-provider'

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return <SimpleLenisProvider>{children}</SimpleLenisProvider>
}
