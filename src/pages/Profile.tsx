import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses } from '@/data/businesses';
import { getUserSelectedBusinesses } from '@/data/users';
import { Business } from "@/types/business";
import { LogOut, CreditCard, ArrowRight, Percent, Trash } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [planLimit, setPlanLimit] = useState<number>(0);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Business[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Recupera i dati dell'utente
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const plan = localStorage.getItem('selectedPlan');
    const limit = localStorage.getItem('selectedPlanLimit');

    if (!email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    setUserName(name || "");
    setCurrentPlan(plan || "");
    setPlanLimit(Number(limit) || 0);

    // Se l'utente non ha un piano, redirigiamo alla pagina dei piani
    if (!plan || !limit) {
      navigate('/plans');
      return;
    }

    // Recupera le attività selezionate dall'utente
    const selectedIds = getUserSelectedBusinesses(email);
    const selectedBusiness = businesses.filter(business => 
      selectedIds.includes(business.id)
    );
    setSelectedBusinesses(selectedBusiness);

    // Calcola il risparmio totale (come esempio)
    const savings = selectedBusiness.reduce((total, business) => 
      total + business.discount, 0
    );
    setTotalSavings(savings);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedPlanLimit');
    toast.success('Logout effettuato con successo');
    navigate('/login');
  };

  const handleViewOffers = () => {
    navigate('/businesses');
  };

  const handleChangePlan = () => {
    navigate('/plans');
  };

  const handleRemoveOffer = (businessId: string) => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }

    const selectedIds = getUserSelectedBusinesses(email);
    // Rimuovi l'attività se è già selezionata
    const updatedIds = selectedIds.filter(id => id !== businessId);
    localStorage.setItem(`selectedBusinesses_${email}`, JSON.stringify(updatedIds));
    setSelectedBusinesses(prev => prev.filter(b => b.id !== businessId));
    toast.success('Offerta rimossa con successo!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Il Tuo Profilo</h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        {/* Riepilogo Utente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Dati Personali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">Nome:</span> {userName}</p>
              <p><span className="font-medium">Email:</span> {userEmail}</p>
              <p><span className="font-medium">Piano:</span> {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</p>
              <p><span className="font-medium">Sconti disponibili:</span> {planLimit}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleChangePlan} className="flex items-center gap-2">
                <CreditCard size={16} />
                Cambia Piano
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Statistiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">Offerte attivate:</span> {selectedBusinesses.length}</p>
              <p><span className="font-medium">% di risparmio:</span> {totalSavings}%</p>
              <p><span className="font-medium">Offerte disponibili:</span> {planLimit - selectedBusinesses.length}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleViewOffers} className="w-full">
                Visualizza Offerte
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Piano Attuale</CardTitle>
              <CardDescription>
                {currentPlan === 'base' ? 'Piano base con funzionalità essenziali' : 
                 currentPlan === 'medium' ? 'Piano intermedio con funzionalità avanzate' : 
                 'Piano premium con tutte le funzionalità'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {currentPlan === 'base' ? 'Gratuito' : 
                 currentPlan === 'medium' ? '€9.99' : 
                 '€19.99'}
              </div>
              <p className="text-sm text-muted-foreground">annuo</p>
            </CardContent>
            <CardFooter>
              {currentPlan !== 'premium' && (
                <Button variant="outline" onClick={handleChangePlan} className="w-full">
                  Upgrade
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Offerte Selezionate */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Le Tue Offerte Attive</h2>
          {selectedBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Non hai ancora attivato nessuna offerta.</p>
              <Button 
                onClick={handleViewOffers} 
                className="mt-4 flex items-center mx-auto gap-2"
              >
                Scopri le Offerte <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedBusinesses.map((business) => (
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
                      variant="destructive"
                      onClick={() => handleRemoveOffer(business.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash size={16} />
                      Rimuovi
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
