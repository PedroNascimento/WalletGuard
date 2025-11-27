import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    console.log("Initial theme from localStorage:", savedTheme);
    return (savedTheme as Theme) || "light";
  });

  useEffect(() => {
    console.log("Theme changed to:", theme);
    const root = window.document.documentElement;

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Add the current theme class
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);

    console.log("Document classes:", root.className);
  }, [theme]);

  const toggleTheme = () => {
    console.log("toggleTheme called, current theme:", theme);
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log("New theme will be:", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
