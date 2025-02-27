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
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { getUserSelectedBusinesses, saveUserSelectedBusinesses } from '@/data/users';

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [planLimit, setPlanLimit] = useState<number>(5);
  const [currentPlan, setCurrentPlan] = useState<string>('base');
  const [userEmail, setUserEmail] = useState<string>('');
  const [initialSelectedIds, setInitialSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [localBusinesses, setLocalBusinesses] = useState(businesses);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }
    setUserEmail(email);

    const limit = localStorage.getItem('selectedPlanLimit');
    const plan = localStorage.getItem('selectedPlan');
    if (!limit) {
      navigate('/');
      return;
    }
    setPlanLimit(Number(limit));
    setCurrentPlan(plan || 'base');

    // Carica le attività selezionate dall'utente
    const selectedBusinessIds = getUserSelectedBusinesses(email);
    setInitialSelectedIds(selectedBusinessIds);
    setSelectedCount(selectedBusinessIds.length);

    // Aggiorna l'elenco delle categorie dinamicamente dalle attività
    const uniqueCategories = ['all', ...new Set(businesses.map(b => b.category))];
    setCategories(uniqueCategories);

    // Prepara i business con immagini reali o placeholder
    const processedBusinesses = businesses.map(business => ({
      ...business,
      image: business.image || '/placeholder.svg'
    }));
    setLocalBusinesses(processedBusinesses);
  }, [navigate]);

  const filteredBusinesses = selectedCategory === 'all' 
    ? localBusinesses 
    : localBusinesses.filter(b => b.category === selectedCategory);

  // Assegna lo stato 'selected' alle attività già selezionate dall'utente
  const businessesWithSelection = filteredBusinesses.map(b => ({
    ...b,
    selected: initialSelectedIds.includes(b.id)
  }));

  const handleSelectionChange = (newCount: number, selectedIds: string[]) => {
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
    
    // Salva le selezioni dell'utente
    if (userEmail) {
      saveUserSelectedBusinesses(userEmail, selectedIds);
    }
    
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedPlanLimit');
    toast.success('Logout effettuato con successo');
    navigate('/login');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Offerte Esclusive</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seleziona le attività che ti interessano per attivare gli sconti esclusivi
              (max {planLimit} sconti)
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={handleGoToProfile}
              className="flex items-center gap-2"
            >
              Il Mio Profilo
            </Button>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
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
          businesses={businessesWithSelection} 
          onSelectionChange={handleSelectionChange}
          initialSelectedIds={initialSelectedIds}
        />
      </div>
    </div>
  );
};

export default Index;
