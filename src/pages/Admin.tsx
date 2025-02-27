
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, Tag, Store, BarChart } from "lucide-react";
import { businesses } from "@/data/businesses";
import UsersManagement from "@/components/admin/UsersManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import BusinessesManagement from "@/components/admin/BusinessesManagement";
import Statistics from "@/components/admin/Statistics";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
    if (!isAdminAuthenticated) {
      navigate("/admin-login");
      return;
    }
    setIsAdmin(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin-login");
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Verifica autenticazione...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Amministrativa</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px] w-full">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" /> Statistiche
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Utenti
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> Categorie
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <Store className="h-4 w-4" /> Attività
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics">
            <Statistics />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="businesses">
            <BusinessesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
