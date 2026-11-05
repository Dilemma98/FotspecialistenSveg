
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

import "./adminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error || "Inloggningen misslyckades."
        );
        return;
      }

      navigate("/admin/edit");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Kunde inte ansluta till servern.");
    } finally {
      setIsLoading(false);
    }
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

          {errorMessage && (
            <p role="alert" className="adminLoginError">
              {errorMessage}
            </p>
          )}

          <button
            className="adminLoginButton"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
}
