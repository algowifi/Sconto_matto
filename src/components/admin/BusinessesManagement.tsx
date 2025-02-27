
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Trash2, Plus } from "lucide-react";
import { businesses as initialBusinesses } from "@/data/businesses";
import { Business } from "@/types/business";

const BusinessesManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Omit<Business, "id">>({
    name: "",
    category: "",
    discount: 10,
    description: "",
    image: "/placeholder.svg",
  });
  const { toast } = useToast();

  useEffect(() => {
    // In un'app reale, faremmo una chiamata API
    const savedBusinesses = localStorage.getItem("admin_businesses");
    if (savedBusinesses) {
      setBusinesses(JSON.parse(savedBusinesses));
    } else {
      setBusinesses(initialBusinesses);
      localStorage.setItem("admin_businesses", JSON.stringify(initialBusinesses));
    }

    // Ottenere le categorie uniche
    const savedCategories = localStorage.getItem("admin_categories");
    if (savedCategories) {
      const categoriesData = JSON.parse(savedCategories);
      setCategories(categoriesData.map((cat: { name: string }) => cat.name));
    } else {
      const uniqueCategories = Array.from(
        new Set(initialBusinesses.map((b) => b.category))
      );
      setCategories(uniqueCategories);
    }
  }, []);

  const saveBusinesses = (updatedBusinesses: Business[]) => {
    setBusinesses(updatedBusinesses);
    localStorage.setItem("admin_businesses", JSON.stringify(updatedBusinesses));
  };

  const handleAddBusiness = () => {
    const id = Date.now().toString();
    const newBusinessComplete: Business = {
      ...newBusiness,
      id,
    };

    const updatedBusinesses = [...businesses, newBusinessComplete];
    saveBusinesses(updatedBusinesses);
    
    // Aggiorna anche il conteggio della categoria
    updateCategoryCount(newBusiness.category, 1);

    setIsAdding(false);
    setNewBusiness({
      name: "",
      category: "",
      discount: 10,
      description: "",
      image: "/placeholder.svg",
    });

    toast({
      title: "Attività aggiunta",
      description: `L'attività "${newBusiness.name}" è stata aggiunta con successo`,
    });
  };

  const updateCategoryCount = (categoryName: string, change: number) => {
    const savedCategories = localStorage.getItem("admin_categories");
    if (savedCategories) {
      const categoriesData = JSON.parse(savedCategories);
      const updatedCategories = categoriesData.map((cat: any) => {
        if (cat.name === categoryName) {
          return { ...cat, count: cat.count + change };
        }
        return cat;
      });
      localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
    }
  };

  const handleUpdateBusiness = () => {
    if (!editingBusiness) return;

    const oldBusiness = businesses.find((b) => b.id === editingBusiness.id);
    if (oldBusiness && oldBusiness.category !== editingBusiness.category) {
      // La categoria è cambiata, aggiorna i conteggi
      updateCategoryCount(oldBusiness.category, -1);
      updateCategoryCount(editingBusiness.category, 1);
    }

    const updatedBusinesses = businesses.map((business) =>
      business.id === editingBusiness.id ? editingBusiness : business
    );

    saveBusinesses(updatedBusinesses);
    setEditingBusiness(null);

    toast({
      title: "Attività aggiornata",
      description: `Le informazioni dell'attività "${editingBusiness.name}" sono state aggiornate`,
    });
  };

  const handleDeleteBusiness = (id: string) => {
    const businessToDelete = businesses.find((b) => b.id === id);
    if (!businessToDelete) return;

    // Aggiorna il conteggio della categoria
    updateCategoryCount(businessToDelete.category, -1);

    const updatedBusinesses = businesses.filter((business) => business.id !== id);
    saveBusinesses(updatedBusinesses);

    toast({
      title: "Attività eliminata",
      description: `L'attività "${businessToDelete.name}" è stata eliminata`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestione Attività</CardTitle>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Attività
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Aggiungi nuova attività</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="new-name">Nome</Label>
                <Input
                  id="new-name"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-category">Categoria</Label>
                <Select
                  value={newBusiness.category}
                  onValueChange={(value) => setNewBusiness({ ...newBusiness, category: value })}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-discount">Sconto (%)</Label>
                <Input
                  id="new-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={newBusiness.discount}
                  onChange={(e) => setNewBusiness({ ...newBusiness, discount: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-description">Descrizione</Label>
                <Input
                  id="new-description"
                  value={newBusiness.description}
                  onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddBusiness}
                disabled={!newBusiness.name || !newBusiness.category}
              >
                Salva
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewBusiness({
                    name: "",
                    category: "",
                    discount: 10,
                    description: "",
                    image: "/placeholder.svg",
                  });
                }}
              >
                Annulla
              </Button>
            </div>
          </div>
        )}

        {editingBusiness && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Modifica attività</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingBusiness.name}
                  onChange={(e) =>
                    setEditingBusiness({ ...editingBusiness, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Select
                  value={editingBusiness.category}
                  onValueChange={(value) =>
                    setEditingBusiness({ ...editingBusiness, category: value })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-discount">Sconto (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={editingBusiness.discount}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      discount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrizione</Label>
                <Input
                  id="edit-description"
                  value={editingBusiness.description}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateBusiness}
                disabled={!editingBusiness.name || !editingBusiness.category}
              >
                Aggiorna
              </Button>
              <Button variant="outline" onClick={() => setEditingBusiness(null)}>
                Annulla
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <div className="grid grid-cols-6 font-medium p-3 border-b bg-gray-50">
            <div>Nome</div>
            <div>Categoria</div>
            <div>Sconto</div>
            <div className="col-span-2">Descrizione</div>
            <div className="text-right">Azioni</div>
          </div>
          <div className="divide-y">
            {businesses.map((business) => (
              <div key={business.id} className="grid grid-cols-6 p-3 items-center">
                <div>{business.name}</div>
                <div>{business.category}</div>
                <div>{business.discount}%</div>
                <div className="col-span-2 truncate">{business.description}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingBusiness(business)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteBusiness(business.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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

export default BusinessesManagement;
