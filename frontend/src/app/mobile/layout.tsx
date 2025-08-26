import './mobile.css'

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mobile-layout min-h-screen bg-gray-50 max-w-full overflow-x-hidden">
      {children}
    </div>
  )
}

