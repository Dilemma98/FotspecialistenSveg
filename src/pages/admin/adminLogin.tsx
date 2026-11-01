import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import {supabase} from "../../lib/supabase";

import "./adminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error("Login error:", error);
      return;
    }
    console.log("Login successful:", data);
    navigate("/admin/edit");
  };

  return (
  <div className="adminOverlay">
    <div className="adminLoginCard">
      <p className="adminLoginEyebrow">Fotspecialisten</p>

      <h1>Välkommen tillbaka</h1>

      <p className="adminLoginDescription">
        Logga in för att hantera webbplatsens innehåll.
      </p>

      <form className="adminLoginForm" onSubmit={handleSubmit}>
        <div className="adminLoginField">
          <label htmlFor="email">E-postadress</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="adminLoginField">
          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="adminLoginButton" type="submit">
          Logga in
        </button>
      </form>
    </div>
  </div>
);
}