export default function DatabasePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Database di Gioco</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Nazionalità</h2>
            <p className="mb-4">Esplora le diverse nazionalità disponibili nel gioco</p>
            <button className="btn-primary">Vedi Nazionalità</button>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Divinità</h2>
            <p className="mb-4">Scopri il pantheon delle divinità</p>
            <button className="btn-primary">Vedi Divinità</button>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Classi</h2>
            <p className="mb-4">Esplora le classi disponibili</p>
            <button className="btn-primary">Vedi Classi</button>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Armi</h2>
            <p className="mb-4">Catalogo completo delle armi</p>
            <button className="btn-primary">Vedi Armi</button>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Equipaggiamenti</h2>
            <p className="mb-4">Tutti gli equipaggiamenti disponibili</p>
            <button className="btn-primary">Vedi Equipaggiamenti</button>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Accessori</h2>
            <p className="mb-4">Catalogo degli accessori</p>
            <button className="btn-primary">Vedi Accessori</button>
          </div>
        </div>
      </div>
    </main>
  );
} 