"use client"

import dynamic from "next/dynamic"

export const TitleBarWrapper = dynamic(
  () => import("@/app/_components/TitleBar").then((m) => m.TitleBar),
  { ssr: false }
)
