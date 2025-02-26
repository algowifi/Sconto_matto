
import { businesses } from '../data/businesses';
import BusinessList from '../components/BusinessList';

const Index = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Offerte Esclusive</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleziona le attività che ti interessano per attivare gli sconti esclusivi
          </p>
        </div>
        
        <BusinessList businesses={businesses} />
      </div>
    </div>
  );
};

export default Index;
