
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, UserX, UserPlus } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  plan: string;
  isActive: boolean;
  registeredDate: string;
}

// Utenti di esempio
const mockUsers: User[] = [
  {
    id: "1",
    username: "mario_rossi",
    email: "mario@example.com",
    plan: "Base",
    isActive: true,
    registeredDate: "2023-08-15",
  },
  {
    id: "2",
    username: "giulia_bianchi",
    email: "giulia@example.com",
    plan: "Premium",
    isActive: true,
    registeredDate: "2023-10-22",
  },
  {
    id: "3",
    username: "roberto_verdi",
    email: "roberto@example.com",
    plan: "Medium",
    isActive: false,
    registeredDate: "2023-11-30",
  },
];

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "registeredDate">>({
    username: "",
    email: "",
    plan: "Base",
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // In un'app reale, qui faremmo una chiamata API
    const savedUsers = localStorage.getItem("admin_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(mockUsers);
      localStorage.setItem("admin_users", JSON.stringify(mockUsers));
    }
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("admin_users", JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    const id = Date.now().toString();
    const newUserComplete: User = {
      ...newUser,
      id,
      registeredDate: new Date().toISOString().split("T")[0],
    };
    
    const updatedUsers = [...users, newUserComplete];
    saveUsers(updatedUsers);
    
    setIsAdding(false);
    setNewUser({
      username: "",
      email: "",
      plan: "Base",
      isActive: true,
    });
    
    toast({
      title: "Utente aggiunto",
      description: `L'utente ${newUser.username} è stato aggiunto con successo`,
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? editingUser : user
    );
    
    saveUsers(updatedUsers);
    setEditingUser(null);
    
    toast({
      title: "Utente aggiornato",
      description: `Le informazioni dell'utente ${editingUser.username} sono state aggiornate`,
    });
  };

  const handleToggleStatus = (id: string) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    );
    
    saveUsers(updatedUsers);
    
    const user = updatedUsers.find((u) => u.id === id);
    
    toast({
      title: user?.isActive ? "Utente attivato" : "Utente disattivato",
      description: `L'utente ${user?.username} è stato ${user?.isActive ? "attivato" : "disattivato"}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestione Utenti</CardTitle>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <UserPlus className="mr-2 h-4 w-4" /> Aggiungi Utente
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Aggiungi nuovo utente</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-plan">Piano</Label>
                <Select
                  value={newUser.plan}
                  onValueChange={(value) => setNewUser({ ...newUser, plan: value })}
                >
                  <SelectTrigger id="new-plan">
                    <SelectValue placeholder="Seleziona piano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser} disabled={!newUser.username || !newUser.email}>
                Salva
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewUser({
                    username: "",
                    email: "",
                    plan: "Base",
                    isActive: true,
                  });
                }}
              >
                Annulla
              </Button>
            </div>
          </div>
        )}

        {editingUser && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Modifica utente</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-plan">Piano</Label>
                <Select
                  value={editingUser.plan}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, plan: value })
                  }
                >
                  <SelectTrigger id="edit-plan">
                    <SelectValue placeholder="Seleziona piano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateUser}>Aggiorna</Button>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Annulla
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <div className="grid grid-cols-6 font-medium p-3 border-b bg-gray-50">
            <div>Username</div>
            <div>Email</div>
            <div>Piano</div>
            <div>Stato</div>
            <div>Data Registrazione</div>
            <div className="text-right">Azioni</div>
          </div>
          <div className="divide-y">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-6 p-3 items-center">
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>{user.plan}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Attivo" : "Disattivato"}
                  </span>
                </div>
                <div>{user.registeredDate}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={user.isActive ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
