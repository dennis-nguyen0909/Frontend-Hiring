export interface IBackendRes<T> {
    error?:string | string[];
    message:string;
    statusCode:number | string;
    data?:T;
  }
  
  export interface ILogin {
    user:{
      user_id:string;
      name:string;
      email:string;
    }
    access_token:string;
  }

  export type Meta = {
    count: number,
    current_page: number,
    per_page: number,
    total: number,
    total_pages: number
  }

  export interface SkillEmployerFormData {
    user_id: string
    name: string
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
    benefit: string[];            // Mảng chuỗi chứa các quyền lợi
    city_id: City;                // Thông tin thành phố
    createdAt: string;            // Ngày tạo dưới dạng chuỗi ISO 8601
    degree: string;               // Trình độ học vấn yêu cầu
    description: string;          // Mô tả công việc (HTML string)
    district_id: District;        // Thông tin quận
    expire_date: string;          // Ngày hết hạn công việc (ISO string)
    image: string;                // Đường dẫn ảnh công việc (nếu có)
    job_type: string;             // Loại công việc (vd: fulltime)
    level: string;                // Cấp bậc công việc (vd: junior)
    require_experience: string[]; // Kinh nghiệm yêu cầu (mảng chuỗi)
    requirement: string[];        // Các yêu cầu khác (mảng chuỗi)
    salary_range: SalaryRange;    // Mức lương (min, max)
    salary_type: string;          // Loại lương (vd: monthly)
    skills: string[];             // Kỹ năng yêu cầu (mảng chuỗi)
    title: string;                // Tiêu đề công việc
    updatedAt: string;            // Ngày cập nhật cuối (ISO string)
    user_id: string;              // ID người dùng đã tạo công việc
    ward_id: string;       
    is_active:boolean;       // ID phường/xã
    __v: number;                  // Phiên bản tài liệu
    _id: string;                  // ID công việc
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
    _id: string;                // MongoDB document ID
    applied_date: string;       // Date of application in ISO format
    cover_letter: string;       // Cover letter content
    cv_id: string;              // CV identifier
    employer_id: EmployerApplication;      // Employer's details (referenced from `Employer`)
    job_id: JobApplication;                // Job details (referenced from `Job`)
    status: 'pending' | 'accepted' | 'rejected';  // Application status
    user_id: UserApplication;              // Applicant's details (referenced from `User`)
    __v: number;                // MongoDB version key (internal versioning)
  }
  