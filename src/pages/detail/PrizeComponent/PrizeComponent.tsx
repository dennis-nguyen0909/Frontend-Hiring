import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { TrophyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import Image from 'next/image';
import moment from 'moment';

const { Title, Text } = Typography;

interface PrizeProps {
  user_id: string;
  prize_name: string;
  organization_name: string;
  date_of_receipt: Date;
  prize_link: string;
  prize_image: string;
  onEdit?: () => void;
}

export default function  PrizeComponent({
  prize_name,
  organization_name,
  date_of_receipt,
  prize_link,
  prize_image,
  onEdit
}: PrizeProps) {
  return (
    <div>
      <Card 
        className="w-full shadow-sm hover:shadow-md transition-shadow mt-5"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex items-start gap-4">
          {/* Prize Icon/Image */}
          <div className="flex-shrink-0">
            {prize_image ? (
              <Avatar 
                size={64} 
                shape="square"
                src={prize_image}
                className="bg-gray-100"
              />
            ) : (
              <Avatar 
                size={64} 
                shape="square" 
                className="bg-gray-100 flex items-center justify-center"
              >
                <TrophyOutlined className="text-2xl text-gray-400" />
              </Avatar>
            )}
          </div>

          {/* Prize Details */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <Title level={4} className="!mb-1">
                  {prize_name}
                </Title>
                <Text className="block text-gray-600">
                  {organization_name}
                </Text>
                <Text className="block text-gray-500 text-sm">
                  {moment(date_of_receipt).format('YYYY-MM')}
                </Text>
              </div>
              
              <div className="flex gap-2">
                {prize_link && (
                  <Button 
                    type="text" 
                    icon={<LinkOutlined />}
                    href={prize_link}
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
