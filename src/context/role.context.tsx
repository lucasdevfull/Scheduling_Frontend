// import React, { createContext, useState } from "react";
// import { ROLE } from "../constants/roles";

// interface RoleProviderProps {
//   children: React.ReactNode;
// }
// type Role = (typeof ROLE)[keyof typeof ROLE]

// interface RoleContextValue {
//   role: Role;
//   setRole: React.Dispatch<React.SetStateAction<Role>>;
// }

// const RoleContext = createContext<RoleContextValue | undefined>(undefined);

// export function RoleProvider({ children }: RoleProviderProps) {
//   const [role, setRole] = useState<Role>(ROLE.USER);

//   return (
//     <RoleContext.Provider value={{ role, setRole }}>
//       {children}
//     </RoleContext.Provider>
//   );
// }
