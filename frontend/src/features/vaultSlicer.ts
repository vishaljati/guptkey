import { type VaultEntry, Vault } from '../types/vault.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VaultState {
    vault: Vault | null;
    isUnlocked: boolean;
    isDirty?: boolean; // Track if there are unsaved changes
}

const initialState: VaultState = {
    vault: null,
    isUnlocked: false,
    isDirty: false,
};

const vaultSlice = createSlice({
    name: "vault",
    initialState,
    reducers: {

        //Unlock vault after successful decrypt
        setVault(state, action: PayloadAction<Vault>) {
            state.vault = action.payload;
            state.isUnlocked = true;
            state.isDirty = false;
        },

        //Lock vault (logout or manual lock)
        clearVault(state) {
            state.vault = null;
            state.isUnlocked = false;
            state.isDirty = false;
        },
        markClean: (state) => {
            state.isDirty = false;
        },

        //Add entry
        addEntry(state, action: PayloadAction<VaultEntry>) {
            if (!state.vault) return;

            state.vault.entries.unshift(action.payload);
            state.isDirty = true;
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
                state.isDirty = true;
            }
        },

        // Delete entry
        deleteEntry(state, action: PayloadAction<string>) {
            if (!state.vault) return;

            state.vault.entries = state.vault.entries.filter(
                (e) => e.id !== action.payload
            );

            state.vault.updatedAt = Date.now();
            state.isDirty = true;
        },
    },
});

export const {
    setVault,
    clearVault,
    addEntry,
    updateEntry,
    deleteEntry,
    markClean
 } = vaultSlice.actions;

export default vaultSlice.reducer;
