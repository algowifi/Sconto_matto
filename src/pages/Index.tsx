
import { businesses } from '../data/businesses';
import BusinessList from '../components/BusinessList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Estrai le categorie uniche dalle attività
  const categories = ['all', ...new Set(businesses.map(b => b.category))];

  // Filtra le attività in base alla categoria selezionata
  const filteredBusinesses = selectedCategory === 'all' 
    ? businesses 
    : businesses.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Offerte Esclusive</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleziona le attività che ti interessano per attivare gli sconti esclusivi
          </p>
        </div>
        
        <div className="w-full max-w-xs mx-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona una categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'Tutte le categorie' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <BusinessList businesses={filteredBusinesses} />
      </div>
    </div>
  );
};

export default Index;
