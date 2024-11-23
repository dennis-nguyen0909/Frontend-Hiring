import React from "react";
import { Modal } from "antd";

interface GeneralModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk?: () => void;
  renderBody?: any;
  renderFooter?: () => React.ReactNode;
  style?:any;
  width?: string;
  centered?: boolean
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  visible,
  title,
  onCancel,
  onOk,
  renderBody,
  renderFooter,
  style,
  width,
  centered
}) => {
  return (
    <Modal
    width={width}
      centered={centered || true}
      style={style}
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
