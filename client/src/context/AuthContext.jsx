// import { createContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");

//     if (storedUser && storedToken) {
//       fetch("http://localhost:5000/api/users/profile", {
//         headers: { Authorization: storedToken },
//       })
//         .then((res) => {
//           if (res.status === 403) {
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//             setUser(null);
//             return null;
//           }
//           return res.json();
//         })
//         .then((freshUser) => {
//           if (freshUser) {
//             localStorage.setItem("user", JSON.stringify(freshUser));
//             setUser(freshUser);
//           }
//         })
//         .catch(() => {
//           setUser(JSON.parse(storedUser));
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = (userData) => {
//     const { token, ...userInfo } = userData;
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userInfo));
//     setUser(userInfo);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   const updateUser = (updatedFields) => {
//     const updated = { ...user, ...updatedFields };
//     localStorage.setItem("user", JSON.stringify(updated));
//     setUser(updated);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext };







import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      api.get("/users/profile")
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
        })
        .catch(() => {
          setUser(JSON.parse(storedUser));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const { token, ...userInfo } = userData;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };