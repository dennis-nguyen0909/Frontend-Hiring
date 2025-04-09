// components/Modals/AccountSetupModal.tsx
import { Modal } from "antd";
import AccountSetup from "../pages/auth/Account/SetupEmployer";
import CompanyInfo from "../pages/auth/Account/CompanyInfo";
import FoundingInfo from "../pages/auth/Account/FoundingInfo";
import SocialLinks from "../pages/auth/Account/SocialLinks";
import Contact from "../pages/auth/Account/Contact";
import Completed from "../pages/auth/Account/Completed";

const tabs = [
  { id: "company", label: "Thông tin công ty", content: <CompanyInfo /> },
  { id: "founding", label: "Thông tin thành lập", content: <FoundingInfo /> },
  {
    id: "social",
    label: "Hồ sơ truyền thông xã hội",
    content: <SocialLinks />,
  },
  { id: "contact", label: "Liên hệ", content: <Contact /> },
  { id: "completed", label: "Hoàn thành", content: <Completed /> },
];

export const AccountSetupModal = ({ visible, activeTab }: any) => (
  <Modal
    footer={null}
    width={"85%"}
    style={{ top: 50 }}
    visible={visible}
    closable={false}
  >
    <AccountSetup tabs={tabs} activeTab={activeTab} />
  </Modal>
);
