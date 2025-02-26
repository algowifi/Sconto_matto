
import { useState } from 'react';
import { Business } from '../types/business';
import BusinessCard from './BusinessCard';
import { toast } from 'sonner';

interface BusinessListProps {
  businesses: Business[];
}

const BusinessList = ({ businesses }: BusinessListProps) => {
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedBusinesses((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((businessId) => businessId !== id)
        : [...prev, id];
      
      if (newSelected.includes(id)) {
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
