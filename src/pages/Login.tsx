
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Per favore compila tutti i campi");
      return;
    }

    // In un'app reale, qui ci sarebbe l'autenticazione con un backend
    // Per questo esempio, simuliamo un login/registrazione di successo
    if (isLogin) {
      // Simula login
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      toast.success("Login effettuato con successo!");
    } else {
      // Simula registrazione
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      toast.success("Registrazione completata con successo!");
    }
    
    // Reindirizza alla pagina dei piani
    navigate("/");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset dei campi quando si cambia modalità
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Accedi" : "Registrati"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin
                ? "Accedi per vedere le offerte esclusive"
                : "Crea un account per accedere alle offerte"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="La tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? (
                <>
                  <LogIn className="mr-2" size={18} />
                  Accedi
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Registrati
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {isLogin
                ? "Non hai un account? Registrati"
                : "Hai già un account? Accedi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
