'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [buttonsOpacity, setButtonsOpacity] = useState(0);
  
  // Animazione lenta e progressiva
  useEffect(() => {
    // Funzione per incrementare gradualmente l'opacità
    const animateElement = (
      setOpacity: React.Dispatch<React.SetStateAction<number>>,
      startDelay: number,
      duration: number
    ) => {
      let startTime: number | null = null;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Calcola il tempo trascorso dall'inizio dell'animazione dopo il ritardo
        const timeAfterDelay = elapsed - startDelay;
        
        if (timeAfterDelay <= 0) {
          // Non ancora iniziata l'animazione, continua a richiedere fotogrammi
          animationFrame = requestAnimationFrame(animate);
          return;
        }
        
        // Calcola l'opacità basata sul tempo trascorso
        const progress = Math.min(timeAfterDelay / duration, 1);
        
        // Funzione di easing per un'animazione più naturale (easeOutQuart)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        setOpacity(easedProgress);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationFrame);
    };

    // Avvia le animazioni con ritardi differenti e durate più lunghe
    const titleAnimation = animateElement(setTitleOpacity, 1000, 2000); // 1s ritardo, 2s durata
    const subtitleAnimation = animateElement(setSubtitleOpacity, 2500, 2000); // 2.5s ritardo, 2s durata
    const buttonsAnimation = animateElement(setButtonsOpacity, 4000, 2500); // 4s ritardo, 2.5s durata

    return () => {
      // Pulizia delle animazioni
      titleAnimation();
      subtitleAnimation();
      buttonsAnimation();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-between py-16 overflow-hidden">
      {/* Logo sfumato con effetto dissolvenza sui bordi */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[700px] h-[700px]">
          <div className="absolute inset-0 bg-radial-fade"></div>
          <Image
            src="/IMG_4969.png"
            alt="Stormbringer Logo"
            fill
            sizes="(max-width: 768px) 80vw, 700px"
            className="object-contain opacity-60"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }}
          />
        </div>
      </div>
      
      {/* Spazio vuoto in alto per spostare il contenuto in basso */}
      <div className="flex-grow"></div>
      
      {/* Titolo con animazione graduale */}
      <div className="z-10 text-center px-4 mb-8">
        <h1 
          className="text-6xl md:text-8xl font-bold text-yellow-500 mb-4 transform-gpu will-change-transform"
          style={{ 
            fontFamily: "var(--font-medievalsharp)",
            textShadow: "0 0 5px rgba(255, 215, 0, 0.4)",
            letterSpacing: "4px",
            opacity: titleOpacity,
            transform: `scale(${0.9 + (titleOpacity * 0.1)})`,
            transition: 'transform 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        >
          Stormbringer
        </h1>
        <p 
          className="text-gray-400 italic mt-2 transform-gpu will-change-transform"
          style={{ 
            fontFamily: "var(--font-medievalsharp)",
            opacity: subtitleOpacity,
            transform: `translateY(${(1 - subtitleOpacity) * 20}px)`,
            transition: 'transform 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        >
          Dalla Grande Saga di Michael Moorcock
        </p>
      </div>
      
      {/* Pulsanti con animazione graduale */}
      <div 
        className="z-10 mt-4 space-y-4 transform-gpu will-change-transform"
        style={{
          opacity: buttonsOpacity,
          transform: `translateY(${(1 - buttonsOpacity) * 30}px)`,
          transition: 'transform 3s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/login"
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors text-center font-medievalsharp"
          >
            Accedi
          </Link>
          <Link
            href="/register"
            className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-medievalsharp"
          >
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
}
