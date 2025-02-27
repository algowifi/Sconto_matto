export interface User {
  id: string;
  username: string;
  email: string;
  plan: string;
  isActive: boolean;
  registeredDate: string;
  selectedBusinessIds?: string[]; // Aggiunto per salvare le scelte dell'utente
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
  lastLogin?: string;
}

// Utenti normali predefiniti
export const mockUsers: User[] = [
  {
    id: "1",
    username: "mario_rossi",
    email: "mario@example.com",
    plan: "Base",
    isActive: true,
    registeredDate: "2023-08-15",
    selectedBusinessIds: []
  },
  {
    id: "2",
    username: "giulia_bianchi",
    email: "giulia@example.com",
    plan: "Premium",
    isActive: true,
    registeredDate: "2023-10-22",
    selectedBusinessIds: []
  },
  {
    id: "3",
    username: "roberto_verdi",
    email: "roberto@example.com",
    plan: "Medium",
    isActive: false,
    registeredDate: "2023-11-30",
    selectedBusinessIds: []
  },
];

// Utenti amministratori predefiniti
export const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    username: "admin",
    password: "test1",
    isActive: true,
    lastLogin: new Date().toISOString(),
  }
];

// Funzioni di utilità per il salvataggio e il recupero dei dati
export const getUsers = (): User[] => {
  const savedUsers = localStorage.getItem("users");
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }
  localStorage.setItem("users", JSON.stringify(mockUsers));
  return mockUsers;
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const getAdminUsers = (): AdminUser[] => {
  const savedAdminUsers = localStorage.getItem("admin_users_data");
  if (savedAdminUsers) {
    return JSON.parse(savedAdminUsers);
  }
  localStorage.setItem("admin_users_data", JSON.stringify(mockAdminUsers));
  return mockAdminUsers;
};

export const saveAdminUsers = (users: AdminUser[]): void => {
  localStorage.setItem("admin_users_data", JSON.stringify(users));
};

export const verifyAdminCredentials = (username: string, password: string): boolean => {
  const adminUsers = getAdminUsers();
  return adminUsers.some(user => 
    user.username === username && 
    user.password === password && 
    user.isActive
  );
};

export const verifyUserCredentials = (email: string, password: string): User | null => {
  // In un'implementazione reale, verificheremmo la password in modo sicuro
  // Per questa demo, accettiamo qualsiasi password per gli utenti esistenti
  const users = getUsers();
  const user = users.find(user => user.email === email && user.isActive);
  return user || null;
};

export const updateAdminLastLogin = (username: string): void => {
  const adminUsers = getAdminUsers();
  const updatedUsers = adminUsers.map(user => 
    user.username === username 
      ? { ...user, lastLogin: new Date().toISOString() } 
      : user
  );
  saveAdminUsers(updatedUsers);
};

export const saveUserSelectedBusinesses = (email: string, selectedBusinessIds: string[]): void => {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.email === email 
      ? { ...user, selectedBusinessIds } 
      : user
  );
  saveUsers(updatedUsers);
};

export const getUserSelectedBusinesses = (email: string): string[] => {
  const users = getUsers();
  const user = users.find(user => user.email === email);
  return user?.selectedBusinessIds || [];
};
