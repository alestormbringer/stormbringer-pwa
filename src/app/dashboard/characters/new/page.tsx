'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCharacterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    stats: {
      strength: 0,
      constitution: 0,
      size: 0,
      dexterity: 0,
      intelligence: 0,
      power: 0,
      charisma: 0,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('characters').insert([formData])

      if (error) throw error
      router.push('/dashboard/characters')
    } catch (error) {
      console.error('Error creating character:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('stats.')) {
      const statName = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: parseInt(value) || 0,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Nuovo Personaggio
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="race"
                  className="block text-sm font-medium text-gray-700"
                >
                  Razza
                </label>
                <input
                  type="text"
                  name="race"
                  id="race"
                  required
                  value={formData.race}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-700"
                >
                  Classe
                </label>
                <input
                  type="text"
                  name="class"
                  id="class"
                  required
                  value={formData.class}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700"
                >
                  Livello
                </label>
                <input
                  type="number"
                  name="level"
                  id="level"
                  min="1"
                  required
                  value={formData.level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Statistiche</h2>
              <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(formData.stats).map(([stat, value]) => (
                  <div key={stat}>
                    <label
                      htmlFor={`stats.${stat}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </label>
                    <input
                      type="number"
                      name={`stats.${stat}`}
                      id={`stats.${stat}`}
                      min="0"
                      required
                      value={value}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {loading ? 'Salvataggio...' : 'Salva Personaggio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
} 