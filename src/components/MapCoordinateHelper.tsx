'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Point {
  x: number;
  y: number;
}

interface CoordinateHelperProps {
  imageUrl: string;
  width: number;
  height: number;
  onCoordinatesGenerated: (coords: number[]) => void;
  mode: 'circle' | 'poly';
}

export default function MapCoordinateHelper({
  imageUrl,
  width,
  height,
  onCoordinatesGenerated,
  mode = 'circle'
}: CoordinateHelperProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [radius, setRadius] = useState<number>(20);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    if (mode === 'circle') {
      // Per modalità cerchio, memorizza solo un punto
      setPoints([{ x, y }]);
    } else {
      // Per modalità poligono, aggiungi punti alla lista
      setPoints([...points, { x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    setCurrentPoint({ x, y });
  };

  const handleClear = () => {
    setPoints([]);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseInt(e.target.value, 10));
  };

  const generateCoordinates = () => {
    if (mode === 'circle' && points.length === 1) {
      // Formato per cerchio: [x, y, raggio]
      onCoordinatesGenerated([points[0].x, points[0].y, radius]);
    } else if (mode === 'poly' && points.length > 2) {
      // Formato per poligono: [x1, y1, x2, y2, ...]
      const coords = points.flatMap(point => [point.x, point.y]);
      onCoordinatesGenerated(coords);
    }
  };

  return (
    <div className="bg-green-900 rounded-lg">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center p-4">
        <div>
          <span className="text-green-100 mr-4 font-medievalsharp">Modalità: {mode === 'circle' ? 'Cerchio' : 'Poligono'}</span>
          {mode === 'circle' && (
            <div className="flex items-center mt-2">
              <label className="text-green-100 mr-2 font-medievalsharp">Raggio:</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={radius} 
                onChange={handleRadiusChange}
                className="mr-2" 
              />
              <span className="text-green-100 font-medievalsharp">{radius}px</span>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2 font-medievalsharp"
          >
            Cancella
          </button>
          <button 
            onClick={generateCoordinates}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-medievalsharp"
            disabled={(mode === 'circle' && points.length !== 1) || (mode === 'poly' && points.length < 3)}
          >
            Genera Coordinate
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative cursor-crosshair bg-gray-800" 
        style={{ width, height }}
        onClick={handleImageClick}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={imageUrl}
          alt="Mappa per configurazione coordinate"
          width={width}
          height={height}
          className="rounded-b-lg"
          unoptimized={true}
        />
        
        <svg 
          width={width} 
          height={height} 
          className="absolute top-0 left-0 pointer-events-none"
        >
          {/* Visualizza i punti già piazzati */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="red"
            />
          ))}
          
          {/* Visualizza linee tra i punti per il poligono */}
          {mode === 'poly' && points.length > 1 && (
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="red"
              strokeWidth="2"
            />
          )}
          
          {/* Chiudi il poligono */}
          {mode === 'poly' && points.length > 2 && (
            <line
              x1={points[points.length - 1].x}
              y1={points[points.length - 1].y}
              x2={points[0].x}
              y2={points[0].y}
              stroke="red"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Visualizza il cerchio */}
          {mode === 'circle' && points.length === 1 && (
            <circle
              cx={points[0].x}
              cy={points[0].y}
              r={radius}
              fill="none"
              stroke="red"
              strokeWidth="2"
            />
          )}
          
          {/* Mostra la posizione corrente del mouse */}
          {currentPoint && (
            <text
              x={currentPoint.x + 10}
              y={currentPoint.y - 10}
              fill="white"
              fontSize="12"
            >
              {currentPoint.x}, {currentPoint.y}
            </text>
          )}
        </svg>
      </div>

      <div className="mt-4 p-4 border-t border-green-800">
        <h3 className="text-yellow-500 font-medievalsharp mb-2">Coordinate generate:</h3>
        <div className="bg-green-800 p-2 rounded mb-2">
          {mode === 'circle' && points.length === 1 && (
            <code className="text-green-100 font-mono">[{points[0].x}, {points[0].y}, {radius}]</code>
          )}
          {mode === 'poly' && points.length > 0 && (
            <code className="text-green-100 font-mono">[{points.flatMap(p => [p.x, p.y]).join(', ')}]</code>
          )}
        </div>
        <p className="text-green-200 text-sm mt-1">
          <strong>Nota:</strong> La mappa qui è temporaneamente ridotta a 1000x750 per facilitare l'editing. 
          Le coordinate generate verranno adattate automaticamente alla mappa completa (1600x1200).
        </p>
        <div className="mt-3 bg-green-800 p-2 rounded text-sm">
          <h4 className="text-yellow-500 font-medievalsharp">Come usare lo strumento:</h4>
          <ul className="text-green-200 list-disc list-inside mt-1">
            <li>Per <strong>cerchi</strong>: clicca per posizionare il centro e regola il raggio con lo slider</li>
            <li>Per <strong>poligoni</strong>: clicca più volte per aggiungere punti al perimetro (minimo 3)</li>
            <li>Clicca "Genera Coordinate" e poi "Aggiungi Regione" nel pannello laterale</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 