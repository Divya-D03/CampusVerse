'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const CONFETTI_COLORS = ['#8b5cf6', '#00f5ff', '#ec4899', '#3b82f6', '#f59e0b'];

const ConfettiPiece = ({ id, style }: { id: number; style: React.CSSProperties }) => (
  <div
    key={id}
    className={cn('confetti', `bg-primary`)}
    style={style}
  />
);

const Confetti = () => {
  const [pieces, setPieces] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }).map((_, index) => {
      const style = {
        left: `${Math.random() * 100}vw`,
        backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        animationDelay: `${Math.random() * 3}s`,
        width: `${Math.random() * 0.5 + 0.25}rem`,
        height: `${Math.random() * 0.5 + 0.25}rem`,
        transform: `rotate(${Math.random() * 360}deg)`,
      };
      return <ConfettiPiece key={index} id={index} style={style} />;
    });
    setPieces(newPieces);
  }, []);

  return <div className="fixed inset-0 w-full h-full pointer-events-none z-[200]">{pieces}</div>;
};

export default Confetti;
