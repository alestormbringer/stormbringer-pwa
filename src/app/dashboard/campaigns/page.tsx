import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Campaign = {
  id: number
  name: string
  description: string
  master_id: string
  created_at: string
  invite_link: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .or(`master_id.eq.${user.id},players.cs.{${user.id}}`)

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            name: 'Nuova Campagna',
            description: 'Descrizione della campagna',
            master_id: user.id,
            invite_link: Math.random().toString(36).substring(7),
          },
        ])
        .select()
        .single()

      if (error) throw error
      setCampaigns((prev) => [...prev, data])
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Campagne</h1>
            <button
              onClick={createCampaign}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Nuova Campagna
            </button>
          </div>

          {/* Lista Campagne */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Caricamento...</div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-lg bg-white p-6 shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {campaign.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {campaign.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Link invito: {campaign.invite_link}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Apri Campagna
                    </Link>
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}/chat`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 