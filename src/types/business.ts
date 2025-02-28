
export interface Business {
  id: string;
  name: string;
  category: string;
  discount: number;
  description: string;
  image: string;
  selected?: boolean;
  latitude?: number;
  longitude?: number;
}

// Interfaccia per la creazione di una nuova attività
export interface BusinessCreate {
  name: string;
  category: string;
  discount: number;
  description: string;
  image: string;
  latitude?: number;
  longitude?: number;
}

// Interfaccia per l'aggiornamento di un'attività
export interface BusinessUpdate extends Partial<BusinessCreate> {
  id: string;
}
