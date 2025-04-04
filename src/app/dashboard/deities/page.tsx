import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

type Deity = {
  id: number
  name: string
  description: string
  category: 'caos' | 'legge' | 'elementali' | 'signori_delle_bestie'
}

export default function DeitiesPage() {
  const [deities, setDeities] = useState<Deity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('caos')

  useEffect(() => {
    fetchDeities()
  }, [selectedCategory])

  const fetchDeities = async () => {
    try {
      const { data, error } = await supabase
        .from('deities')
        .select('*')
        .eq('category', selectedCategory)

      if (error) throw error
      setDeities(data || [])
    } catch (error) {
      console.error('Error fetching deities:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'caos', name: 'Caos' },
    { id: 'legge', name: 'Legge' },
    { id: 'elementali', name: 'Elementali' },
    { id: 'signori_delle_bestie', name: 'Signori delle Bestie' },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Divinità</h1>
          
          {/* Categorie */}
          <div className="mt-4 flex space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Lista Divinità */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Caricamento...</div>
            ) : (
              deities.map((deity) => (
                <div
                  key={deity.id}
                  className="rounded-lg bg-white p-6 shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {deity.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {deity.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 