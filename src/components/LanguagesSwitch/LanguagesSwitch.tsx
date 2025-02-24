import React from "react";
import { Avatar, Dropdown, Image, Space } from "antd";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";

// Import các ảnh
import vietnamFlag from "../../assets/icons/vietnam_icon.png";
import ukFlag from "../../assets/icons/united_kingdom_icon.png";

const languages = [
  {
    code: "vi",
    name: "Tiếng Việt",
    flag: vietnamFlag,
  },
  {
    code: "en",
    name: "English",
    flag: ukFlag,
  },
];

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const items: MenuProps["items"] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div className="flex items-center gap-3 py-1">
        <img
          src={lang.flag}
          alt={`${lang.name} flag`}
          className="w-6 h-6 rounded-sm object-cover"
        />
        <span className="font-medium">{lang.name}</span>
      </div>
    ),
    onClick: () => changeLanguage(lang.code),
  }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      overlayStyle={{
        minWidth: "180px",
        padding: "4px",
      }}
    >
      <button className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-gray-100 bg-white">
        <Space className="flex items-center gap-2">
          <Image
            src={currentLang.flag}
            width={20}
            height={"100%"}
            preview={false}
          />
          <span className="text-sm font-medium">
            {currentLang.code.toUpperCase()}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Space>
      </button>
    </Dropdown>
  );
};

export default LanguageSwitch;
