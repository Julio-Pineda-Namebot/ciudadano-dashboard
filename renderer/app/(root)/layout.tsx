import { RootTitlebar } from '@/app/(root)/_components/RootTitlebar'

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RootTitlebar />
      {children}
    </>
  )
}
