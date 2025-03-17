export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface ILogin {
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  access_token: string;
}

export type Meta = {
  count: number;
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export interface SkillEmployerFormData {
  user_id: string;
  name: string;
  description?: string;
}

export interface Level {
  name: string;
  key: string;
  description: string;
}

export interface City {
  _id: string;
  name: string;
  code: number;
  division_type: string;
  codename: string;
  // Các thuộc tính khác nếu có
}

export interface District {
  _id: string;
  name: string;
  code: number;
  codename: string;
  division_type: string;
  // Các thuộc tính khác nếu có
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface Job {
  _id: string; // ID công việc
  user_id: {
    _id: string;
    social_links: Array<{
      _id: string;
      user_id: string;
      type: string;
      url: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }>;
    avatar_company: string;
    banner_company: string;
    company_name: string;
    organization: {
      _id: string;
      owner: string;
      industry_type: string;
      organization_type: string;
      year_of_establishment: string;
      team_size: string;
      company_website: string;
      company_vision: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
  title: string; // Tiêu đề công việc
  description: string; // Mô tả công việc (HTML string)
  address: string;
  city_id: {
    _id: string;
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
  };
  district_id: {
    _id: string;
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
  };
  ward_id: {
    _id: string;
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
  };
  age_range: {
    min: number;
    max: number;
  };
  salary_type: string; // Loại lương (vd: yearly, monthly)
  job_contract_type: {
    _id: string;
    name: string;
    key: string;
    description: string;
    user_id: string;
  };
  job_type: {
    _id: string;
    name: string;
    key: string;
    description: string;
    user_id: string;
  };
  min_experience: string; // Kinh nghiệm tối thiểu
  professional_skills: Array<{
    title: string;
    items: string[];
    _id: string;
  }>;
  skill_name: string[];
  company_name: string;
  general_requirements: Array<{
    requirement: string;
  }>;
  job_responsibilities: Array<{
    responsibility: string;
  }>;
  interview_process: Array<{
    process: string;
  }>;
  benefit: string[]; // Mảng chuỗi chứa các quyền lợi
  level: {
    _id: string;
    name: string;
    key: string;
    description: string;
    user_id: string;
    updatedAt: string;
  };
  expire_date: string; // Ngày hết hạn công việc (ISO string)
  type_money: {
    _id: string;
    name: string;
    code: string;
    symbol: string;
    key: string;
    user_id: string;
  };
  degree: {
    _id: string;
    name: string;
    key: string;
    description: string;
    user_id: string;
  };
  count_apply: number;
  is_negotiable: boolean;
  skills: Array<{
    _id: string;
    name: string;
    __v: number;
  }>;
  is_active: boolean;
  is_expired: boolean;
  candidate_ids: string[];
  apply_linkedin: string;
  apply_website: string;
  apply_email: string;
  salary_range_max: number;
  salary_range_min: number;
  posted_date: string;
  createdAt: string; // Ngày tạo dưới dạng chuỗi ISO 8601
  updatedAt: string; // Ngày cập nhật cuối (ISO string)
  __v: number; // Phiên bản tài liệu
}

interface ChangeDetail {
  old?: string;
  new: string;
}

interface Changes {
  [key: string]: ChangeDetail;
}

interface DeviceInfo {
  os: string;
  device: string;
  browser: string;
}

export interface Activities {
  _id: string;
  userId: string;
  action: string;
  entityId: string;
  entityCollection: string;
  description: string;
  changes: Changes;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  activityDetail: string;
  createdAt: string;
  updatedAt: string;
  changesLink: {
    link: string;
    name: string;
  };
  __v: number;
}

interface EmployerApplication {
  _id: string;
  full_name: string;
  phone: string;
  address: string;
  role: string;
}

interface JobApplication {
  _id: string;
  user_id: string;
  title: string;
  description: string;
  requirement: string[];
}

interface UserApplication {
  _id: string;
  full_name: string;
  phone: string;
  address: string;
  role: string;
}

export interface Application {
  _id: string; // MongoDB document ID
  applied_date: string; // Date of application in ISO format
  cover_letter: string; // Cover letter content
  cv_id: string; // CV identifier
  employer_id: EmployerApplication; // Employer's details (referenced from `Employer`)
  job_id: JobApplication; // Job details (referenced from `Job`)
  status: "pending" | "accepted" | "rejected"; // Application status
  user_id: UserApplication; // Applicant's details (referenced from `User`)
  __v: number; // MongoDB version key (internal versioning)
}

export interface FilterSection {
  title: string;
  items: {
    label: string;
    count: number;
    value: string;
  }[];
}
