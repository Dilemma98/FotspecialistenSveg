
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import "./adminLayout.css";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      setIsLoggingOut(true);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session", {
          method: "GET",
          credentials: "include",
        });

        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <p>Kontrollerar inloggning...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to={isLoggingOut ? "/" : "/admin"} replace />;
  }

  return (
    <>
      <div className="adminToolbar">
        <div className="adminToolbarInfo">
          <span className="adminToolbarIcon">✎</span>

          <div>
            <strong>REDIGERINGSLÄGE</strong>
            <span>Du redigerar Fotspecialistens webbplats</span>
          </div>
        </div>

        <button
          type="button"
          className="adminLogoutButton"
          onClick={handleLogout}
        >
          <span>Logga ut</span>
          <span>↗</span>
        </button>
      </div>

      <Outlet />
    </>
  );
}
