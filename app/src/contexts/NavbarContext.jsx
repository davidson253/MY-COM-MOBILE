import { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navbarWidth = isCollapsed ? 70 : 220;

  return (
    <NavbarContext.Provider
      value={{
        isCollapsed,
        toggleNavbar,
        navbarWidth,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

// Hook pour utiliser le contexte de la navbar
export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}
