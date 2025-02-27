
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Trash2, Plus, MapPin, Upload } from "lucide-react";
import { businesses as initialBusinesses } from "@/data/businesses";
import { Business } from "@/types/business";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Nota: In un'applicazione reale, questo token dovrebbe essere in un file .env
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNsbWw0OWgxbzA5bWkzZG16bjMwcTViN3QifQ.hVUU0SVdoInU95uwfYzGzQ';

const BusinessesManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: "",
    category: "",
    discount: 10,
    description: "",
    image: "/placeholder.svg",
    latitude: 0,
    longitude: 0,
  });
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
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

  useEffect(() => {
    if (mapVisible && mapContainerRef.current && !mapRef.current) {
      // Inizializza la mappa
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [12.4964, 41.9028], // Default su Roma
        zoom: 5
      });

      // Aggiungi controlli di navigazione
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Aggiungi l'evento per il click sulla mappa
      mapRef.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setSelectedLocation({ lng, lat });
        
        // Aggiorna il business che stai modificando o aggiungendo
        if (editingBusiness) {
          setEditingBusiness({
            ...editingBusiness,
            latitude: lat,
            longitude: lng
          });
        } else {
          setNewBusiness({
            ...newBusiness,
            latitude: lat,
            longitude: lng
          });
        }

        // Aggiorna o crea un marker
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mapVisible, editingBusiness, newBusiness]);

  // Effetto per impostare il marker quando si modifica un business con coordinate
  useEffect(() => {
    if (mapVisible && mapRef.current && editingBusiness && editingBusiness.latitude && editingBusiness.longitude) {
      // Centra la mappa sulla posizione del business
      mapRef.current.setCenter([editingBusiness.longitude, editingBusiness.latitude]);
      
      // Crea o aggiorna il marker
      if (markerRef.current) {
        markerRef.current.setLngLat([editingBusiness.longitude, editingBusiness.latitude]);
      } else {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([editingBusiness.longitude, editingBusiness.latitude])
          .addTo(mapRef.current);
      }
      
      setSelectedLocation({ 
        lng: editingBusiness.longitude, 
        lat: editingBusiness.latitude 
      });
    }
  }, [mapVisible, editingBusiness]);

  const saveBusinesses = (updatedBusinesses: Business[]) => {
    setBusinesses(updatedBusinesses);
    localStorage.setItem("admin_businesses", JSON.stringify(updatedBusinesses));
  };

  const handleAddBusiness = () => {
    const id = Date.now().toString();
    const newBusinessComplete = {
      ...newBusiness,
      id,
    } as Business;

    const updatedBusinesses = [...businesses, newBusinessComplete];
    saveBusinesses(updatedBusinesses);
    
    // Aggiorna anche il conteggio della categoria
    updateCategoryCount(newBusiness.category as string, 1);

    setIsAdding(false);
    setNewBusiness({
      name: "",
      category: "",
      discount: 10,
      description: "",
      image: "/placeholder.svg",
      latitude: 0,
      longitude: 0,
    });
    setMapVisible(false);
    setSelectedLocation(null);
    setImagePreview("/placeholder.svg");
    
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
    setMapVisible(false);
    setSelectedLocation(null);
    setImagePreview("/placeholder.svg");

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In un'app reale dovremmo caricare il file su un server
    // Per questa demo, utilizziamo l'URL del file locale
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      if (isEditing && editingBusiness) {
        setEditingBusiness({
          ...editingBusiness,
          image: imageUrl,
        });
      } else {
        setNewBusiness({
          ...newBusiness,
          image: imageUrl,
        });
      }
      setImagePreview(imageUrl);
    };
    reader.readAsDataURL(file);
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
                  value={newBusiness.category as string}
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
              <div className="grid gap-2">
                <Label htmlFor="new-image">Immagine</Label>
                <div className="flex gap-4 items-center">
                  <div className="h-24 w-24 border rounded-lg overflow-hidden flex items-center justify-center bg-white">
                    <img src={imagePreview} alt="Anteprima" className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1">
                    <Input
                      id="new-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="new-image" 
                      className="flex items-center gap-2 cursor-pointer bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors w-fit"
                    >
                      <Upload size={16} /> Carica immagine
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Posizione sulla mappa</Label>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm" 
                    onClick={() => setMapVisible(!mapVisible)}
                  >
                    {mapVisible ? "Nascondi mappa" : "Mostra mappa"}
                  </Button>
                </div>
                
                {mapVisible && (
                  <div className="relative w-full h-96 mt-2">
                    <div ref={mapContainerRef} className="absolute inset-0 rounded-lg border" />
                    {selectedLocation && (
                      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-lg shadow-lg text-sm">
                        <p className="font-medium">Posizione selezionata:</p>
                        <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
                        <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
                      </div>
                    )}
                  </div>
                )}
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
                  setMapVisible(false);
                  setSelectedLocation(null);
                  setNewBusiness({
                    name: "",
                    category: "",
                    discount: 10,
                    description: "",
                    image: "/placeholder.svg",
                    latitude: 0,
                    longitude: 0,
                  });
                  setImagePreview("/placeholder.svg");
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
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Immagine</Label>
                <div className="flex gap-4 items-center">
                  <div className="h-24 w-24 border rounded-lg overflow-hidden flex items-center justify-center bg-white">
                    <img 
                      src={editingBusiness.image || "/placeholder.svg"} 
                      alt="Anteprima" 
                      className="object-cover h-full w-full" 
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="edit-image" 
                      className="flex items-center gap-2 cursor-pointer bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors w-fit"
                    >
                      <Upload size={16} /> Carica immagine
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Posizione sulla mappa</Label>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm" 
                    onClick={() => setMapVisible(!mapVisible)}
                  >
                    {mapVisible ? "Nascondi mappa" : "Mostra mappa"}
                  </Button>
                </div>
                
                {mapVisible && (
                  <div className="relative w-full h-96 mt-2">
                    <div ref={mapContainerRef} className="absolute inset-0 rounded-lg border" />
                    {selectedLocation && (
                      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-lg shadow-lg text-sm">
                        <p className="font-medium">Posizione selezionata:</p>
                        <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
                        <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateBusiness}
                disabled={!editingBusiness.name || !editingBusiness.category}
              >
                Aggiorna
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingBusiness(null);
                setMapVisible(false);
                setSelectedLocation(null);
              }}>
                Annulla
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <div className="grid grid-cols-7 font-medium p-3 border-b bg-gray-50">
            <div>Nome</div>
            <div>Categoria</div>
            <div>Sconto</div>
            <div className="col-span-2">Descrizione</div>
            <div>Posizione</div>
            <div className="text-right">Azioni</div>
          </div>
          <div className="divide-y">
            {businesses.map((business) => (
              <div key={business.id} className="grid grid-cols-7 p-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={business.image} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="truncate">{business.name}</span>
                </div>
                <div>{business.category}</div>
                <div>{business.discount}%</div>
                <div className="col-span-2 truncate">{business.description}</div>
                <div>
                  {business.latitude && business.longitude ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Apri Google Maps in una nuova finestra
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`,
                          '_blank'
                        );
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Mappa
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">Non impostata</span>
                  )}
                </div>
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
