import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./adminLayout.css";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    setIsLoggingOut(true);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      setIsLoggedIn(!!data.session);
      setIsLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
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
