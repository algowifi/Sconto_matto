
import { Business } from '../types/business';
import { cn } from '@/lib/utils';
import { Check, Percent } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BusinessCardProps {
  business: Business;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const BusinessCard = ({ business, isSelected, onSelect }: BusinessCardProps) => {
  return (
    <Card
      className={cn(
        'business-card relative overflow-hidden cursor-pointer p-6',
        'hover:shadow-lg transition-all duration-300',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(business.id)}
    >
      <div className="absolute top-4 right-4">
        {isSelected && (
          <div className="bg-primary rounded-full p-1 text-white">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
          <img
            src={business.image}
            alt={business.name}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{business.name}</h3>
              <p className="text-sm text-muted-foreground">{business.category}</p>
            </div>
            <div className="flex items-center text-primary font-semibold">
              <span className="text-lg">{business.discount}</span>
              <Percent className="h-4 w-4 ml-0.5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {business.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BusinessCard;
