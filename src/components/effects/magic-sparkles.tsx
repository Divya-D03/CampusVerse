'use client';

import { useState, useEffect } from 'react';

type Sparkle = {
  id: string;
  x: number;
  y: number;
  size: number;
  style: React.CSSProperties;
};

const createSparkle = (x: number, y: number): Sparkle => {
  const size = Math.random() * 4 + 2;
  return {
    id: `sparkle-${Date.now()}-${Math.random()}`,
    x,
    y,
    size,
    style: {
      top: `${y - size / 2}px`,
      left: `${x - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'hsl(var(--accent))',
      boxShadow: '0 0 8px hsl(var(--accent))',
    },
  };
};

export function MagicSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Add haptic feedback for touch-like feel, use sparingly
      if (navigator.vibrate) {
        // A very short vibration
        // navigator.vibrate(5);
      }
      const newSparkle = createSparkle(e.clientX, e.clientY);
      setSparkles((prev) => [...prev, newSparkle]);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const newSparkle = createSparkle(touch.clientX, touch.clientY);
        setSparkles((prev) => [...prev, newSparkle]);
      }
    };
    
    const sparkleInterval = setInterval(() => {
        setSparkles(prev => prev.slice(1));
    }, 50)


    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearInterval(sparkleInterval);
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[100]">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle absolute rounded-full"
          style={sparkle.style}
        />
      ))}
    </div>
  );
}
