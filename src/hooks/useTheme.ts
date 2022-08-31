import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function useTheme() {
  const value = useContext(ThemeContext);
  
  return value;
}

export { useTheme };