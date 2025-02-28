
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyUserCredentials, createUser } from "@/data/users"; // Updated import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verifica delle credenziali dell'utente
      const user = await verifyUserCredentials(email, password);

      if (user) {
        // Imposta il flag di autenticazione e i dati dell'utente
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", user.username);
        localStorage.setItem("selectedPlan", user.plan.toLowerCase());
        
        // Imposta i limiti del piano in base al piano dell'utente
        if (user.plan === "Base") {
          localStorage.setItem("selectedPlanLimit", "5");
        } else if (user.plan === "Medium") {
          localStorage.setItem("selectedPlanLimit", "8");
        } else if (user.plan === "Premium") {
          localStorage.setItem("selectedPlanLimit", "15");
        }
        
        toast({
          title: "Accesso effettuato",
          description: `Benvenuto, ${user.username}!`,
        });
        
        navigate("/profile"); // Reindirizza al profilo invece che direttamente alle businesses
      } else {
        toast({
          title: "Utente non trovato",
          description: "Email non registrata. Vuoi creare un nuovo account?",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'accesso.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email.includes('@')) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Utilizza il metodo createUser dal database
      const newUser = await createUser({
        username: email.split('@')[0],
        email: email,
        plan: "Base"
      });
      
      // Autenticazione automatica
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", newUser.username);
      localStorage.setItem("selectedPlan", "base");
      localStorage.setItem("selectedPlanLimit", "5");
      
      toast({
        title: "Registrazione completata",
        description: `Benvenuto, ${newUser.username}!`,
      });
      
      navigate("/plans");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Errore nella registrazione",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la registrazione.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Accedi al tuo account</CardTitle>
          <CardDescription>
            Inserisci le tue credenziali per accedere
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
            <div className="text-center w-full">
              <span className="text-sm text-muted-foreground">Non hai un account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm" 
                type="button"
                onClick={handleRegister}
              >
                Registrati ora
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
