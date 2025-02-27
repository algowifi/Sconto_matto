import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { businesses } from '@/data/businesses';
import { saveUserSelectedBusinesses, getUserSelectedBusinesses } from '@/data/users';
import { Business } from "@/types/business";
import { LogOut, Percent } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [discountRange, setDiscountRange] = useState<number[]>([10, 20]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Business[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [planLimit, setPlanLimit] = useState<number>(0);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const limit = localStorage.getItem('selectedPlanLimit');

    if (!email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    setUserName(name || "");
    setPlanLimit(Number(limit) || 0);

    const selectedIds = getUserSelectedBusinesses(email);
    const selectedBusiness = businesses.filter(business => 
      selectedIds.includes(business.id)
    );
    setSelectedBusinesses(selectedBusiness);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedPlanLimit');
    toast({
      title: "Logout effettuato con successo",
    })
    navigate('/login');
  };

  const filteredBusinesses = businesses.filter(business => {
    const searchTermMatch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const discountMatch = business.discount >= discountRange[0] && business.discount <= discountRange[1];
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(business.category);

    return searchTermMatch && discountMatch && categoryMatch;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleBusinessSelection = (businessId: string) => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }

    const selectedIds = getUserSelectedBusinesses(email);
    if (selectedIds.includes(businessId)) {
      // Rimuovi l'attività se è già selezionata
      saveUserSelectedBusinesses(email, selectedIds.filter(id => id !== businessId));
      setSelectedBusinesses(prev => prev.filter(b => b.id !== businessId));
      toast({
        title: "Offerta rimossa!",
        description: "Hai rimosso l'offerta dai tuoi preferiti.",
      })
    } else {
      if (selectedBusinesses.length >= planLimit) {
        toast({
          title: "Hai raggiunto il limite di offerte attivabili!",
          description: `Il tuo piano ti permette di attivare ${planLimit} offerte.`,
        })
        return;
      }
      // Aggiungi l'attività se non è selezionata
      saveUserSelectedBusinesses(email, [...selectedIds, businessId]);
      setSelectedBusinesses(prev => [...prev, businesses.find(b => b.id === businessId)!]);
      toast({
        title: "Offerta aggiunta!",
        description: "Hai aggiunto l'offerta ai tuoi preferiti.",
      })
    }
  };

  const isBusinessSelected = (businessId: string) => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      return false;
    }
    const selectedIds = getUserSelectedBusinesses(email);
    return selectedIds.includes(businessId);
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const availableCategories = [...new Set(businesses.map(business => business.category))];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Offerte Esclusive</h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Filtra le offerte</CardTitle>
              <CardDescription>Utilizza i filtri per trovare le offerte che fanno al caso tuo</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="search">Cerca</Label>
                  <Input 
                    type="search" 
                    id="search" 
                    placeholder="Cerca per nome o descrizione" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Accordion type="multiple" collapsible>
                    <AccordionItem value="categories">
                      <AccordionTrigger>Categorie</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {availableCategories.map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox 
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                              />
                              <Label htmlFor={category}>{category}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={business.image}
                  alt={business.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg"; // Usa un placeholder in caso di errore
                  }}
                />
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 flex items-center">
                  <span className="font-semibold text-sm mx-1">{business.discount}</span>
                  <Percent size={14} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{business.name}</h3>
                <p className="text-sm text-muted-foreground">{business.category}</p>
                <p className="text-sm mt-2 line-clamp-2">{business.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button 
                  variant={isBusinessSelected(business.id) ? 'destructive' : 'primary'}
                  className={isBusinessSelected(business.id) ? '' : 'bg-green-500 hover:bg-green-700 text-white'}
                  onClick={() => handleBusinessSelection(business.id)}
                >
                  {isBusinessSelected(business.id) ? 'Rimuovi' : 'Attiva'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {selectedBusinesses.length}/{planLimit}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Button onClick={handleViewProfile}>OK</Button>
      </div>
    </div>
  );
};

export default Index;
