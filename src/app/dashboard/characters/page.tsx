import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Character = {
  id: number
  name: string
  race: string
  class: string
  level: number
  stats: {
    strength: number
    constitution: number
    size: number
    dexterity: number
    intelligence: number
    power: number
    charisma: number
  }
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')

      if (error) throw error
      setCharacters(data || [])
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Personaggi</h1>
            <Link
              href="/dashboard/characters/new"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Nuovo Personaggio
            </Link>
          </div>

          {/* Lista Personaggi */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Caricamento...</div>
            ) : (
              characters.map((character) => (
                <Link
                  key={character.id}
                  href={`/dashboard/characters/${character.id}`}
                  className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {character.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {character.race} - {character.class} (Livello {character.level})
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Forza:</span>{' '}
                      {character.stats.strength}
                    </div>
                    <div>
                      <span className="text-gray-500">Costituzione:</span>{' '}
                      {character.stats.constitution}
                    </div>
                    <div>
                      <span className="text-gray-500">Taglia:</span>{' '}
                      {character.stats.size}
                    </div>
                    <div>
                      <span className="text-gray-500">Destrezza:</span>{' '}
                      {character.stats.dexterity}
                    </div>
                    <div>
                      <span className="text-gray-500">Intelligenza:</span>{' '}
                      {character.stats.intelligence}
                    </div>
                    <div>
                      <span className="text-gray-500">Potere:</span>{' '}
                      {character.stats.power}
                    </div>
                    <div>
                      <span className="text-gray-500">Carisma:</span>{' '}
                      {character.stats.charisma}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 