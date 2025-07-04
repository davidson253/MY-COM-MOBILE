import { useTheme } from "../../contexts/ThemeContext";
import { FiDroplet, FiEye, FiSun, FiMoon } from "react-icons/fi";
import ThemeSelector from "../../components/ThemeSelector";
import DTIcon from "../../components/DTIcon";
import "./styles/ThemeDemo.css";

export default function ThemeDemo() {
  const { theme, themes } = useTheme();

  const demoComponents = [
    {
      title: "Boutons",
      content: (
        <div className="demo-buttons">
          <button className="btn-primary">Primaire</button>
          <button className="btn-secondary">Secondaire</button>
          <button className="btn-success">Succès</button>
          <button className="btn-warning">Attention</button>
          <button className="btn-danger">Danger</button>
        </div>
      ),
    },
    {
      title: "Formulaires",
      content: (
        <div className="demo-form">
          <input
            type="text"
            placeholder="Champ de texte"
            className="demo-input"
          />
          <select className="demo-select">
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <textarea
            placeholder="Zone de texte"
            className="demo-textarea"
          ></textarea>
        </div>
      ),
    },
    {
      title: "Cartes",
      content: (
        <div className="demo-cards">
          <div className="demo-card">
            <h4>Carte Standard</h4>
            <p>Contenu de la carte avec du texte descriptif.</p>
          </div>
          <div className="demo-card demo-card--highlighted">
            <h4>Carte en Surbrillance</h4>
            <p>Cette carte attire l'attention.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Navigation",
      content: (
        <div className="demo-nav">
          <nav className="demo-navbar">
            <a href="#" className="demo-nav-link active">
              Accueil
            </a>
            <a href="#" className="demo-nav-link">
              Articles
            </a>
            <a href="#" className="demo-nav-link">
              Commandes
            </a>
          </nav>
        </div>
      ),
    },
    {
      title: "Tableaux",
      content: (
        <table className="demo-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Article 1</td>
              <td className="demo-price">125.50 DT</td>
              <td>
                <span className="demo-badge demo-badge--success">En stock</span>
              </td>
            </tr>
            <tr>
              <td>Article 2</td>
              <td className="demo-price">89.90 DT</td>
              <td>
                <span className="demo-badge demo-badge--warning">Faible</span>
              </td>
            </tr>
            <tr>
              <td>Article 3</td>
              <td className="demo-price">200.00 DT</td>
              <td>
                <span className="demo-badge demo-badge--danger">Rupture</span>
              </td>
            </tr>
          </tbody>
        </table>
      ),
    },
  ];

  return (
    <div className="theme-demo">
      <div className="theme-demo-header">
        <div>
          <h1 className="theme-demo-title">
            <FiDroplet />
            Démo des Thèmes
          </h1>
          <p className="theme-demo-subtitle">
            Testez l'apparence de l'interface avec différents thèmes
          </p>
        </div>

        <div className="theme-demo-controls">
          <div className="current-theme-info">
            <span className="current-theme-label">Thème actuel:</span>
            <span className="current-theme-name">{themes[theme]}</span>
          </div>
          <ThemeSelector />
        </div>
      </div>

      <div className="theme-demo-grid">
        {demoComponents.map((component, index) => (
          <div key={index} className="theme-demo-section">
            <h3 className="theme-demo-section-title">{component.title}</h3>
            <div className="theme-demo-content">{component.content}</div>
          </div>
        ))}
      </div>

      <div className="theme-demo-colors">
        <h3 className="theme-demo-section-title">Palette de Couleurs</h3>
        <div className="color-palette">
          <div className="color-swatch">
            <div
              className="color-preview"
              style={{ backgroundColor: "var(--color-primary)" }}
            ></div>
            <span>Primaire</span>
          </div>
          <div className="color-swatch">
            <div
              className="color-preview"
              style={{ backgroundColor: "var(--color-secondary)" }}
            ></div>
            <span>Secondaire</span>
          </div>
          <div className="color-swatch">
            <div
              className="color-preview"
              style={{ backgroundColor: "var(--color-success)" }}
            ></div>
            <span>Succès</span>
          </div>
          <div className="color-swatch">
            <div
              className="color-preview"
              style={{ backgroundColor: "var(--color-warning)" }}
            ></div>
            <span>Attention</span>
          </div>
          <div className="color-swatch">
            <div
              className="color-preview"
              style={{ backgroundColor: "var(--color-danger)" }}
            ></div>
            <span>Danger</span>
          </div>
        </div>
      </div>

      <div className="theme-demo-info">
        <h3 className="theme-demo-section-title">
          <FiEye />
          Informations sur le Thème
        </h3>
        <div className="theme-info-grid">
          <div className="theme-info-item">
            <strong>Thème actuel:</strong> {themes[theme]}
          </div>
          <div className="theme-info-item">
            <strong>Mode:</strong> {theme === "dark" ? "Sombre" : "Clair"}
          </div>
          <div className="theme-info-item">
            <strong>Stockage:</strong> localStorage
          </div>
          <div className="theme-info-item">
            <strong>Transitions:</strong> Activées
          </div>
        </div>
      </div>
    </div>
  );
}
