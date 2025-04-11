import React, { useState } from 'react';

interface Region {
  id: string;
  name: string;
  shape: 'poly' | 'circle';
  coords: number[];
  alt: string;
  href: string;
}

interface InteractiveMapProps {
  regions: Region[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regions }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const handleRegionClick = (href: string) => {
    window.location.href = href;
  };

  const isPointInPolygon = (point: [number, number], polygon: number[]) => {
    const x = point[0];
    const y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 2; i < polygon.length; j = i, i += 2) {
      const xi = polygon[i];
      const yi = polygon[i + 1];
      const xj = polygon[j];
      const yj = polygon[j + 1];
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    for (const region of regions) {
      if (region.shape === 'poly' && isPointInPolygon([x, y], region.coords)) {
        handleRegionClick(region.href);
        return;
      }
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let foundRegion = null;
    for (const region of regions) {
      if (region.shape === 'poly' && isPointInPolygon([x, y], region.coords)) {
        foundRegion = region.id;
        break;
      }
    }
    setHoveredRegion(foundRegion);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative w-full aspect-[4/3]">
        <img
          src="/images/map/world-map.png"
          alt="Mappa del Mondo Conosciuto"
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleImageClick}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={() => setHoveredRegion(null)}
        />
        {hoveredRegion && (
          <div className="absolute bg-black bg-opacity-75 text-white p-2 rounded pointer-events-none">
            {regions.find(r => r.id === hoveredRegion)?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap; 