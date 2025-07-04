import { useNavbar } from "../contexts/NavbarContext";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const { navbarWidth } = useNavbar();
  const { theme } = useTheme();

  const mainStyle = {
    marginLeft: `${navbarWidth}px`,
    padding: "var(--spacing-lg)",
    minHeight: "100vh",
    backgroundColor: "var(--theme-gradient)",
    color: "var(--theme-text)",
    transition:
      "margin-left var(--transition-normal), background-color var(--transition-normal), color var(--transition-normal)",
  };

  return (
    <div data-theme={theme}>
      <Navbar />
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
