import React, { useState } from 'react'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

const { Option } = Select

interface Language {
  code: string
  name: string
  flag: React.ReactNode
}

const languages: Language[] = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#DA251D"/>
        <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#FFFF00"/>
      </svg>
    ),
  },
  {
    code: 'en',
    name: 'English',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 30 20">
        <clipPath id="t">
          <path d="M15,10 h15 v10 z v-10 h-15 z h-15 v10 z v-10 h15 z"/>
        </clipPath>
        <path d="M0,0 v20 h30 v-20 z" fill="#00247d"/>
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" stroke-width="3"/>
        <path d="M0,0 L30,20 M30,0 L0,20" clip-path="url(#t)" stroke="#cf142b" stroke-width="2"/>
        <path d="M15,0 v20 M0,10 h30" stroke="#fff" stroke-width="5"/>
        <path d="M15,0 v20 M0,10 h30" stroke="#cf142b" stroke-width="3"/>
      </svg>
    ),
  },
]

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const handleChange = (value: string) => {
    setSelectedLanguage(value)
    console.log(`Selected language: ${value}`)
    // Here you can add logic to change the application's language
  }

  return (
    <Select
      style={{ width: 160 }}
      value={selectedLanguage}
      onChange={handleChange}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      suffixIcon={<GlobalOutlined />}
    >
      {languages.map((lang) => (
        <Option key={lang.code} value={lang.code}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              marginRight: 8, 
              display: 'inline-flex', 
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              {lang.flag}
            </span>
            {lang.name}
          </div>
        </Option>
      ))}
    </Select>
  )
}