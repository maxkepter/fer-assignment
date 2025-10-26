import { UserContext } from "../UserContext";
import { useState } from "react";
export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: "Guest" });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
