
import { useContext } from "react";
import { SoraRunesContext } from "./SoraRunesProvider";
import { SoraRunesContextType } from "./types";

// Custom hook for using SoraRunes context
export const useSoraRunes = (): SoraRunesContextType => {
  const context = useContext(SoraRunesContext);
  if (context === undefined) {
    throw new Error("useSoraRunes must be used within a SoraRunesProvider");
  }
  return context;
};
