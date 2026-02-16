import { type VaultEntry, Vault } from '../types/vault.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VaultState {
    vault: Vault | null;
    isUnlocked: boolean;
}

const initialState: VaultState = {
    vault: null,
    isUnlocked: false,
};

const vaultSlice = createSlice({
    name: "vault",
    initialState,
    reducers: {

        //Unlock vault after successful decrypt
        setVault(state, action: PayloadAction<Vault>) {
            state.vault = action.payload;
            state.isUnlocked = true;
        },

        //Lock vault (logout or manual lock)
        clearVault(state) {
            state.vault = null;
            state.isUnlocked = false;
        },

        //Add entry
        addEntry(state, action: PayloadAction<VaultEntry>) {
            if (!state.vault) return;

            state.vault.entries.unshift(action.payload);
            state.vault.updatedAt = Date.now();
        },

        //Update entry
        updateEntry(state, action: PayloadAction<VaultEntry>) {
            if (!state.vault) return;
            let index = -1;
            index = state.vault.entries.findIndex(
                (e) => e.id === action.payload.id
            );

            if (index !== -1) {
                state.vault.entries[index] = action.payload;
                state.vault.updatedAt = Date.now();
            }
        },

        // Delete entry
        deleteEntry(state, action: PayloadAction<string>) {
            if (!state.vault) return;

            state.vault.entries = state.vault.entries.filter(
                (e) => e.id !== action.payload
            );

            state.vault.updatedAt = Date.now();
        },
    },
});

export const { setVault,
    clearVault,
    addEntry,
    updateEntry,
    deleteEntry } = vaultSlice.actions;

export default vaultSlice.reducer;
