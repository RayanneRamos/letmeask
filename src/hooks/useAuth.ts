import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function useAuth() {
  const value = useContext(AuthContext);

  return value;
}

export { useAuth };