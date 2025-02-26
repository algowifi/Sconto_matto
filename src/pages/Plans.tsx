import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Base',
      limit: 5,
      price: 'free',
      features: ['Fino a 5 sconti attivabili', 'Accesso a tutte le categorie', 'Supporto base']
    },
    {
      name: 'Medium',
      limit: 8,
      price: '€9.99',
      features: ['Fino a 8 sconti attivabili', 'Accesso prioritario', 'Supporto dedicato']
    },
    {
      name: 'Premium',
      limit: 15,
      price: '€19.99',
      features: ['Fino a 15 sconti attivabili', 'Accesso VIP',  'Offerte esclusive']
    }
  ];

  const handleSelectPlan = (limit: number) => {
    localStorage.setItem('selectedPlanLimit', limit.toString());
    navigate('/businesses');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Scegli il Tuo Piano</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleziona il piano più adatto alle tue esigenze
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative overflow-hidden transition-transform hover:scale-105">
              <CardHeader>
                <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                <p className="text-3xl font-bold text-center text-primary">{plan.price}</p>
                <p className="text-sm text-center text-muted-foreground">annuo</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPlan(plan.limit)}
                >
                  Seleziona Piano
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
