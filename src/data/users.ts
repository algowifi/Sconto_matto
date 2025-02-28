
import { createUser as dbCreateUser, getUsers as dbGetUsers, saveUsers as dbSaveUsers, getUserSelectedBusinesses as dbGetUserSelectedBusinesses, saveUserSelectedBusinesses as dbSaveUserSelectedBusinesses, getAdminUsers as dbGetAdminUsers, saveAdminUsers as dbSaveAdminUsers, verifyAdminCredentials as dbVerifyAdminCredentials, verifyUserCredentials as dbVerifyUserCredentials, updateAdminLastLogin as dbUpdateAdminLastLogin } from './database';

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
    plan: "Medium",
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
export const getUsers = async (): Promise<User[]> => {
  return await dbGetUsers();
};

export const saveUsers = async (users: User[]): Promise<void> => {
  await dbSaveUsers(users);
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  return await dbGetAdminUsers();
};

export const saveAdminUsers = async (users: AdminUser[]): Promise<void> => {
  await dbSaveAdminUsers(users);
};

export const verifyAdminCredentials = async (username: string, password: string): Promise<boolean> => {
  return await dbVerifyAdminCredentials(username, password);
};

export const verifyUserCredentials = async (email: string, password: string): Promise<User | null> => {
  return await dbVerifyUserCredentials(email, password);
};

export const updateAdminLastLogin = async (username: string): Promise<void> => {
  await dbUpdateAdminLastLogin(username);
};

export const saveUserSelectedBusinesses = async (email: string, selectedBusinessIds: string[]): Promise<void> => {
  await dbSaveUserSelectedBusinesses(email, selectedBusinessIds);
};

export const getUserSelectedBusinesses = async (email: string): Promise<string[]> => {
  return await dbGetUserSelectedBusinesses(email);
};

// Funzione per creare un nuovo utente
export const createUser = async (userData: { username: string; email: string; plan: string }): Promise<User> => {
  return await dbCreateUser(userData);
};
