import { StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customSessionStorage } from '../storages/session.storage';
import { firebaseStorage } from '../storages/firebase.storage';

interface PersonState {
  firstName: string;
  lastName: string;
}

interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

// type PersonStore = PersonState & Actions;

const storeApiPerson: StateCreator<PersonState & Actions, [['zustand/devtools', never]]> = (
  set
) => ({
  firstName: '',
  lastName: '',

  setFirstName: (value: string) => set((state) => ({ firstName: value }), false, 'setFirstName'),
  setLastName: (value: string) => set((state) => ({ lastName: value }), false, 'setLastName'),
});

export const usePersonStore = create<PersonState & Actions>()(
  devtools(
    persist(storeApiPerson, {
      name: 'person-storage',
      // storage:customSessionStorage
      // storage: firebaseStorage,
    })
  )
);
