import { useEffect, useState } from "react";

export default function TestToken() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    try {
      const info = localStorage.getItem("userInfo");
      setUserInfo(info ? JSON.parse(info) : null);
    } catch (e) {
      setUserInfo(null);
    }
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Test du token JWT (localStorage)</h2>
      <div>
        <b>Token :</b>
        <pre
          style={{
            background: "#eee",
            padding: 16,
            borderRadius: 8,
            wordBreak: "break-all",
          }}
        >
          {token || "Aucun token trouvé dans localStorage"}
        </pre>
      </div>
      <div>
        <b>userInfo :</b>
        <pre style={{ background: "#eee", padding: 16, borderRadius: 8 }}>
          {userInfo
            ? JSON.stringify(userInfo, null, 2)
            : "Aucune info utilisateur trouvée"}
        </pre>
      </div>
      <p>
        <b>Connectez-vous dans l’application pour générer un token.</b>
      </p>
    </div>
  );
}
