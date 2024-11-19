import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';

// Bước 1: Thêm Job
const AddJobStep1 = ({ onNext }) => {
  return (
    <Form onFinish={onNext}>
      <Form.Item label="Job Title" name="title" rules={[{ required: true, message: 'Please input the job title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Next</Button>
      </Form.Item>
    </Form>
  );
};

// Bước 2: Thêm Mô tả Job
const AddJobStep2 = ({ onNext }) => {
  return (
    <Form onFinish={onNext}>
      <Form.Item label="Job Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Next</Button>
      </Form.Item>
    </Form>
  );
};

// Bước 3: Xác nhận Job
const AddJobStep3 = ({ onFinish }) => {
  return (
    <div>
      <h3>Confirm Job Details</h3>
      <Button type="primary" onClick={onFinish}>Submit</Button>
    </div>
  );
};

// Main Component
const JobTab = () => {
  const [currentStep, setCurrentStep] = useState(0); // currentStep 0, 1, 2, ...
  
  const handleNext = (values) => {
    setCurrentStep(currentStep + 1);
  };

  const handleFinish = () => {
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AddJobStep1 onNext={handleNext} />;
      case 1:
        return <AddJobStep2 onNext={handleNext} />;
      case 2:
        return <AddJobStep3 onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setCurrentStep(0)}>Thêm Job</Button>
      <div style={{ marginTop: '20px' }}>
        {/* Render các bước ở đây */}
        {renderStep()}
      </div>
    </div>
  );
};

export default JobTab;
