import React from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Languages } from "../utils/Languages";
import "../styles/FloatButton.css";

const FloatButton: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLang =
    Languages.find(
      (l) => l.language.toLowerCase() === i18n.language?.toLowerCase(),
    ) || Languages[0];

  const items = Languages.map((l) => ({
    key: l.language.toLowerCase(),
    label: (
      <div className="lang-option-item">
        <img
          src={l.flagUrl}
          alt={`Bandera ${l.label}`}
          className="lang-flag-img"
        />
        <div className="lang-text-container">
          <span className="lang-label-title">{l.label}</span>
          <span className="lang-code-sub">{l.language}</span>
        </div>
      </div>
    ),
  }));

  return (
    <div className="float-lang-wrapper">
      <Dropdown
        menu={{
          items,
          onClick: ({ key }) => i18n.changeLanguage(key),
          selectable: true,
          selectedKeys: [currentLang.language.toLowerCase()],
        }}
        placement="topLeft"
        trigger={["click"]}
      >
        <Button className="float-lang-pill">
          <img
            src={currentLang.flagUrl}
            alt={`Bandera ${currentLang.label}`}
            className="current-flag-img"
          />
          <span className="current-label">{currentLang.label}</span>
          <DownOutlined className="dropdown-arrow" />
        </Button>
      </Dropdown>
    </div>
  );
};

export default FloatButton;
