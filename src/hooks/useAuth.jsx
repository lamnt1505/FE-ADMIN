import { useEffect, useState } from "react";

const useAuth = () => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    accountName: null,
    role: null,
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("account");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuth({
          isLoggedIn: parsed.isLoggedIn,
          accountName: parsed.accountName,
          role: parsed.role,
        });
      }
    };

    window.addEventListener("storage", handleStorage);

    handleStorage();

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return auth;
};

export default useAuth;
