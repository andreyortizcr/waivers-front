import "../styles/Header.css";
import { RiAdminLine } from "react-icons/ri";
import { Languages } from "../utils/Languages.ts";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { i18n } = useTranslation();
  const lang = i18n.language;

  const loginButton = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-info">
          <div className="header-sides">
            {/** Language selector */}
            <Select
              value={lang}
              className="header-select"
              options={Languages.map((l) => ({
                label: (
                  <span className="option-content">
                    <span className="lang-label">{l.language}</span>
                    <span className="lang-code">{l.label}</span>
                  </span>
                ),
                value: l.language.toLowerCase(),
              }))}
              onChange={(value) => i18n.changeLanguage(value)}
            />

            {/** Button to admin panel */}
            <button
              className="admin-button"
              type="button"
              onClick={loginButton}
            >
              <RiAdminLine className="admin-icon" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
