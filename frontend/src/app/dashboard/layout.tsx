import ErrorBoundary from '@/components/ErrorBoundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  )
}