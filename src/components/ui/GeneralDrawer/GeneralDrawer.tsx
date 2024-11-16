import React from 'react';
import { Drawer, Button } from 'antd';

interface DrawerGeneralProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  renderBody: () => React.ReactNode;
  renderTitle: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;  // Thêm prop renderFooter
  placement?: 'top' | 'right' | 'bottom' | 'left'; // Định vị drawer
  closable?: boolean; // Cho phép đóng drawer bằng cách nhấp vào biểu tượng 'x'
  size?: 'small' | 'default' | 'large'; // Kích thước của drawer
  maskClosable?: boolean; // Cho phép đóng drawer khi nhấp vào lớp phủ
}

const DrawerGeneral: React.FC<DrawerGeneralProps> = ({
  visible,
  onCancel,
  onOk,
  renderBody,
  renderTitle,
  renderFooter, // Nhận renderFooter từ props
  placement = 'right', // Mặc định đặt placement là 'right'
  closable = true, // Mặc định cho phép đóng
  size = 'default', // Mặc định là 'default'
  maskClosable = true, // Mặc định cho phép đóng khi nhấp vào lớp phủ
}) => {
  return (
    <Drawer
      title={renderTitle()}  // Custom title content passed through renderTitle
      visible={visible}
      onClose={onCancel}
      footer={renderFooter ? renderFooter() : (
        <div>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={onOk}>OK</Button>
        </div>
      )}
      placement={placement} // Đặt vị trí drawer (trái, phải, trên, dưới)
      closable={closable} // Cho phép đóng drawer
      size={size} // Kích thước của drawer
      maskClosable={maskClosable} // Cho phép đóng khi nhấp vào lớp phủ
    >
      {renderBody()}
    </Drawer>
  );
};

export default DrawerGeneral;
