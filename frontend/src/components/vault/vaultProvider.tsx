import { createContext, useContext, useRef } from "react";

interface VaultContextType {
  keyRef: React.MutableRefObject<ArrayBuffer | null>;
}

const VaultContext = createContext<VaultContextType | null>(null);

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const keyRef = useRef<ArrayBuffer | null>(null);
  return (
    <VaultContext.Provider value={{ keyRef }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVaultContext = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVaultContext must be used inside VaultProvider");
  }
  return context;
};