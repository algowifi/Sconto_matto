import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyUserCredentials, mockUsers } from "@/data/users"; // Importiamo anche i mockUsers

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
      const user = verifyUserCredentials(email, password);

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

  const handleRegister = () => {
    // In una applicazione reale, reindirizzare a una pagina di registrazione
    // Per questa demo, registriamo l'utente con il piano Base
    const emailExists = mockUsers.some(user => user.email === email);
    
    if (!email.includes('@')) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }
    
    if (emailExists) {
      toast({
        title: "Email già registrata",
        description: "Questa email è già associata a un account.",
        variant: "destructive",
      });
      return;
    }
    
    // Simula una registrazione (in un'app reale, salveremmo nel database)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      username: email.split('@')[0],
      email: email,
      plan: "Base",
      isActive: true,
      registeredDate: new Date().toISOString().split('T')[0],
      selectedBusinessIds: []
    };
    
    // Aggiungiamo l'utente all'array mockUsers in localStorage
    const users = JSON.parse(localStorage.getItem("users") || JSON.stringify(mockUsers));
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
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
