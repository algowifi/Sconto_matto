import { businesses } from '../data/businesses';
import BusinessList from '../components/BusinessList';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [planLimit, setPlanLimit] = useState<number>(5);
  const [currentPlan, setCurrentPlan] = useState<string>('base');

  useEffect(() => {
    const limit = localStorage.getItem('selectedPlanLimit');
    const plan = localStorage.getItem('selectedPlan');
    if (!limit) {
      navigate('/');
      return;
    }
    setPlanLimit(Number(limit));
    setCurrentPlan(plan || 'base');
  }, [navigate]);

  const categories = ['all', ...new Set(businesses.map(b => b.category))];
  const filteredBusinesses = selectedCategory === 'all' 
    ? businesses 
    : businesses.filter(b => b.category === selectedCategory);

  const handleSelectionChange = (newCount: number) => {
    if (newCount > planLimit) {
      if (currentPlan === 'premium') {
        toast.error(`Il tuo piano permette di selezionare massimo ${planLimit} sconti`);
      } else {
        const nextPlan = currentPlan === 'base' ? 'medium' : 'premium';
        const nextPlanLimit = currentPlan === 'base' ? 8 : 15;
        toast.error(
          `Hai raggiunto il limite del tuo piano! Passa al piano ${nextPlan} per selezionare fino a ${nextPlanLimit} sconti`,
          {
            action: {
              label: "Upgrade",
              onClick: () => navigate('/')
            }
          }
        );
      }
      return false;
    }
    setSelectedCount(newCount);
    return true;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Offerte Esclusive</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleziona le attività che ti interessano per attivare gli sconti esclusivi
            (max {planLimit} sconti)
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
        
        <BusinessList 
          businesses={filteredBusinesses} 
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export default Index;
