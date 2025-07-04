import { useEffect, useState } from "react";

export default function TestUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/api/test-user", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Test du contexte utilisateur (req.user)</h2>
      {error && <div style={{ color: "red" }}>Erreur : {error}</div>}
      <pre style={{ background: "#eee", padding: 16, borderRadius: 8 }}>
        {user ? JSON.stringify(user, null, 2) : "Chargement..."}
      </pre>
      <p>
        <b>
          Vérifiez que les champs <code>id</code> et <code>code</code> sont bien
          présents.
        </b>
      </p>
    </div>
  );
}
