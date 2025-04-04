import DashboardLayout from '@/components/DashboardLayout'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Benvenuto in Stormbringer PWA
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Seleziona una sezione dal menu laterale per iniziare.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
} 