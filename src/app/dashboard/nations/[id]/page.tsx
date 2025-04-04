import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Nation = {
  id: number
  name: string
  short_description: string
  full_description: string
}

export default function NationDetailPage() {
  const params = useParams()
  const [nation, setNation] = useState<Nation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchNation()
    }
  }, [params.id])

  const fetchNation = async () => {
    try {
      const { data, error } = await supabase
        .from('nations')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setNation(data)
    } catch (error) {
      console.error('Error fetching nation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {loading ? (
            <div>Caricamento...</div>
          ) : nation ? (
            <div className="rounded-lg bg-white p-6 shadow">
              <h1 className="text-2xl font-semibold text-gray-900">
                {nation.name}
              </h1>
              <p className="mt-4 text-gray-600">{nation.full_description}</p>
            </div>
          ) : (
            <div>Nazione non trovata</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 