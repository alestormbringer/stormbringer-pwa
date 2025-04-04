import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

type Equipment = {
  id: number
  name: string
  description: string
  category: 'armi' | 'armature' | 'accessori'
  stats: {
    damage?: string
    defense?: number
    weight?: number
    cost?: number
  }
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('armi')

  useEffect(() => {
    fetchEquipment()
  }, [selectedCategory])

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('category', selectedCategory)

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'armi', name: 'Armi' },
    { id: 'armature', name: 'Armature' },
    { id: 'accessori', name: 'Accessori' },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Equipaggiamento</h1>

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

          {/* Lista Equipaggiamento */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Caricamento...</div>
            ) : (
              equipment.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white p-6 shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    {item.stats.damage && (
                      <p className="text-sm text-gray-500">
                        Danno: {item.stats.damage}
                      </p>
                    )}
                    {item.stats.defense && (
                      <p className="text-sm text-gray-500">
                        Difesa: {item.stats.defense}
                      </p>
                    )}
                    {item.stats.weight && (
                      <p className="text-sm text-gray-500">
                        Peso: {item.stats.weight}
                      </p>
                    )}
                    {item.stats.cost && (
                      <p className="text-sm text-gray-500">
                        Costo: {item.stats.cost}
                      </p>
                    )}
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