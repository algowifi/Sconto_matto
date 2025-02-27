
import { useState, useEffect } from 'react';
import { Business } from '../types/business';
import BusinessCard from './BusinessCard';
import { toast } from 'sonner';

interface BusinessListProps {
  businesses: Business[];
  onSelectionChange: (newCount: number, selectedIds: string[]) => boolean;
  initialSelectedIds: string[];
}

const BusinessList = ({ businesses, onSelectionChange, initialSelectedIds }: BusinessListProps) => {
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>(initialSelectedIds || []);

  // Assicuriamoci che lo stato si aggiorni quando cambiano gli initialSelectedIds
  useEffect(() => {
    setSelectedBusinesses(initialSelectedIds || []);
  }, [initialSelectedIds]);

  const handleSelect = (id: string) => {
    setSelectedBusinesses((prev) => {
      const isCurrentlySelected = prev.includes(id);
      const newSelected = isCurrentlySelected
        ? prev.filter((businessId) => businessId !== id)
        : [...prev, id];
      
      const allowed = onSelectionChange(newSelected.length, newSelected);
      if (!allowed) {
        return prev;
      }
      
      if (!isCurrentlySelected) {
        toast.success('Sconto attivato con successo!');
      }
      
      return newSelected;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <div key={business.id} className="fade-in">
          <BusinessCard
            business={business}
            isSelected={selectedBusinesses.includes(business.id)}
            onSelect={handleSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default BusinessList;
