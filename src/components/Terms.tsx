import "../styles/Terms.css";
import Logo from "../assets/logo-rcr.png";
import { FaArrowRight } from "react-icons/fa6";
import { GoAlert } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Terms() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const formButton = () => {
    navigate("/form");
  };

  return (
    <div className="terms-body">
      <div className="terms-page">
        {/* Header */}
        <div className="terms-header">
          <div className="terms-logo-container">
            <img src={Logo} alt="RCR Logo" className="terms-logo" />
          </div>
          <h2 className="terms-title">{t("terms.termsTitle")}</h2>
          <p className="terms-subtitle">{t("terms.termsDesc")}</p>
        </div>

        {/* Terminos */}
        <div className="terms-card">
          <div className="terms-card-content">
            <div className="terms-text-container">
              <p className="terms-paragraph">{t("terms.terms1")}</p>

              <p className="terms-paragraph">{t("terms.terms2")}</p>

              <p className="terms-paragraph">{t("terms.terms3")}</p>

              <p className="terms-paragraph">{t("terms.terms4")}</p>

              <div className="terms-agreement">
                <p className="terms-agreement-text">{t("terms.agreement")}</p>
              </div>

              {/* Requisitos */}
              <div className="terms-requirements-wrapper">
                <div>
                  <h4 className="terms-requirements-title">
                    {t("terms.reqInfo")}
                  </h4>
                  <ul className="terms-requirements-list">
                    <li>{t("terms.info1a")}</li>
                    <li>{t("terms.info2a")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="terms-requirements-title">
                    {t("terms.reqInfoU18")}
                  </h4>
                  <ul className="terms-requirements-list">
                    <li>{t("terms.info1c")}</li>
                    <li>{t("terms.info2c")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advertencia */}
        <div className="terms-warning">
          <GoAlert className="terms-warning-icon" />
          <div className="terms-warning-textbox">
            <div className="terms-warning-title">
              <strong>{t("terms.warningTitle")}</strong>
            </div>
            <div className="terms-warning-message">{t("terms.warning")}</div>
          </div>
        </div>

        {/* Boton */}
        <div className="terms-button-container">
          <button className="terms-next-button" onClick={formButton}>
            <FaArrowRight className="terms-button-icon" /> {t("terms.button")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Terms;
