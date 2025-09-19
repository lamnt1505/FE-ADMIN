import { useState, useEffect } from "react";

const useAuthCookie = () => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    accountId: null,
    accountName: null,
    role: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem("account");
    const storedName = localStorage.getItem("accountName");
    const storedId = localStorage.getItem("accountId");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuth({
          isLoggedIn: parsed.isLoggedIn || false,
          accountId: storedId || null,
          accountName: storedName || null,
          role: parsed.role || null,
        });
      } catch (e) {
        console.error("Lỗi parse account:", e);
      }
    }
  }, []);

  return auth;
};

export default useAuthCookie;
