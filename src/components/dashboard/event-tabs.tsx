'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Code, Users } from 'lucide-react';
import type { EventCategory } from '@/lib/types';

interface EventTabsProps {
  activeCategory: EventCategory;
  onCategoryChange: (category: EventCategory) => void;
}

const categories: { name: EventCategory; icon: React.ElementType }[] = [
  { name: 'cultural', icon: Paintbrush },
  { name: 'tech', icon: Code },
  { name: 'clubs', icon: Users },
];

export function EventTabs({ activeCategory, onCategoryChange }: EventTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as EventCategory)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 neumorphic-flat p-1 h-auto">
        {categories.map((category) => (
          <TabsTrigger
            key={category.name}
            value={category.name}
            className="capitalize flex items-center gap-2 py-2 text-base"
          >
            <category.icon className="w-5 h-5" />
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
