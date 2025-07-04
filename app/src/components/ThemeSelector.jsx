import { useTheme } from "../contexts/ThemeContext";
import "./ThemeSelector.css";

const ThemeSelector = ({ navbar = false, collapsed = false }) => {
  const { currentTheme, changeTheme, themes } = useTheme();

  return (
    <div
      className={`theme-selector ${navbar ? "theme-selector--navbar" : ""} ${
        collapsed ? "theme-selector--collapsed" : ""
      }`}
    >
      {!collapsed && <div className="theme-selector-icon">🎨</div>}

      <select
        value={currentTheme}
        onChange={(e) => changeTheme(e.target.value)}
        className="theme-selector-dropdown"
        title={
          collapsed
            ? `Thème: ${themes[currentTheme]?.name}`
            : "Changer le thème"
        }
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {collapsed ? theme.icon : `${theme.icon} ${theme.name}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
