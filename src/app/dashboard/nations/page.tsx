import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Nation = {
  id: number
  name: string
  short_description: string
  full_description: string
}

export default function NationsPage() {
  const [nations, setNations] = useState<Nation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNations()
  }, [])

  const fetchNations = async () => {
    try {
      const { data, error } = await supabase
        .from('nations')
        .select('id, name, short_description')

      if (error) throw error
      setNations(data || [])
    } catch (error) {
      console.error('Error fetching nations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Nazioni</h1>

          {/* Lista Nazioni */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Caricamento...</div>
            ) : (
              nations.map((nation) => (
                <Link
                  key={nation.id}
                  href={`/dashboard/nations/${nation.id}`}
                  className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {nation.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {nation.short_description}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 