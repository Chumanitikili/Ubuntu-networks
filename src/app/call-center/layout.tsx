import { ReactNode } from 'react'

export default function CallCenterLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 