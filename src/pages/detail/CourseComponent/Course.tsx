import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { BookOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

interface CourseProps {
  course_name: string;
  organization_name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  
  course_link?: string;
  course_image?: string;
  onEdit?: () => void;
}

export default function Course({
  course_name,
  organization_name,
  description,
  start_date,
  end_date,
  course_link,
  course_image,
  onEdit,
}: CourseProps) {
  return (
    <div>
      <Card
        className="w-full shadow-sm hover:shadow-md transition-shadow mt-5"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex items-start gap-4">
          {/* Course Icon/Image */}
          <div className="flex-shrink-0">
            {course_image ? (
              <Avatar
                size={64}
                shape="square"
                src={course_image}
                className="bg-gray-100"
              />
            ) : (
              <Avatar
                size={64}
                shape="square"
                className="bg-gray-100 flex items-center justify-center"
              >
                <BookOutlined className="text-2xl text-gray-400" />
              </Avatar>
            )}
          </div>

          {/* Course Details */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <Title level={4} className="!mb-1">
                  {course_name}
                </Title>
                <Text className="block text-gray-600">{organization_name}</Text>
                <Text className="block text-gray-500">{description}</Text>
                <Text className="block text-gray-500 text-sm">
                  {`Từ: ${moment(start_date).format('YYYY-MM-DD')} đến: ${end_date ? moment(end_date).format('YYYY-MM-DD') : 'Hiện tại'}`}
                </Text>
              </div>

              <div className="flex gap-2">
                {course_link && (
                  <Button
                    type="text"
                    icon={<LinkOutlined />}
                    href={course_link}
                    target="_blank"
                    className="text-gray-500 hover:text-blue-500"
                  />
                )}
                {onEdit && (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={onEdit}
                    className="text-gray-500 hover:text-blue-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}