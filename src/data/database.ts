
import { Business } from '../types/business';
import { User, AdminUser } from './users';

// Inizializza il database SQLite in-memory
let db: any = null;

// Interfaccia per le categorie dal database
export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

// Inizializza il database
export const initializeDatabase = async (): Promise<void> => {
  if (db) return; // Database già inizializzato
  
  try {
    // In un'applicazione reale, qui si connetterebbe a un vero database
    // Per questa demo, creiamo un database fittizio basato su localStorage
    
    // Verifica se i dati sono già stati inizializzati in localStorage
    if (!localStorage.getItem('db_initialized')) {
      console.log('Inizializzazione database...');
      
      // Salva le categorie nel localStorage
      const categories = [
        { id: '1', name: 'Ristorante', icon: 'UtensilsCrossed' },
        { id: '2', name: 'Benessere', icon: 'Spa' },
        { id: '3', name: 'Fitness', icon: 'Dumbbell' },
        { id: '4', name: 'Intrattenimento', icon: 'Film' },
        { id: '5', name: 'Musei', icon: 'Landmark' },
        { id: '6', name: 'Parchi', icon: 'Leaf' },
        { id: '7', name: 'Scavi Archeologici', icon: 'Landmark' }
      ];
      localStorage.setItem('db_categories', JSON.stringify(categories));
      
      // Imposta il flag di inizializzazione
      localStorage.setItem('db_initialized', 'true');
    }
    
    console.log('Database inizializzato con successo');
  } catch (error) {
    console.error('Errore nell\'inizializzazione del database:', error);
  }
};

// Funzioni per le categorie
export const getCategories = async (): Promise<Category[]> => {
  await initializeDatabase();
  const categories = localStorage.getItem('db_categories');
  if (categories) {
    return JSON.parse(categories);
  }
  return [];
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  localStorage.setItem('db_categories', JSON.stringify(categories));
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const categories = await getCategories();
  return categories.find(category => category.id === id) || null;
};

export const getCategoryByName = async (name: string): Promise<Category | null> => {
  const categories = await getCategories();
  return categories.find(category => category.name === name) || null;
};

// Funzioni per le attività commerciali
export const getBusinesses = async (): Promise<Business[]> => {
  await initializeDatabase();
  
  // Recupera i dati dal localStorage o usa i dati predefiniti
  const savedBusinesses = localStorage.getItem('db_businesses');
  const categories = await getCategories();
  
  if (savedBusinesses) {
    const businesses = JSON.parse(savedBusinesses);
    
    // Assicurati che i business abbiano il nome della categoria anziché l'ID
    return await Promise.all(businesses.map(async (business: any) => {
      const category = categories.find(c => c.id === business.category_id);
      return {
        ...business,
        category: category?.name || 'Altra categoria',
      };
    }));
  } else {
    // Usa i dati predefiniti dalla struttura esistente
    const defaultBusinesses = (await import('./businesses')).businesses;
    
    // Converti nel formato del database e salva
    const dbBusinesses = await Promise.all(defaultBusinesses.map(async (business) => {
      const category = await getCategoryByName(business.category);
      return {
        id: business.id,
        name: business.name,
        description: business.description,
        discount: business.discount,
        category_id: category?.id || '1',
        image: business.image,
        latitude: business.latitude,
        longitude: business.longitude
      };
    }));
    
    localStorage.setItem('db_businesses', JSON.stringify(dbBusinesses));
    
    return defaultBusinesses;
  }
};

export const saveBusinesses = async (businesses: Business[]): Promise<void> => {
  // Converti nel formato del database prima di salvare
  const dbBusinesses = await Promise.all(businesses.map(async (business) => {
    const category = await getCategoryByName(business.category);
    return {
      id: business.id,
      name: business.name,
      description: business.description,
      discount: business.discount,
      category_id: category?.id || '1',
      image: business.image,
      latitude: business.latitude,
      longitude: business.longitude
    };
  }));
  
  localStorage.setItem('db_businesses', JSON.stringify(dbBusinesses));
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const businesses = await getBusinesses();
  return businesses.find(business => business.id === id) || null;
};

// Funzioni per gli utenti
export const getUsers = async (): Promise<User[]> => {
  await initializeDatabase();
  
  // Recupera i dati dal localStorage o usa i dati predefiniti
  const savedUsers = localStorage.getItem('db_users');
  
  if (savedUsers) {
    return JSON.parse(savedUsers);
  } else {
    // Usa i dati predefiniti dalla struttura esistente
    const userModule = await import('./users');
    const defaultUsers = userModule.mockUsers;
    
    localStorage.setItem('db_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  localStorage.setItem('db_users', JSON.stringify(users));
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  await initializeDatabase();
  
  // Recupera i dati dal localStorage o usa i dati predefiniti
  const savedAdminUsers = localStorage.getItem('db_admin_users');
  
  if (savedAdminUsers) {
    return JSON.parse(savedAdminUsers);
  } else {
    // Usa i dati predefiniti dalla struttura esistente
    const userModule = await import('./users');
    const defaultAdminUsers = userModule.mockAdminUsers;
    
    localStorage.setItem('db_admin_users', JSON.stringify(defaultAdminUsers));
    return defaultAdminUsers;
  }
};

export const saveAdminUsers = async (users: AdminUser[]): Promise<void> => {
  localStorage.setItem('db_admin_users', JSON.stringify(users));
};

export const verifyAdminCredentials = async (username: string, password: string): Promise<boolean> => {
  const adminUsers = await getAdminUsers();
  return adminUsers.some(user => 
    user.username === username && 
    user.password === password && 
    user.isActive
  );
};

export const verifyUserCredentials = async (email: string, password: string): Promise<User | null> => {
  // In un'implementazione reale, verificheremmo la password in modo sicuro
  // Per questa demo, accettiamo qualsiasi password per gli utenti esistenti
  const users = await getUsers();
  const user = users.find(user => user.email === email && user.isActive);
  return user || null;
};

export const updateAdminLastLogin = async (username: string): Promise<void> => {
  const adminUsers = await getAdminUsers();
  const updatedUsers = adminUsers.map(user => 
    user.username === username 
      ? { ...user, lastLogin: new Date().toISOString() } 
      : user
  );
  await saveAdminUsers(updatedUsers);
};

export const saveUserSelectedBusinesses = async (email: string, selectedBusinessIds: string[]): Promise<void> => {
  const users = await getUsers();
  const updatedUsers = users.map(user => 
    user.email === email 
      ? { ...user, selectedBusinessIds } 
      : user
  );
  await saveUsers(updatedUsers);
};

export const getUserSelectedBusinesses = async (email: string): Promise<string[]> => {
  const users = await getUsers();
  const user = users.find(user => user.email === email);
  return user?.selectedBusinessIds || [];
};

// Funzione per creare un nuovo utente
export const createUser = async (userData: Omit<User, "id" | "isActive" | "registeredDate" | "selectedBusinessIds">): Promise<User> => {
  const users = await getUsers();
  
  // Verifica se l'email esiste già
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error("Email già registrata");
  }
  
  // Crea il nuovo utente
  const newUser: User = {
    id: (users.length + 1).toString(),
    ...userData,
    isActive: true,
    registeredDate: new Date().toISOString().split('T')[0],
    selectedBusinessIds: []
  };
  
  // Salva l'utente aggiornato
  await saveUsers([...users, newUser]);
  
  return newUser;
};

// Inizializza il database all'avvio dell'applicazione
initializeDatabase();
