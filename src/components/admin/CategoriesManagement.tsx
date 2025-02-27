
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Trash2, Plus } from "lucide-react";
import { businesses } from "@/data/businesses";

interface Category {
  id: string;
  name: string;
  count: number;
}

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // In un'app reale, faremmo una chiamata API
    // Qui, estraiamo le categorie dai dati delle attività
    const categoryMap = businesses.reduce<Record<string, number>>(
      (acc, business) => {
        if (!acc[business.category]) {
          acc[business.category] = 0;
        }
        acc[business.category]++;
        return acc;
      },
      {}
    );

    const categoriesArray = Object.entries(categoryMap).map(
      ([name, count], index) => ({
        id: (index + 1).toString(),
        name,
        count,
      })
    );

    const savedCategories = localStorage.getItem("admin_categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(categoriesArray);
      localStorage.setItem("admin_categories", JSON.stringify(categoriesArray));
    }
  }, []);

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      count: 0,
    };

    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
    setIsAdding(false);
    setNewCategoryName("");

    toast({
      title: "Categoria aggiunta",
      description: `La categoria "${newCategory.name}" è stata aggiunta con successo`,
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    const updatedCategories = categories.map((category) =>
      category.id === editingCategory.id ? editingCategory : category
    );

    saveCategories(updatedCategories);
    setEditingCategory(null);

    toast({
      title: "Categoria aggiornata",
      description: `La categoria è stata rinominata in "${editingCategory.name}"`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((c) => c.id === id);
    if (!categoryToDelete) return;

    if (categoryToDelete.count > 0) {
      toast({
        title: "Impossibile eliminare",
        description: `La categoria "${categoryToDelete.name}" è utilizzata da ${categoryToDelete.count} attività`,
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.filter((category) => category.id !== id);
    saveCategories(updatedCategories);

    toast({
      title: "Categoria eliminata",
      description: `La categoria "${categoryToDelete.name}" è stata eliminata`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestione Categorie</CardTitle>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Categoria
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Aggiungi nuova categoria</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="new-category">Nome categoria</Label>
                <Input
                  id="new-category"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Inserisci nome categoria"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                Salva
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoryName("");
                }}
              >
                Annulla
              </Button>
            </div>
          </div>
        )}

        {editingCategory && (
          <div className="bg-gray-50 p-4 mb-6 rounded-lg border">
            <h3 className="font-medium mb-4">Modifica categoria</h3>
            <div className="grid gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Nome categoria</Label>
                <Input
                  id="edit-category"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateCategory}
                disabled={!editingCategory.name.trim()}
              >
                Aggiorna
              </Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Annulla
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <div className="grid grid-cols-3 font-medium p-3 border-b bg-gray-50">
            <div>Nome Categoria</div>
            <div>Numero Attività</div>
            <div className="text-right">Azioni</div>
          </div>
          <div className="divide-y">
            {categories.map((category) => (
              <div key={category.id} className="grid grid-cols-3 p-3 items-center">
                <div>{category.name}</div>
                <div>{category.count}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={category.count > 0}
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

export default CategoriesManagement;
