"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const WindowSizeContext = createContext<number>(1);

export const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  const [windowAspectRatio, setWindowAspectRatio] = useState<number>(1);

  useEffect(() => {
    const updateAspectRatio = () => {
      setWindowAspectRatio(window.innerWidth / window.innerHeight);
    };

    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);
    
    return () => window.removeEventListener("resize", updateAspectRatio);
  }, []);

  return (
    <WindowSizeContext.Provider value={windowAspectRatio}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowAspectRatio = () => useContext(WindowSizeContext);
