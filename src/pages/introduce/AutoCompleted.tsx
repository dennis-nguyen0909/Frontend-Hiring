import React, { useState } from 'react';
import { AutoComplete, Input, Option, Select } from 'antd';

const jobsData = [
  {
    "_id": "674b0c123ec5c98f8f1529fe",
    "title": "BACKEND",
    "description": "<p>1231</p>",
    "address": "E2/55 AP 5 TO 2 XA PHONG PHU",
  },
  {
    "_id": "674b1873c7dc4adbe33625ee",
    "title": "duydeptrai",
    "description": "<p>23</p>",
    "address": "E2/55 AP 5 TO 2 XA PHONG PHU",
  },
  {
    "_id": "674bd8d7d85427a4228c8a82",
    "title": "DEVOPS",
    "description": "",
    "address": "123",
  }
];

const JobSelection = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  const handleSearch = (searchText: string) => {
    setValue(searchText);
    if (searchText) {
      const filteredJobs = jobsData.filter((job) => 
        job.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setOptions(filteredJobs);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
  };

  return (
    <AutoComplete
      value={value}
      style={{ width: '100%' }}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="Select a job title"
    >
      {options.map((job) => (
        <Select.Option key={job._id} value={job.title}>
          {job.title}
        </Select.Option>
      ))}
    </AutoComplete>
  );
};

export default JobSelection;
