import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Tag, Store, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface User {
  id: string;
  username: string;
  email: string;
  plan: string;
  isActive: boolean;
  registeredDate: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Business {
  id: string;
  name: string;
  category: string;
  discount: number;
  description: string;
  image: string;
  selected?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

const Statistics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [planData, setPlanData] = useState<{ name: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalDiscounts, setTotalDiscounts] = useState(0);

  useEffect(() => {
    // Carica dati dagli utenti
    const savedUsers = localStorage.getItem("admin_users");
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      
      // Calcola statistiche utenti
      setActiveUsers(parsedUsers.filter((user: User) => user.isActive).length);
      
      // Prepara dati per il grafico dei piani
      const planCounts: Record<string, number> = {};
      parsedUsers.forEach((user: User) => {
        if (!planCounts[user.plan]) {
          planCounts[user.plan] = 0;
        }
        planCounts[user.plan]++;
      });
      
      setPlanData(
        Object.entries(planCounts).map(([name, value]) => ({
          name,
          value,
        }))
      );
    }

    // Carica categorie
    const savedCategories = localStorage.getItem("admin_categories");
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories(parsedCategories);
      
      // Prepara dati per il grafico delle categorie
      setCategoryData(
        parsedCategories.map((cat: Category) => ({
          name: cat.name,
          count: cat.count,
        }))
      );
    }

    // Carica attività
    const savedBusinesses = localStorage.getItem("admin_businesses");
    if (savedBusinesses) {
      const parsedBusinesses = JSON.parse(savedBusinesses);
      setBusinesses(parsedBusinesses);
      
      // Calcola sconto medio
      const totalDiscount = parsedBusinesses.reduce(
        (sum: number, business: Business) => sum + business.discount,
        0
      );
      setTotalDiscounts(
        parsedBusinesses.length > 0
          ? Math.round(totalDiscount / parsedBusinesses.length)
          : 0
      );
    }
  }, []);

  const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Utenti Totali
                </p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {activeUsers} utenti attivi ({Math.round((activeUsers / (users.length || 1)) * 100)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Tag className="h-6 w-6 text-green-700" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Categorie
                </p>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {categories.reduce((sum, cat) => sum + cat.count, 0)} attività classificate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                <Store className="h-6 w-6 text-purple-700" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Attività
                </p>
                <p className="text-3xl font-bold">{businesses.length}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                In {categories.length} categorie diverse
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                <Percent className="h-6 w-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Sconto Medio
                </p>
                <p className="text-3xl font-bold">{totalDiscounts}%</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Basato su {businesses.length} attività
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuzione Piani</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Attività per Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Numero Attività"
                    fill="#8884d8"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRandomColor()} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
