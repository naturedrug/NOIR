// hooks/useCurrentUser.js
import { useState, useEffect, useCallback } from "react";
import getCookie from "../components/cookies";

export default function useCurrentUser(router) {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/acc-info", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: getCookie("token"),
          username: getCookie("username"),
        }),
      });
      const data = await response.json();
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!getCookie("token") || !getCookie("username")) {
      router.replace("/auth");
    } else {
      fetchUser();
    }
  }, [router, fetchUser]);

  return user;
}
