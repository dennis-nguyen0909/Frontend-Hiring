import React from "react";
import { Modal } from "antd";

interface GeneralModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk?: () => void;
  renderBody?: any;
  renderFooter?: () => React.ReactNode;
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  visible,
  title,
  onCancel,
  onOk,
  renderBody,
  renderFooter,
}) => {
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      footer={renderFooter ? renderFooter() : null} // Kiểm tra có custom footer không
    >
      {renderBody && renderBody()}  {/* Hiển thị nội dung body nếu có */}
    </Modal>
  );
};

export default GeneralModal;
